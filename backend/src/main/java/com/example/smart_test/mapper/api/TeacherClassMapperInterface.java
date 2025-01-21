package com.example.smart_test.mapper.api;

import com.example.smart_test.domain.UserClass;
import com.example.smart_test.dto.UserClassDto;

public interface TeacherClassMapperInterface {
    public UserClassDto toDto(UserClass entity);

    public UserClass toEntity(UserClassDto dto);

}
