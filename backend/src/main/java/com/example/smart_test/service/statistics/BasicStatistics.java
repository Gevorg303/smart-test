package com.example.smart_test.service.statistics;

import com.example.smart_test.domain.Theme;
import com.example.smart_test.dto.SubjectDto;
import com.example.smart_test.dto.TestDto;
import com.example.smart_test.dto.TestingAttemptDto;
import com.example.smart_test.dto.UserDto;
import com.example.smart_test.enums.TypeTestEnum;
import com.example.smart_test.mapper.api.ThemeMapperInterface;
import com.example.smart_test.service.api.TestServiceInterface;
import com.example.smart_test.service.api.TestingAttemptServiceInterface;
import com.example.smart_test.service.api.ThemeServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public abstract class BasicStatistics {
    @Autowired
    private TestServiceInterface testService;
    @Autowired
    private ThemeServiceInterface themeService;
    @Autowired
    private ThemeMapperInterface themeMapper;
    @Autowired
    private TestingAttemptServiceInterface testingAttemptService;

    protected double calculateFinalGrade(SubjectDto subject, UserDto user) {
        List<Theme> themes = themeService.findThemeByIdSubject(subject);
        if (themes == null || themes.isEmpty()) {
            return 0;
        }

        List<Integer> bestScores = collectBestFinalTestScores(themes, user);
        return calculateAverageScore(bestScores);
    }

    private List<Integer> collectBestFinalTestScores(List<Theme> themes, UserDto user) {
        List<Integer> bestScores = new ArrayList<>();
        for (Theme theme : themes) {
            List<TestDto> tests = getFinalTestsForTheme(theme);
            for (TestDto test : tests) {
                Integer bestScore = getBestScoreForTest(test, user);
                if (bestScore != null && bestScore > 0) {
                    bestScores.add(bestScore);
                }
            }
        }
        return bestScores;
    }

    private List<TestDto> getFinalTestsForTheme(Theme theme) {
        List<TestDto> finalTests = new ArrayList<>();
        List<TestDto> allTests = testService.outputTestsByIDTheme(themeMapper.toDTO(theme));

        for (TestDto test : allTests) {
            if (test != null && test.getTypeTest() != null &&
                    TypeTestEnum.FINAL_TEST.getDescription().equals(test.getTypeTest().getNameOfTestType())) {
                finalTests.add(test);
            }
        }
        return finalTests;
    }

    private Integer getBestScoreForTest(TestDto test, UserDto user) {
        List<TestingAttemptDto> attempts = testingAttemptService.findByTest(test);
        int bestScore = 0;

        for (TestingAttemptDto attempt : attempts) {
            if (user != null && user.getId() != null) {
                if (attempt.getUser() != null && user.getId().equals(attempt.getUser().getId())) {
                    if (attempt.getTestResult() > bestScore) {
                        bestScore = attempt.getTestResult();
                    }
                }
            } else {
                if (attempt.getTestResult() > bestScore) {
                    bestScore = attempt.getTestResult();
                }
            }
        }
        return bestScore;
    }

    private double calculateAverageScore(List<Integer> scores) {
        if (scores == null || scores.isEmpty()) {
            return 0;
        }

        double sum = 0;
        for (Integer score : scores) {
            sum += score;
        }

        return sum / scores.size();
    }
}
