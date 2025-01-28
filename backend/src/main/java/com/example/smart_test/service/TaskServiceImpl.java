package com.example.smart_test.service;

import com.example.smart_test.domain.*;
import com.example.smart_test.dto.*;
import com.example.smart_test.mapper.api.TaskMapperInterface;
import com.example.smart_test.mapper.api.TestMapperInterface;
import com.example.smart_test.repository.TaskRepositoryInterface;
import com.example.smart_test.service.api.*;
import lombok.extern.slf4j.Slf4j;
import org.junit.Assert;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Slf4j
@Service
public class TaskServiceImpl implements TaskServiceInterface {
    @Autowired
    private IndicatorServiceInterface indicatorService;
    @Autowired
    private TaskOfIndicatorServiceInterface taskOfIndicatorService;
    @Autowired
    private TaskRepositoryInterface taskRepositoryInterface;
    @Autowired
    private TaskMapperInterface taskMapperInterface;
    @Autowired
    private TestMapperInterface testMapperInterface;
    @Autowired
    private TestServiceInterface testService;
    @Autowired
    private UserServiceInterface userService;
    @Autowired
    private SubjectUserServiceInterface subjectUserService;
    @Autowired
    private ThemeServiceInterface themeService;
    @Autowired
    private ResponseOptionServiceInterface responseOptionService;

