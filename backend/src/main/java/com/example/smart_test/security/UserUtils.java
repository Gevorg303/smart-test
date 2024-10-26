package com.example.smart_test.security;

import com.example.smart_test.domain.User;
import com.example.smart_test.repository.UserRepositoryInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class UserUtils {
    @Autowired
    private UserRepositoryInterface userRepository;

    public User getCurrentUser() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }
        var login = authentication.getName();
        return userRepository.findByLogin(login).get();
    }
}