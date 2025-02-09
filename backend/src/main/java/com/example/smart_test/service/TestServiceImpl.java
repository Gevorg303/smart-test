package com.example.smart_test.service;

import com.example.smart_test.domain.*;
import com.example.smart_test.dto.*;
import com.example.smart_test.mapper.api.TestMapperInterface;
import com.example.smart_test.repository.TestRepositoryInterface;
import com.example.smart_test.request.EndTestingRequest;
import com.example.smart_test.request.RequestForTask;
import com.example.smart_test.service.api.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
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

    @Override
    @Transactional
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
        for (TaskDto taskDto : taskService.getAllTasks()) {
            if (taskDto.getTest() != null) {
                if (taskDto.getTest().getId().equals(testDto.getId())) {
                    taskService.removeTaskFromTest(taskDto);
                }
            }
        }
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
    public List<TestDto> getUserTests(UserDto dto) {
        UserDto userDto = userService.getUserByLogin(dto);
        if (userDto == null) {
            throw new IllegalArgumentException("User not found");
        }

        List<SubjectUserDto> subjectTeachers = subjectUserService.getAllSubjectTeachers()
                .stream()
                .filter(st -> st.getUser() != null && st.getUser().getId().equals(userDto.getId()))
                .toList();

        List<ThemeDto> themes = themeService.getAllTheme();
        List<TestDto> tests = getAllTestDto();

        return subjectTeachers.stream()
                .flatMap(subjectTeacher -> themes.stream()
                        .filter(theme -> theme.getSubject() != null && theme.getSubject().equals(subjectTeacher.getSubject()))
                        .flatMap(theme -> tests.stream()
                                .filter(test -> test.getTheme() != null && test.getTheme().getId().equals(theme.getId()))
                        )
                )
                .toList();
    }

    @Override
    @Transactional
    public List<RequestForTask> endTesting(EndTestingRequest endTestingRequest) {
        TestingAttempt testingAttempt = testingAttemptService.addTestingAttempt(
                new TestingAttempt(
                        endTestingRequest.getStartDateTime(),
                        endTestingRequest.getAttemptDuration(),
                        endTestingRequest.getTest(),
                        endTestingRequest.getUser()
                )
        );
        List<RequestForTask> forTaskList = requestVerificationService.checkingResponse(endTestingRequest.getRequestForTaskList());
        for (RequestForTask requestForTask : forTaskList) {
            taskResultsService.addTaskResults(requestForTask.getTask(), requestForTask.isStatus(), testingAttempt);
        }

        return forTaskList;
    }
}
