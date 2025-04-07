package com.example.smart_test.repository;


import com.example.smart_test.domain.EducationalInstitution;
import com.example.smart_test.domain.UserEducationalInstitution;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserEducationalInstitutionRepositoryInterface extends JpaRepository<UserEducationalInstitution, Long> {
    UserEducationalInstitution findByUserId(Long userId);
    List<UserEducationalInstitution> findByEducationalIns(EducationalInstitution educationalInstitution);
}