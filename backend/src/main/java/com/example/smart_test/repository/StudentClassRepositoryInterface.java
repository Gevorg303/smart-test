package com.example.smart_test.repository;

import com.example.smart_test.domain.StudentClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentClassRepositoryInterface extends JpaRepository<StudentClass, Long> {

    @Query(value = "SELECT класс.идентификатор_класс, номер_класса, буквенное_обозначение, идентификатор_образовательное_уч FROM учитель_класс inner join класс on класс.идентификатор_класс = учитель_класс.идентификатор_класс WHERE учитель_класс.идентификатор_пользователя = :id",
            nativeQuery = true)
    List<StudentClass> findByTeacherId(Long id);

}
