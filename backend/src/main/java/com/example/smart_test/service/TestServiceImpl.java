package com.example.smart_test.service;

import com.example.smart_test.domain.*;
import com.example.smart_test.dto.*;
import com.example.smart_test.enums.TypeTestEnum;
import com.example.smart_test.enums.UserRoleEnum;
import com.example.smart_test.mapper.api.TestMapperInterface;
import com.example.smart_test.mapper.api.TestingAttemptMapperInterface;
import com.example.smart_test.mapper.api.UserMapperInterface;
import com.example.smart_test.repository.TestRepositoryInterface;
import com.example.smart_test.request.*;
import com.example.smart_test.response.ResponseForTask;
import com.example.smart_test.response.ResponseForTest;
import com.example.smart_test.service.api.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Slf4j
public class TestServiceImpl implements TestServiceInterface {
    @Autowired
    private TestMapperInterface testMapper;
    @Autowired
    private TestRepositoryInterface testRepository;
    @Autowired
    private UserServiceInterface userService;
    @Autowired
    private SubjectUserServiceInterface subjectUserService;
    @Autowired
    private ThemeServiceInterface themeService;
    @Autowired
    @Lazy
    private TaskServiceInterface taskService;
    @Lazy
    @Autowired
    private RequestVerificationServiceInterface requestVerificationService;
    @Autowired
    private TaskResultsServiceInterface taskResultsService;
    @Autowired
    private TestingAttemptServiceInterface testingAttemptService;
    @Autowired
    private TestGeneratorServiceInterface testGeneratorService;
    @Autowired
    private TestingAttemptMapperInterface testingAttemptMapper;
    @Autowired
    private UserEducationalInstitutionServiceInterface userEducationalInstitutionService;
    @Autowired
    private UserMapperInterface userMapper;
    @Autowired
    private IndicatorServiceInterface indicatorService;

    @Override
    public TestDto addTestDto(TestDto testDto, List<Task> taskList) {
        Test test = testMapper.toEntity(testDto);
        Test savedTest = testRepository.save(test);
        if (taskList != null) {
            for (Task task : taskList) {
                taskService.addTaskToTest(savedTest.getId(), task.getId());
            }
        }
        return testMapper.toDto(savedTest);
    }

    @Override
    @Transactional
    public void deleteTestDto(TestDto testDto) {
        for (TaskDto taskDto : taskService.findTasksTheTest(testDto)) {
            if (taskDto.getTest() != null) {
                if (taskDto.getTest().getId().equals(testDto.getId())) {
                    taskService.removeTaskFromTest(taskDto);
                }
            }
        }
        for (TestingAttemptDto testingAttempt : testingAttemptService.findByTest(testDto)) {
            taskResultsService.deleteByTestingAttemptId(testingAttempt);
        }
        testingAttemptService.deleteByTestId(testDto);
        testRepository.deleteById(testDto.getId());
    }

