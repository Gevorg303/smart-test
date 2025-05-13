package com.example.smart_test.service.api;

import com.example.smart_test.domain.*;
import com.example.smart_test.dto.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

public interface BankFilterServiceInterface {
    @Transactional
    Set<TestDto> getTestsFilter(TypeTest typeTest, UserDto user, Subject subject, Theme theme);

    List<TaskDto> getTasksFilter(User user, Subject subject, Theme theme, Indicator indicator);

    @Transactional
    List<IndicatorDto> getIndicatorFilter(UserDto user, Subject subject);

    Set<SubjectDto> getSubjectFilter(StudentClassDto request);

    Set<UserDto> getUserFilter(StudentClassDto request);
}
