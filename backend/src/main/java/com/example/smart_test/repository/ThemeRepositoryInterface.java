package com.example.smart_test.repository;

import com.example.smart_test.domain.Subject;
import com.example.smart_test.domain.Theme;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ThemeRepositoryInterface extends JpaRepository<Theme, Long> {
    @Query(value = "SELECT идентификатор_тема, название_темы, предмет.идентификатор_предмет  FROM тема inner join предмет on тема.идентификатор_предмет = предмет.идентификатор_предмет WHERE предмет.идентификатор_предмет = :id",
            nativeQuery = true)
    List<Theme> findBySubjectId(Long id);

}
