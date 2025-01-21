package com.example.smart_test.repository;


import com.example.smart_test.domain.SubjectUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SubjectUserRepositoryInterface extends JpaRepository<SubjectUser, Long> {

}