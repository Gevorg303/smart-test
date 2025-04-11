package com.example.smart_test.service.api;

import com.example.smart_test.domain.*;
import com.example.smart_test.dto.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

public interface BankFilterServiceInterface {
    @Transactional
    List<TestDto> getTestsFilter(TypeTest typeTest, User user, Subject subject, Theme theme);

    List<TaskDto> getTasksFilter(User user, Subject subject, Theme theme, Indicator indicator);

    @Transactional
    List<IndicatorDto> getIndicatorFilter(User user, Subject subject);

    Set<SubjectDto> getSubjectFilter(StudentClassDto request);

    Set<UserDto> getUserFilter(StudentClassDto request);
}