    @Override
    public List<TestDto> getAllTestDto() {
        try {
            List<Test> tests = testRepository.findAll();
            return tests.stream()
                    .map(testMapper::toDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при получении всех тестов: " + e.getMessage(), e);
        }
    }

    @Override
    public TestDto getTestById(Long id) {
        try {
            Test test = testRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Тест не найден"));
            return testMapper.toDto(test);
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при получении теста: " + e.getMessage(), e);
        }
    }

    @Override
    public List<TestDto> outputTestsByIDTheme(ThemeDto themeDto) {
        List<TestDto> testDtoList = new ArrayList<>();
        for (TestDto testDto : getAllTestDto()) {
            if (testDto.getTheme().getId().equals(themeDto.getId())) {
                testDtoList.add(testDto);
            }
        }
        return testDtoList;
    }

    @Override
    @Transactional
    public Set<TestDto> getUserTests(UserDto user) {
        if (userService.getUserByLogin(userMapper.toEntity(user)) == null) {
            throw new IllegalArgumentException("User not found");
        }
        List<SubjectUserDto> allSubjectTeachers = subjectUserService.getAllSubjectTeachers();

        // TODO: Фильтруем по текущему пользователю
        Set<SubjectUserDto> subjectTeachers = new HashSet<>();
        List<User> userList = new ArrayList<>();
        if (user.getRole().getRole().equals(UserRoleEnum.ADMIN.getDescription())) {
            userList = userEducationalInstitutionService.getUsersByEducationalInstitutionExcludingSelf(user.getId());
        } else {
            userList.add(userMapper.toEntity(user));
        }
        for (User user1 : userList) {
            for (SubjectUserDto subjectTeacher : allSubjectTeachers) {
                if (subjectTeacher.getUser() != null && subjectTeacher.getUser().getId().equals(user1.getId())) {
                    subjectTeachers.add(subjectTeacher);
                }
            }
        }
        // TODO: Загружаем все темы и все тесты
        List<ThemeDto> allThemes = themeService.getAllTheme();
        List<TestDto> allTests = getAllTestDto();

        Set<TestDto> result = new HashSet<>();

        for (SubjectUserDto subjectTeacher : subjectTeachers) {
            // TODO: Ищем темы, соответствующие предмету
            for (ThemeDto theme : allThemes) {
                if (theme.getSubject() != null && theme.getSubject().equals(subjectTeacher.getSubject())) {

                    // TODO: Ищем тесты, связанные с этой темой
                    for (TestDto test : allTests) {
                        if (test.getTheme() != null && test.getTheme().getId().equals(theme.getId())) {
                            result.add(test);
                        }
                    }
                }
            }
        }

        return result;
    }

    @Override
    @Transactional
    public ResponseForTest endTesting(EndTestingRequest endTestingRequest) {
        TestDto testDto = getTestById(endTestingRequest.getTest().getId());

        int totalScore = 0;
        // Проверяем ответы пользователя
        List<ResponseForTask> responseForTasks = requestVerificationService.checkingResponse(endTestingRequest.getRequestForTaskList());

        // Получаем список заданий
        List<TaskDto> taskList = taskService.findTasksTheTest(testDto);

        // Суммируем баллы
        for (ResponseForTask responseForTask : responseForTasks) {
            totalScore += responseForTask.getTaskScore();
        }

        // Вычисляем итоговый балл
        int testScore = taskList.isEmpty() ? 0 : totalScore / taskList.size();

        TestingAttemptDto testingAttemptDto = testingAttemptService.addTestingAttempt(
                new TestingAttemptDto(
                        endTestingRequest.getStartDateTime(),
                        endTestingRequest.getAttemptDuration(),
                        endTestingRequest.getTest(),
                        endTestingRequest.getUser(),
                        testScore
                )
        );

        for (ResponseForTask responseForTask : responseForTasks) {
            taskResultsService.addTaskResults(responseForTask.getTask(), responseForTask.getTaskScore(), testingAttemptDto);
        }

        // Удаляем задания, если тренировка
        if (Objects.equals(testDto.getTypeTest().getNameOfTestType(), TypeTestEnum.TRAINER.getDescription())) {
            for (TaskDto taskDto : taskList) {
                taskService.removeTaskFromTest(taskDto);
            }
        }

        return new ResponseForTest(testDto, responseForTasks, testScore);
    }

    @Override
    @Transactional
    public List<TaskDto> createTestSimulator(TestSimulatorRequest request) {
        Set<TestDto> testDtoList = getUserTests(request.getUser());
        Set<Task> taskSet = new HashSet<>();
        TestDto trainerTest = null;

        for (TestDto testDto : testDtoList) {
            if (Objects.equals(testDto.getTheme().getId(), request.getTheme().getId())) {
                if (testDto.getTypeTest() != null && testDto.getTypeTest().getNameOfTestType().equals(TypeTestEnum.TRAINER.getDescription())) {
                    trainerTest = findTestByENTRY_TESTType(request.getUser());
                    taskSet.addAll(testGeneratorService.generatorTasks(userMapper.toEntity(request.getUser()), trainerTest, testDto.getNumberOfTasksPerError()));
                    trainerTest = testDto;
                }
            }
            if (trainerTest != null && trainerTest.getTypeTest().getNameOfTestType().equals(TypeTestEnum.TRAINER.getDescription())) {
                List<Task> taskList = new ArrayList<>(taskSet);
                addTestDto(trainerTest, taskList);
                return taskService.findTasksTheTest(trainerTest);
            }
        }
        return Collections.emptyList();
    }

    private TestDto findTestByENTRY_TESTType(UserDto user) {
        Set<TestDto> testDtoList = getUserTests(user);
        for (TestDto testDto : testDtoList) {
            if (Objects.equals(testDto.getTypeTest().getNameOfTestType(), TypeTestEnum.ENTRY_TEST.getDescription())) {
                return testDto;
            }
        }
        return null;
    }

    @Override
    @Transactional
    public List<TestingAttemptDto> findTestingAttemptByTest(TestingAttemptAndTest request) {
        List<TestingAttemptDto> testingAttemptDtoList = new ArrayList<>();
        for (TestingAttempt testingAttempt : testingAttemptService.findTestingAttemptByTest(request.getUser(), testMapper.toEntity(request.getTest()))) {
            testingAttemptDtoList.add(testingAttemptMapper.toDto(testingAttempt));
        }
        return testingAttemptDtoList;
    }

    @Override
    @Transactional
    public void updateTest(EditingTheTestRequest request) {
        if (request.getTestDto() != null) {
            Test test = testRepository.findById(request.getTestDto().getId()).orElse(null);
            if (test != null) {
                test.setClosingDateAndTime(request.getTestDto().getClosingDateAndTime());
                test.setPassageTime(request.getTestDto().getPassageTime());
                test.setOpeningDateAndTime(request.getTestDto().getOpeningDateAndTime());
                test.setTheme(request.getTestDto().getTheme());
                test.setTypeTest(request.getTestDto().getTypeTest());
                test.setNumberOfAttemptsToPass(request.getTestDto().getNumberOfAttemptsToPass());
                test.setDescription(request.getTestDto().getDescription());
                test.setTestPassword(request.getTestDto().getTestPassword());
                test.setNumberOfTasksPerError(request.getTestDto().getNumberOfTasksPerError());
                test.setPassThreshold(request.getTestDto().getPassThreshold());
                testRepository.save(test);
            }
        }
        if (request.getEditingTaskRequests() != null) {
            for (EditingTaskRequest editingTaskRequests : request.getEditingTaskRequests()) {
                if (editingTaskRequests.isDeleted()) {
                    taskService.removeTaskFromTest(editingTaskRequests.getTask());
                } else {
                    taskService.addTaskToTest(request.getTestDto() != null ? request.getTestDto().getId() : null, editingTaskRequests.getTask().getId());
                }
            }
        }
    }
}
