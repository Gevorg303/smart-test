package com.example.smart_test.service;

import com.example.smart_test.domain.*;
import com.example.smart_test.dto.IndicatorDto;
import com.example.smart_test.dto.TaskDto;
import com.example.smart_test.dto.TestDto;
import com.example.smart_test.service.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class BankFilterServiceImpl implements BankFilterServiceInterface {
    @Autowired
    private TestServiceInterface testService;
    @Autowired
    private ThemeServiceInterface themeService;
    @Autowired
    private TaskOfIndicatorServiceInterface taskOfIndicatorService;
    @Autowired
    private TaskServiceInterface taskService;
    @Autowired
    private IndicatorServiceInterface indicatorService;

    @Transactional
    @Override
    public List<TestDto> getTestsFilter(TypeTest typeTest, User user, Subject subject, Theme theme) {
        List<TestDto> testDtoList = testService.getUserTests(user);
        List<TestDto> filteredList = new ArrayList<>();

        if (typeTest != null && typeTest.getId() != null) {
            for (TestDto testDto : testDtoList) {
                if (Objects.equals(testDto.getTypeTest().getId(), typeTest.getId())) {
                    filteredList.add(testDto);
                }
            }
        } else {
            filteredList.addAll(testDtoList);
        }

        if (subject != null) {
            List<Theme> subjectThemes = themeService.findThemeByIdSubject(subject);
            List<TestDto> subjectFilteredList = new ArrayList<>();

            for (TestDto testDto : filteredList) {
                for (Theme subjectTheme : subjectThemes) {
                    if (Objects.equals(testDto.getTheme().getId(), subjectTheme.getId())) {
                        subjectFilteredList.add(testDto);
                        break; // Достаточно одного совпадения по предмету
                    }
                }
            }
            filteredList = subjectFilteredList;
        }

        if (theme != null && theme.getId() != null) {
            List<TestDto> themeFilteredList = new ArrayList<>();

            for (TestDto testDto : filteredList) {
                if (Objects.equals(testDto.getTheme().getId(), theme.getId())) {
                    themeFilteredList.add(testDto);
                }
            }
            filteredList = themeFilteredList;
        }

        return filteredList;
    }


    @Override
    @Transactional
    public List<TaskDto> getTasksFilter(User user, Subject subject, Theme theme, Indicator indicator) {
        List<TaskDto> taskDtoList = taskService.getUserTasks(user);

        if (indicator == null && theme == null && subject == null) {
            return taskDtoList;
        }

        List<TaskDto> filteredTasks = new ArrayList<>(taskDtoList);

        if (indicator != null) {
            List<TaskOfIndicator> tasksWithIndicator = taskOfIndicatorService.findTaskOfIndicatorByIdIndicator(indicator);
            Set<Long> taskIdsWithIndicator = tasksWithIndicator.stream()
                    .map(taskOfIndicator -> taskOfIndicator.getTask().getId())
                    .collect(Collectors.toSet());

            filteredTasks = filteredTasks.stream()
                    .filter(task -> taskIdsWithIndicator.contains(task.getId()))
                    .collect(Collectors.toList());
        }

        if (theme != null) {
            List<Indicator> indicatorsForTheme = indicatorService.findIndicatorByIdTheme(theme);
            Set<Long> taskIdsForTheme = new HashSet<>();

            for (Indicator themeIndicator : indicatorsForTheme) {
                List<TaskOfIndicator> tasksForIndicator = taskOfIndicatorService.findTaskOfIndicatorByIdIndicator(themeIndicator);
                tasksForIndicator.forEach(taskOfIndicator -> taskIdsForTheme.add(taskOfIndicator.getTask().getId()));
            }

            filteredTasks = filteredTasks.stream()
                    .filter(task -> taskIdsForTheme.contains(task.getId()))
                    .collect(Collectors.toList());
        }

        if (subject != null) {
            List<Theme> themesForSubject = themeService.findThemeByIdSubject(subject);
            Set<Long> taskIdsForSubject = new HashSet<>();

            for (Theme subjectTheme : themesForSubject) {
                List<Indicator> indicatorsForSubjectTheme = indicatorService.findIndicatorByIdTheme(subjectTheme);
                for (Indicator subjectThemeIndicator : indicatorsForSubjectTheme) {
                    List<TaskOfIndicator> tasksForIndicator = taskOfIndicatorService.findTaskOfIndicatorByIdIndicator(subjectThemeIndicator);
                    tasksForIndicator.forEach(taskOfIndicator -> taskIdsForSubject.add(taskOfIndicator.getTask().getId()));
                }
            }

            filteredTasks = filteredTasks.stream()
                    .filter(task -> taskIdsForSubject.contains(task.getId()))
                    .collect(Collectors.toList());
        }

        return filteredTasks;
    }

    @Transactional
    @Override
    public List<IndicatorDto> getIndicatorFilter(User user, Subject subject) {
        List<IndicatorDto> userIndicators = indicatorService.getUserIndicators(user);
        if (subject == null) {
            return userIndicators;
        }

        return userIndicators.stream()
                .filter(indicatorDto -> Objects.equals(indicatorDto.getTheme().getSubject().getId(), subject.getId()))
                .collect(Collectors.toList());
    }
}
