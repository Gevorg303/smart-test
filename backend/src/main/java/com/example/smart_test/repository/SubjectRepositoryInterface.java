package com.example.smart_test.repository;

import com.example.smart_test.domain.StudentClass;
import com.example.smart_test.domain.Subject;
import com.example.smart_test.domain.Theme;
import com.example.smart_test.dto.SubjectDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SubjectRepositoryInterface extends JpaRepository<Subject, Long> {
    @Query(value = "SELECT идентификатор_предмет, название_предмета, описание_предмета, предмет.идентификатор_пользователь_класс FROM предмет INNER JOIN пользователь_класс on предмет.идентификатор_пользователь_класс = пользователь_класс.идентификатор_пользователь_класс WHERE идентификатор_класс = :idClass and идентификатор_пользователя = :idTeacher",
            nativeQuery = true)
    List<Subject> findByClassAndTeacher(Long idClass, Long idTeacher);

    @Query(value = "SELECT тема.* " +
            "FROM тема " +
            "JOIN предмет ON тема.идентификатор_предмет = предмет.идентификатор_предмет " +
            "WHERE тема.идентификатор_предмет = :id", nativeQuery = true)
    List<Theme> findByThemeId(@Param("id") Long id);
}


