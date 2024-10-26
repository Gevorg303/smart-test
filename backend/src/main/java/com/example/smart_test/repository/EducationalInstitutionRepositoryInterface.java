package com.example.smart_test.repository;

import com.example.smart_test.domain.EducationalInstitution;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EducationalInstitutionRepositoryInterface extends JpaRepository<EducationalInstitution, Long> {

}
