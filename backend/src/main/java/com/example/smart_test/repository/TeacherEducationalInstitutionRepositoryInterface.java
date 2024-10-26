package com.example.smart_test.repository;


import com.example.smart_test.domain.TeacherEducationalInstitution;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TeacherEducationalInstitutionRepositoryInterface extends JpaRepository<TeacherEducationalInstitution, Long> {

}