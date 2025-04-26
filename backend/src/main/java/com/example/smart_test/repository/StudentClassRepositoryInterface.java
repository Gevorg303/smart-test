package com.example.smart_test.repository;

import com.example.smart_test.domain.EducationalInstitution;
import com.example.smart_test.domain.StudentClass;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentClassRepositoryInterface extends JpaRepository<StudentClass, Long> {

    List<StudentClass> findByIdAndIsDeleteFalse(Long id);

    List<StudentClass> findByEducationalInstitutionAndIsDeleteFalse(EducationalInstitution educationalInstitution);

    List<StudentClass> findByIsDeleteFalse();
}
