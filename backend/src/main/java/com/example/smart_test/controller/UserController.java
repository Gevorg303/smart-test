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

   /* @PostMapping("/all")
    public List<UserDto> getUsers(@RequestBody UserBiRoleRequest request) {
        System.out.println("Received request: " + request); // Логирование запроса
        if (request.getUserDto() == null) {
            throw new IllegalArgumentException("UserDto cannot be null");
        }
        List<UserDto> users = userService.getUser(request);
        System.out.println("Returning users: " + users); // Логирование ответа
        return users;
    }*/

    /**
     *
     * @return Возвращает всех пользователей из БД
     */
    @GetMapping("/all")
    public List<UserDto> getAllUsers() {
        System.out.println("Received request to get all users"); // Логирование запроса
        List<UserDto> users = userService.getAllUsers();
        System.out.println("Returning users: " + users); // Логирование ответа
        return users;
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

  /*  @GetMapping("/current-user-classes")
    public List<StudentClassDto> getCurrentUserClasses(@CookieValue("jwtToken") String token) {
        var jwt = jwtUtils.decodeToken(token);
        var login = jwt.getClaims().get("sub").toString();
        User currentUser = userService.getUserByLogin(login);
        return userService.findStudentClassByUser(userMapper.toDTO(currentUser));
    }*/
}
