package com.example.smart_test.controller;

import com.example.smart_test.dto.StudentClassDto;
import com.example.smart_test.dto.SubjectDto;
import com.example.smart_test.request.SubjectClassRequest;
import com.example.smart_test.service.api.SubjectUserServiceInterface;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/user-subject")
@Slf4j
public class SubjectUserController {
    @Autowired
    private SubjectUserServiceInterface subjectService;

    /**
     * Метод для подписания класса на предмет, на вход необходимо подать лист классов и предмет
     * */
    @PostMapping("/add")
    public ResponseEntity<String> addSubjectTeacherDto(@RequestBody SubjectClassRequest request) {
        try {
            subjectService.addSubjectUserDto(request);
            return ResponseEntity.ok("Класс успешно подписан на предмет");
        } catch (Exception e) {
            log.error("Ошибка при подписании класса на предмет: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Ошибка: " + e.getMessage());
        }
    }

    /**
     * Метод для вывода классов связанных с предметом
     * */
    @PostMapping("/find-class-by-subject")
    public ResponseEntity<?> findClassBySubject(@RequestBody SubjectDto dto) {
        try {
            Set<StudentClassDto> studentClasses = subjectService.findClassBySubject(dto);
            return ResponseEntity.ok(studentClasses);
        } catch (Exception e) {
            log.error("Ошибка при поиске классов по предмету: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Ошибка: " + e.getMessage());
        }
    }

    /**
     * Метод для отписки класса от предмета, на вход необходимо подать лист классов и предмет
     */
    @DeleteMapping("/remove")
    public ResponseEntity<String> removeSubjectTeacherDto(@RequestBody SubjectClassRequest request) {
        try {
            subjectService.removeSubjectUserDto(request);
            return ResponseEntity.ok("Класс успешно отписан от предмета");
        } catch (Exception e) {
            log.error("Ошибка при отписке класса от предмета: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Ошибка: " + e.getMessage());
        }
    }

//
//    @DeleteMapping("/delete")
//    public void deleteSubjectTeacherDto(@RequestBody SubjectUserDto subjectDto) {
//        subjectService.deleteSubjectUserDto(subjectDto);
//    }
//
//    @GetMapping("/all")
//    public List<SubjectUserDto> getSubjectTeacherDto() {
//        return subjectService.getAllSubjectTeachers();
//    }
}
