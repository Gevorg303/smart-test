package com.example.smart_test.repository;

import com.example.smart_test.domain.Subject;
import com.example.smart_test.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface UserRepositoryInterface extends JpaRepository<User, Long> {
    @Query(value = "SELECT MAX(идентификатор_пользователя) AS MaxUserId\n" +
            "FROM пользователь;",
            nativeQuery = true)
    int maxIdUser();

    Optional<User> findByLogin(String login);
}
