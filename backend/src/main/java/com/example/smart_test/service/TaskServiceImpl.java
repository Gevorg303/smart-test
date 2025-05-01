package com.example.smart_test.service;

import com.example.smart_test.domain.*;
import com.example.smart_test.dto.*;
import com.example.smart_test.enums.UserRoleEnum;
import com.example.smart_test.mapper.api.ResponseOptionMapperInterface;
import com.example.smart_test.mapper.api.TaskMapperInterface;
import com.example.smart_test.mapper.api.TestMapperInterface;
import com.example.smart_test.mapper.api.UserMapperInterface;
import com.example.smart_test.repository.TaskRepositoryInterface;
import com.example.smart_test.request.EditingTaskRequest;
import com.example.smart_test.service.api.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
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
    @Autowired
    private UserEducationalInstitutionServiceInterface userEducationalInstitutionService;
    @Autowired
    private UserMapperInterface userMapper;
    @Autowired
    private ResponseOptionMapperInterface responseOptionMapper;

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
                responseOptionService.deleteResponseOption(responseOptionMapper.toDTO(responseOption));
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
            //Assert.assertFalse(tasksTheTestList.isEmpty());
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
        UserDto userDto = userService.getUserByLogin(userMapper.toEntity(dto));
        if (userDto == null) {
            throw new IllegalArgumentException("User not found");
        }
        List<SubjectUserDto> allSubjectTeachers = subjectUserService.getAllSubjectTeachers();

        List<SubjectUserDto> subjectTeachers = new ArrayList<>();
        List<UserDto> userList = new ArrayList<>();
        if (userDto.getRole().getRole().equals(UserRoleEnum.ADMIN.getDescription())) {
            for (User user :  userEducationalInstitutionService.getUsersByEducationalInstitutionExcludingSelf(userDto.getId())) {
                userList.add(userMapper.toDTO(user));
            }
        } else {
            userList.add(userDto);
        }
        for (UserDto user : userList) {
            for (SubjectUserDto subjectTeacher : allSubjectTeachers) {
                if (subjectTeacher.getUser() != null && subjectTeacher.getUser().getId().equals(user.getId())) {
                    subjectTeachers.add(subjectTeacher);
                }
            }
        }

        // TODO: Загружаем все темы, индикаторы, задания и связи "задание-индикатор"
        List<ThemeDto> themes = themeService.getAllTheme();
        List<IndicatorDto> indicatorDtoList = indicatorService.getAllIndicators();
        List<TaskDto> allTasks = getAllTasks();
        List<TaskOfIndicatorDto> taskOfIndicatorDtoList = taskOfIndicatorService.getAllTaskOfIndicators();

        Set<TaskDto> uniqueTasks = new HashSet<>();

        for (SubjectUserDto subjectTeacher : subjectTeachers) {
            // TODO: Ищем темы, относящиеся к предмету пользователя
            for (ThemeDto theme : themes) {
                if (theme.getSubject() != null && theme.getSubject().getId().equals(subjectTeacher.getSubject().getId())) {

                    // TODO: Ищем индикаторы, относящиеся к теме
                    for (IndicatorDto indicator : indicatorDtoList) {
                        if (indicator.getTheme() != null && indicator.getTheme().getId().equals(theme.getId())) {

                            // TODO: Ищем связи "задание-индикатор", относящиеся к индикатору
                            for (TaskOfIndicatorDto taskOfIndicator : taskOfIndicatorDtoList) {
                                if (taskOfIndicator.getIndicator() != null && taskOfIndicator.getIndicator().getId().equals(indicator.getId())) {

                                    // TODO: Ищем само задание по ID и добавляем в множество
                                    for (TaskDto task : allTasks) {
                                        if (task.getId().equals(taskOfIndicator.getTask().getId())) {
                                            uniqueTasks.add(task);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return new ArrayList<>(uniqueTasks);
    }



    @Override
    @Transactional
    public void addTaskToTest(Long testId, Long taskId) {
        try {
            Test test = testMapperInterface.toEntity(testService.getTestById(testId));
            Task task = getTaskById(taskId);
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
    @Transactional
    public void removeTaskFromTest(TaskDto taskDto) {
        try {
            Task task = getTaskById(taskDto.getId());
            task.setTest(null);
            taskRepositoryInterface.save(task);
        } catch (Exception e) {
            log.error(
                    "Не удалость удалить задание из теста: e.getMessage(), e)"
            );
        }
    }

    @Override
    @Transactional
    public void updateTask(EditingTaskRequest updatedTask) {
        Task task = taskRepositoryInterface.findById(updatedTask.getTask().getId()).orElse(null);

        if (task == null) {
            throw new EntityNotFoundException("Задание с ID " + updatedTask.getTask().getId() + " не найдено");
        }

        if (updatedTask.getTask() != null) {
            //task.setTest(updatedTask.getTask().getTest());
            task.setTypeTask(updatedTask.getTask().getTypeTask());
            task.setExplanation(updatedTask.getTask().getExplanation());
            task.setTaskText(updatedTask.getTask().getTaskText());
            taskRepositoryInterface.save(task);
        }

        if (updatedTask.getEditingResponseOption() != null) {
            responseOptionService.editingResponseOption(updatedTask);
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
    @Transactional
    public Task getTaskById(Long id) {
        try {
            return taskRepositoryInterface.findById(id)
                    .orElseThrow(() -> new RuntimeException("Задание не найдено"));
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
