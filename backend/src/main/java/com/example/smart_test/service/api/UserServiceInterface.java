package com.example.smart_test.service.api;

import com.example.smart_test.domain.User;
import com.example.smart_test.dto.EducationalInstitutionDto;
import com.example.smart_test.dto.RoleDto;
import com.example.smart_test.dto.StudentClassDto;
import com.example.smart_test.dto.UserDto;
import com.example.smart_test.request.UserBiRoleRequest;
import com.example.smart_test.request.UserRequest;
import com.example.smart_test.request.UserUpdateRequest;
import com.example.smart_test.response.UserResponse;
import jakarta.transaction.Transactional;

import java.util.List;

public interface UserServiceInterface {

    @Transactional
    List<UserResponse> addUser(List<UserRequest> userRequestList, UserDto user);

    @Transactional
    void deleteUser(UserDto userDto);

    @Transactional
    List<UserDto> getAllUsers(UserDto userDto);

    @Transactional
    UserDto getUserByLogin(User user);

    @Transactional
    User getUserByLogin(String login);

    List<StudentClassDto> findStudentClassByUser(UserDto userDto);

    List<UserDto> getUser(UserDto userDto, RoleDto roleDto);

    EducationalInstitutionDto findEducationalInstitutionByUser(UserDto userDto);

    void updateUser(UserUpdateRequest request);
}
