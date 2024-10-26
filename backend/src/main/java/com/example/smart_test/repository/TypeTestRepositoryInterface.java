package com.example.smart_test.repository;


import com.example.smart_test.domain.TypeTest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TypeTestRepositoryInterface extends JpaRepository<TypeTest, Long> {

}