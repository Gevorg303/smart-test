package com.example.smart_test.repository;


import com.example.smart_test.domain.Task;
import com.example.smart_test.dto.TaskDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepositoryInterface extends JpaRepository<Task, Long> {
    @Query(value = "SELECT z.идентификатор_задание AS id, " +
            "z.название_задания AS taskName, " +
            "z.текст_задания AS taskText, " +
            "z.пояснение AS explanation, " +
            "z.оценка_за_задание AS assessmentTask, " +
            "z.идентификатор_тест AS test " +
            "FROM задание z " +
            "JOIN задание_по_индикато zpi ON z.идентификатор_задание = zpi.идентификатор_задание " +
            "JOIN индикатор i ON zpi.идентификатор_индикатор = i.идентификатор_индикатор " +
            "JOIN тема t ON i.идентификатор_тема = t.идентификатор_тема " +
            "WHERE z.идентификатор_тест IS NULL " +
            "AND t.идентификатор_тема = (" +
            "    SELECT тема.идентификатор_тема " +
            "    FROM тест " +
            "    JOIN тема ON тест.идентификатор_тема = тема.идентификатор_тема " +
            "    WHERE тест.идентификатор_тест = :id" +
            ")", nativeQuery = true)
    List<Task> findTasksByTestId(@Param("id") Long id);
}
