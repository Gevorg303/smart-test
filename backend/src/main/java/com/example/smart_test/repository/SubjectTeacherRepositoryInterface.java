package com.example.smart_test.repository;


import com.example.smart_test.domain.SubjectTeacher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SubjectTeacherRepositoryInterface extends JpaRepository<SubjectTeacher, Long> {

}