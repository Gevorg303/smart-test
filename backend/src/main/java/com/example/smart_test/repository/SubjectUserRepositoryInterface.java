package com.example.smart_test.repository;


import com.example.smart_test.domain.Subject;
import com.example.smart_test.domain.SubjectUser;
import com.example.smart_test.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SubjectUserRepositoryInterface extends JpaRepository<SubjectUser, Long> {
    void deleteBySubjectId(Long id);
    List<SubjectUser> findByUserId(Long userId);
    List<SubjectUser> findByUserIn(List<User> users);
    List<SubjectUser> findBySubject(Subject subject);
    void deleteBySubjectAndUser(Subject subject, User user);
}