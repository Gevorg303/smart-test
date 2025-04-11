package com.example.smart_test.controller;

import com.example.smart_test.domain.User;
import com.example.smart_test.dto.StudentClassDto;
import com.example.smart_test.dto.UserDto;
import com.example.smart_test.mapper.api.UserMapperInterface;
import com.example.smart_test.request.UserBiRoleRequest;
import com.example.smart_test.request.UserRequest;
import com.example.smart_test.response.UserResponse;
import com.example.smart_test.security.JWTUtils;
import com.example.smart_test.service.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@CrossOrigin
public class UserController {
    @Autowired
    private UserServiceImpl userService;

    @Autowired
    private UserMapperInterface userMapper;

    @Autowired
    private JWTUtils jwtUtils;

    @PostMapping("/add")
    public List<UserResponse> addUser(@RequestBody List<UserRequest> userRequestList) {
        return userService.addUser(userRequestList);
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
        return userService.getUser(request);
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

    /**
     * Выводит список классов связанных со школой пользователя
     * */
    @PostMapping("/find-student-class-by-user")
    public List<StudentClassDto> findStudentClassByUser(@RequestBody UserDto userDto){
        return userService.findStudentClassByUser(userDto);
    }

    /**
     * Список классов по пользователю
     * */
    @GetMapping("/current-user-classes")
    public List<StudentClassDto> getCurrentUserClasses(@CookieValue("jwtToken") String token) {
        var jwt = jwtUtils.decodeToken(token);
        var login = jwt.getClaims().get("sub").toString();
        User currentUser = userService.getUserByLogin(login);
        return userService.findStudentClassByUser(userMapper.toDTO(currentUser));
    }
}

