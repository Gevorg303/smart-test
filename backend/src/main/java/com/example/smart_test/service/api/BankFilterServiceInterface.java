package com.example.smart_test.service.api;

import com.example.smart_test.domain.*;
import com.example.smart_test.dto.IndicatorDto;
import com.example.smart_test.dto.TaskDto;
import com.example.smart_test.dto.TestDto;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface BankFilterServiceInterface {
    @Transactional
    List<TestDto> getTestsFilter(TypeTest typeTest, User user, Subject subject, Theme theme);

    List<TaskDto> getTasksFilter(User user, Subject subject, Theme theme, Indicator indicator);

    @Transactional
    List<IndicatorDto> getIndicatorFilter(User user, Subject subject);
}
