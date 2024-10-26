package com.example.smart_test.service;

import com.example.smart_test.domain.Role;
import com.example.smart_test.domain.User;
import com.example.smart_test.dto.UserDto;
import com.example.smart_test.mapper.api.UserMapperInterface;
import com.example.smart_test.repository.RoleRepositoryInterface;
import com.example.smart_test.repository.UserRepositoryInterface;
import com.example.smart_test.service.api.UserServiceInterface;
import com.github.javafaker.Faker;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserServiceInterface {
    @Autowired
    private UserRepositoryInterface userRepository;
    @Autowired
    private RoleRepositoryInterface roleRepositoryInterface;
    @Autowired
    private UserMapperInterface userMapper;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public UserDto addUser(UserDto userDto) {
        try {
            userDto.setLogin(generateLogin(userDto));
            String rawPassword = generatePassword();
            userDto.setPassword(rawPassword);
            //userDto.setPasswordEncoder(rawPassword);
            userDto.setPasswordEncoder(passwordEncoder.encode(rawPassword));
            User userEntity = userMapper.toEntity(userDto);

            Role role = roleRepositoryInterface.findById(userDto.getRoleId())
                    .orElseThrow(() -> new RuntimeException("Role not found"));
            userEntity.setRoles(role);

            userRepository.save(userEntity);
            return userDto;
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при добавлении пользователя: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional
    public void deleteUser(UserDto userDto) {
        userRepository.deleteById(userDto.getId());
    }

    @Override
    @Transactional
    public List<UserDto> getAllUsers() {
        List<User> userEntities = userRepository.findAll();
        return userEntities.stream()
                .map(userMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public UserDto getUserByLogin(UserDto userDto) {
        User userEntity = userRepository.findById(userDto.getId())
                .orElseThrow(() -> new IllegalArgumentException("Пользователь с таким логином не найден"));
        return userMapper.toDTO(userEntity);
    }

    @Override
    public User getUserByLogin(String login) {
        User userEntity = userRepository.findByLogin(login)
                .orElseThrow(() -> new IllegalArgumentException("Пользователь с таким логином не найден"));
        return userEntity;
    }

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentLogin = authentication.getName();
        return userRepository.findByLogin(currentLogin)
                .orElseThrow(() -> new IllegalArgumentException("Пользователь с таким логином не найден"));
    }


    private String generateLogin(UserDto dto) {
        String surnameInitials = dto.getSurname().substring(0, Math.min(dto.getSurname().length(), 2));
        String nameInitials = dto.getName().substring(0, Math.min(dto.getName().length(), 2));
        String patronymicInitials = "";
        if (dto.getPatronymic() != null && !dto.getPatronymic().isEmpty()) {
            patronymicInitials = dto.getPatronymic().substring(0, Math.min(dto.getPatronymic().length(), 2));
        }
        int id = userRepository.maxIdUser() + 1;
        return surnameInitials + nameInitials + patronymicInitials + id;
    }

    private String generatePassword() {
        Faker faker = new Faker();
        return faker.internet().password(8, 16, true, true, true);
    }
}
