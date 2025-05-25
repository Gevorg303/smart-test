package com.example.smart_test.controller;

import com.example.smart_test.domain.User;
import com.example.smart_test.dto.EducationalInstitutionDto;
import com.example.smart_test.dto.StudentClassDto;
import com.example.smart_test.dto.UserDto;
import com.example.smart_test.mapper.api.UserMapperInterface;
import com.example.smart_test.request.UserBiRoleRequest;
import com.example.smart_test.request.UserRegistrationRequest;
import com.example.smart_test.request.UserRequest;
import com.example.smart_test.response.UserResponse;
import com.example.smart_test.security.JWTUtils;
import com.example.smart_test.service.UserServiceImpl;
import com.example.smart_test.service.api.UserServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@CrossOrigin
public class UserController {
    @Autowired
    private UserServiceInterface userService;

    @Autowired
    private UserMapperInterface userMapper;

    @Autowired
    private JWTUtils jwtUtils;

    @PostMapping("/add")
    public List<UserResponse> addUser(@RequestBody List<UserRequest> userRequestList) {
        return userService.addUser(userRequestList, null);
    }

    @PostMapping("/admin/add")
    public List<UserResponse> addUserAdmin(@RequestBody UserRegistrationRequest request) {
        return userService.addUser(request.getUserRequestList(), request.getUser());
    }

    @DeleteMapping("/delete")
    public void deleteUser(@RequestBody UserDto userDto) {
        userService.deleteUser(userDto);
    }

    /**
     * Метод для вывода всех пользователей по школе авторизованного пользователя
     * Если на вход указать роль, то на выход можно получить отфильтрованных пользователей с этой ролью, иначе на выход придут все пользователи)
     */
    @PostMapping("/all")
    public List<UserDto> getUsers(@RequestBody UserBiRoleRequest request) {
        return userService.getUser(request.getUserDto(), request.getRoleDto());
    }

    @GetMapping("/{login}")
    public UserDto getUserByLogin(@RequestBody User user) {
        return userService.getUserByLogin(user);
    }

    @GetMapping("/current")
    public UserDto getCurrentUser(@CookieValue("jwtToken") String token) {
        var jwt = jwtUtils.decodeToken(token);
        var login = jwt.getClaims().get("sub").toString();
        User currentUser = userService.getUserByLogin(login);
        return userMapper.toDTO(currentUser);
    }

    @PostMapping("/find-student-class-by-user")
    public List<StudentClassDto> findStudentClassByUser(@RequestBody UserDto userDto){
        return userService.findStudentClassByUser(userDto);
    }

    /**
     * Вывод образовательного учреждения по пользователю
     * */
    @PostMapping("/find-educational-institution-by-user")
    public EducationalInstitutionDto findEducationalInstitutionByUser(@RequestBody UserDto userDto) {
        return userService.findEducationalInstitutionByUser(userDto);
    }
}
