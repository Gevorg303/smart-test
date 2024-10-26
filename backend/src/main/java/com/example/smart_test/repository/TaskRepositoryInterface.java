package com.example.smart_test.repository;


import com.example.smart_test.domain.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepositoryInterface extends JpaRepository<Task, Long> {
//    @Query(value = "SELECT z.идентификатор_задание, z.оценка_за_задание, z.пояснение, z.текст_задания, z.название_задания, z.идентификатор_тип_задания, z.идентификатор_тест\n" +
//            "FROM задание z\n" +
//            "JOIN тест t ON z.идентификатор_тест = t.идентификатор_тест\n" +
//            "WHERE z.идентификатор_задание NOT IN (\n" +
//            "    SELECT идентификатор_задание\n" +
//            "    FROM задание\n" +
//            "    WHERE идентификатор_тест IS NOT NULL\n" +
//            ");")
//    List<Task> findTasks();
}