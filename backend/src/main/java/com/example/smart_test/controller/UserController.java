package com.example.smart_test.controller;

import com.example.smart_test.domain.User;
import com.example.smart_test.dto.EducationalInstitutionDto;
import com.example.smart_test.dto.StudentClassDto;
import com.example.smart_test.dto.UserDto;
import com.example.smart_test.mapper.api.UserMapperInterface;
import com.example.smart_test.request.UserBiRoleRequest;
import com.example.smart_test.request.UserRegistrationRequest;
import com.example.smart_test.request.UserRequest;
import com.example.smart_test.request.UserUpdateRequest;
import com.example.smart_test.response.UserResponse;
import com.example.smart_test.security.JWTUtils;
import com.example.smart_test.service.UserServiceImpl;
import com.example.smart_test.service.api.UserServiceInterface;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
@CrossOrigin
@Tag(name = "User Controller", description = "API для управления пользователями")
public class UserController {
    @Autowired
    private UserServiceInterface userService;

    @Autowired
    private UserMapperInterface userMapper;

    @Autowired
    private JWTUtils jwtUtils;

    @Operation(summary = "Добавить пользователей", description = "Добавляет список пользователей в систему")
    @ApiResponse(responseCode = "200", description = "Пользователи успешно добавлены",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = UserResponse.class))))
    @PostMapping("/add")
    public List<UserResponse> addUser(@RequestBody List<UserRequest> userRequestList) {
        return userService.addUser(userRequestList, null);
    }

    @Operation(summary = "Добавить пользователей (администратор)", description = "Добавляет список пользователей в систему от имени администратора")
    @ApiResponse(responseCode = "200", description = "Пользователи успешно добавлены",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = UserResponse.class))))
    @PostMapping("/admin/add")
    public List<UserResponse> addUserAdmin(@RequestBody UserRegistrationRequest request) {
        return userService.addUser(request.getUserRequestList(), request.getUser());
    }

    @Operation(summary = "Удалить пользователя", description = "Удаляет пользователя из системы через флаг мягкого удаления")
    @ApiResponse(responseCode = "200", description = "Пользователь успешно удален")
    @DeleteMapping("/delete")
    public void deleteUser(@RequestBody UserDto userDto) {
        userService.deleteUser(userDto);
    }

    @Operation(summary = "Получить всех пользователей", description = "Возвращает список пользователей по школе авторизованного пользователя. Можно фильтровать по роли.")
    @ApiResponse(responseCode = "200", description = "Список пользователей успешно получен",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = UserDto.class))))
    @PostMapping("/all")
    public List<UserDto> getUsers(@RequestBody UserBiRoleRequest request) {
        return userService.getUser(request.getUserDto(), request.getRoleDto());
    }

    @Operation(summary = "Получить пользователя по логину", description = "Возвращает пользователя по указанному логину")
    @ApiResponse(responseCode = "200", description = "Пользователь успешно найден",
            content = @Content(schema = @Schema(implementation = UserDto.class)))
    @GetMapping("/{login}")
    public UserDto getUserByLogin(@RequestBody User user) {
        return userService.getUserByLogin(user);
    }

    @Operation(summary = "Получить текущего пользователя", description = "Возвращает информацию о текущем авторизованном пользователе")
    @ApiResponse(responseCode = "200", description = "Текущий пользователь успешно получен",
            content = @Content(schema = @Schema(implementation = UserDto.class)))
    @GetMapping("/current")
    public UserDto getCurrentUser(@CookieValue("jwtToken") String token) {
        var jwt = jwtUtils.decodeToken(token);
        var login = jwt.getClaims().get("sub").toString();
        User currentUser = userService.getUserByLogin(login);
        return userMapper.toDTO(currentUser);
    }

    @Operation(summary = "Найти классы учеников по пользователю", description = "Возвращает список классов, связанных с указанным пользователем")
    @ApiResponse(responseCode = "200", description = "Список классов успешно получен",
            content = @Content(array = @ArraySchema(schema = @Schema(implementation = StudentClassDto.class))))
    @PostMapping("/find-student-class-by-user")
    public List<StudentClassDto> findStudentClassByUser(@RequestBody UserDto userDto){
        return userService.findStudentClassByUser(userDto);
    }

    @Operation(summary = "Найти образовательное учреждение по пользователю", description = "Возвращает образовательное учреждение, связанное с указанным пользователем")
    @ApiResponse(responseCode = "200", description = "Образовательное учреждение успешно найдено",
            content = @Content(schema = @Schema(implementation = EducationalInstitutionDto.class)))
    @PostMapping("/find-educational-institution-by-user")
    public EducationalInstitutionDto findEducationalInstitutionByUser(@RequestBody UserDto userDto) {
        return userService.findEducationalInstitutionByUser(userDto);
    }

    @Operation(summary = "Обновить пользователя", description = "Обновляет информацию о пользователе")
    @ApiResponse(responseCode = "200", description = "Пользователь успешно обновлен")
    @PutMapping("/update")
    public void updateUser(@RequestBody UserUpdateRequest request) {
        userService.updateUser(request);
    }
}
