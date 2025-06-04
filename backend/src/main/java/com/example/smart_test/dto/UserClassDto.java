package com.example.smart_test.dto;

import com.example.smart_test.domain.StudentClass;
import com.example.smart_test.domain.User;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UserClassDto {
    private Long id;
    private StudentClass studentClass;
    private User user;

    public UserClassDto(StudentClass studentClass, User user) {
        this.studentClass = studentClass;
        this.user = user;
    }
}
