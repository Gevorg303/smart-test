package com.example.smart_test.repository;


import com.example.smart_test.domain.UserClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserClassRepositoryInterface extends JpaRepository<UserClass, Long> {
    @Query(value = "SELECT * FROM пользователь_класс " +
            "WHERE пользователь_класс.идентификатор_класс = :idClass " +
            "AND  пользователь_класс.идентификатор_пользователя = :idTeacher",
            nativeQuery = true)
    UserClass findByClassAndTeacher(Long idClass, Long idTeacher);

    List<UserClass> findByUserId(Long userId);
}