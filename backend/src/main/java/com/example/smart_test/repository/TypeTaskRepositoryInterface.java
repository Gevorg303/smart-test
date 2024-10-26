package com.example.smart_test.repository;


import com.example.smart_test.domain.TypeTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TypeTaskRepositoryInterface extends JpaRepository<TypeTask, Long> {

}