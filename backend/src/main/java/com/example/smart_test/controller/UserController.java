package com.example.smart_test.controller;

import com.example.smart_test.domain.User;
import com.example.smart_test.dto.UserDto;
import com.example.smart_test.mapper.api.UserMapperInterface;
import com.example.smart_test.security.JWTUtils;
import com.example.smart_test.service.UserServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    private UserServiceImpl userService;
    @Autowired
    private UserMapperInterface userMapper;
    @Autowired
    private JWTUtils jwtUtils;

    @PostMapping("/add")
    public ResponseEntity<UserDto> addUser(@RequestBody UserDto userDto) {
        try {
            UserDto createdUser = userService.addUser(userDto);
            return ResponseEntity.ok(createdUser);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/delete")
    public void deleteUser(@RequestBody UserDto userDto) {
        userService.deleteUser(userDto);
    }

    @GetMapping("/all")
    public List<UserDto> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{login}")
    public UserDto getUserByLogin(@RequestBody UserDto userDto) {
        return userService.getUserByLogin(userDto);
    }

    /*  @GetMapping("/current")
      public UserDto getCurrentUser() {
          User currentUser = userService.getCurrentUser();
          return userMapper.toDTO(currentUser);
      }*/
    @GetMapping("/current")
    public UserDto getCurrentUser(@CookieValue("jwtToken") String token) {
        var jwt = jwtUtils.decodeToken(token);
        var login = jwt.getClaims().get("sub").toString();
        User currentUser = userService.getUserByLogin(login);
        return userMapper.toDTO(currentUser);
    }
}