    @Override
    @Transactional
    public TaskDto addTask(Task task, List<ResponseOption> responseOption, List<Indicator> indicator) {
        try {
            task = taskRepositoryInterface.save(task);
            for (Indicator indicator1 : indicator) {
                taskOfIndicatorService.addTaskOfIndicator(task, indicator1);
            }
            for (ResponseOption response : responseOption) {
                responseOptionService.addResponseOption(task, response);
            }
            return taskMapperInterface.toDto(task);
        } catch (RuntimeException e) {
            throw new RuntimeException("Ошибка при создании задачи: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional
    public void deleteTask(Task task) {
        if (findTaskById(task.getId())) {
            List<TaskOfIndicator> taskOfIndicatorList = taskOfIndicatorService.findTaskOfIndicatorByIdTask(task);
            for (TaskOfIndicator taskOfIndicator : taskOfIndicatorList) {
                taskOfIndicatorService.deleteTaskOfIndicator(taskOfIndicator);
            }
            List<ResponseOption> responseOptionList = responseOptionService.findAllResponseOptionsByTaskId(task);
            for (ResponseOption responseOption : responseOptionList) {
                responseOptionService.deleteResponseOption(responseOption);
            }
            taskRepositoryInterface.delete(task);
        } else {
            log.error("Задача с идентификатором " + task.getId() + " не найдена");
        }
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public List<TaskDto> getAllTasks() {
        return printAllTasks();
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public List<TaskDto> findTasksTheTest(TestDto dto) {
        try {
            List<Task> tasks = taskRepositoryInterface.findAll();
            List<Task> tasksTheTestList = new ArrayList<>();
            for (Task task : tasks) {
                if (task.getTest() == null) {
                    continue;
                }
                if (Objects.equals(task.getTest().getId(), dto.getId())) {
                    tasksTheTestList.add(task);
                }
            }
            Assert.assertFalse(tasksTheTestList.isEmpty());
            return getDtoList(tasksTheTestList);
        } catch (Exception e) {
            log.error("У данного теста нет заданий: {}", e.getMessage(), e);
        }
        return null;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @Override
    public Set<TaskDto> displayTheAvailableTasks(ThemeDto theme) {
        ThemeDto themeDto = themeService.getThemeById(theme.getId());
        //TestDto fullTestDto = testService.getTestById(dto.getId());
        if (themeDto == null) {
            throw new IllegalArgumentException("Theme with id " + theme.getId() + " not found");
        }

        Set<TaskDto> availableTasks = new HashSet<>();

        Map<Long, TaskOfIndicatorDto> taskOfIndicatorMap = taskOfIndicatorService.getAllTaskOfIndicators()
                .stream()
                .collect(Collectors.toMap(
                        taskOfIndicator -> taskOfIndicator.getTask().getId(),
                        Function.identity(),
                        (existing, replacement) -> existing
                ));

        Map<Long, IndicatorDto> indicatorMap = indicatorService.getAllIndicators()
                .stream()
                .collect(Collectors.toMap(IndicatorDto::getId, Function.identity()));

        for (TaskDto taskDto : printAllTasks()) {
            TaskOfIndicatorDto taskOfIndicator = taskOfIndicatorMap.get(taskDto.getId());

            if (taskOfIndicator != null) {
                IndicatorDto indicator = indicatorMap.get(taskOfIndicator.getIndicator().getId());

                if (indicator != null && Objects.equals(indicator.getTheme().getId(), themeDto.getId())) {
                    if (taskDto.getTest() == null) {
                        availableTasks.add(taskDto);
                    }
                }
            }
        }

        return availableTasks;
    }

    @Override
    public List<TaskDto> getUserTasks(UserDto dto) {
        UserDto userDto = userService.getUserByLogin(dto);
        if (userDto == null) {
            throw new IllegalArgumentException("User not found");
        }

        List<SubjectUserDto> subjectTeachers = subjectUserService.getAllSubjectTeachers()
                .stream()
                .filter(st -> st.getUser() != null && st.getUser().getId().equals(userDto.getId()))
                .toList();

        List<ThemeDto> themes = themeService.getAllTheme();
        List<IndicatorDto> indicatorDtoList = indicatorService.getAllIndicators();
        List<TaskDto> allTasks = getAllTasks();
        List<TaskOfIndicatorDto> taskOfIndicatorDtoList = taskOfIndicatorService.getAllTaskOfIndicators();

        Set<TaskDto> uniqueTasks = new HashSet<>();

        subjectTeachers.stream()
                .flatMap(subjectTeacher -> themes.stream()
                        .filter(theme -> theme.getSubject() != null && theme.getSubject().getId().equals(subjectTeacher.getSubject().getId()))
                        .flatMap(theme -> indicatorDtoList.stream()
                                .filter(indicator -> indicator.getTheme() != null && indicator.getTheme().getId().equals(theme.getId()))
                                .flatMap(indicator -> taskOfIndicatorDtoList.stream()
                                        .filter(taskOfIndicator -> taskOfIndicator.getIndicator() != null && taskOfIndicator.getIndicator().getId().equals(indicator.getId()))
                                        .flatMap(taskOfIndicator -> allTasks.stream()
                                                .filter(task -> task.getId().equals(taskOfIndicator.getTask().getId()))
                                        )
                                )
                        )
                )
                .forEach(uniqueTasks::add);

        return new ArrayList<>(uniqueTasks);
    }


    @Override
    @Transactional
    public void addTaskToTest(Long testId, Long taskId) {
        try {
            Test test = testMapperInterface.toEntity(testService.getTestById(testId));
            Task task = taskMapperInterface.toEntity(getTaskById(taskId));
            task.setTest(test);
            taskRepositoryInterface.save(task);
        } catch (Exception e) {
            log.error(
                    "Не удалость добавить задание:" + taskId +
                            " в тест: " + testId +
                            "Причина: " + e.getMessage(), e);
        }
    }

    @Override
    public void removeTaskFromTest(Long taskId) {
        try {
            Task task = taskMapperInterface.toEntity(getTaskById(taskId));
            task.setTest(null);
            taskRepositoryInterface.save(task);
        } catch (Exception e) {
            log.error(
                    "Не удалость удалить задание из теста: e.getMessage(), e)"
            );
        }
    }

    private List<TaskDto> getDtoList(List<Task> taskList) {
        return taskList.stream()
                .map(taskMapperInterface::toDto)
                .collect(Collectors.toList());
    }

//    @Override
//    @Transactional(propagation = Propagation.REQUIRES_NEW)
//    public List<TaskDto> getFindTask() {
//        try {
//            List<Task> tasks = taskRepositoryInterface.findTasks();
//            return tasks.stream()
//                    .map(taskMapperInterface::toDto)
//                    .collect(Collectors.toList());
//        } catch (Exception e) {
//            throw new RuntimeException("Ошибка при получении доступных задач для теста: " + e.getMessage());
//        }
//    }

    private boolean findTaskById(Long id) {
        Optional<Task> task = taskRepositoryInterface.findById(id);
        return task.isPresent();
    }

    @Override
    public TaskDto getTaskById(Long id) {
        try {
            Task task = taskRepositoryInterface.findById(id)
                    .orElseThrow(() -> new RuntimeException("Задание не найдено"));
            return taskMapperInterface.toDto(task);
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при получении задания: " + e.getMessage(), e);
        }
    }

    private List<TaskDto> printAllTasks() {
        try {
            List<Task> tasks = taskRepositoryInterface.findAll();
            return getDtoList(tasks);
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при получении списка всех задач: " + e.getMessage(), e);
        }
    }
}
