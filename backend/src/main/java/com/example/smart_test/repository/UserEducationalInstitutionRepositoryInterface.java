package com.example.smart_test.repository;


import com.example.smart_test.domain.UserEducationalInstitution;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserEducationalInstitutionRepositoryInterface extends JpaRepository<UserEducationalInstitution, Long> {

}