package com.example.smart_test.service;

import com.example.smart_test.domain.StudentClass;
import com.example.smart_test.domain.TeacherClass;
import com.example.smart_test.dto.StudentClassDto;
import com.example.smart_test.dto.TeacherClassDto;
import com.example.smart_test.mapper.api.StudentClassMapperInterface;
import com.example.smart_test.repository.StudentClassRepositoryInterface;
import com.example.smart_test.service.api.StudentClassServiceInterface;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
public class StudentClassServiceImpl implements StudentClassServiceInterface {
    @Autowired
    private StudentClassMapperInterface studentClassMapper;
    @Autowired
    private StudentClassRepositoryInterface studentClassRepository;

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public StudentClassDto addStudentClassDto(StudentClassDto dto) {
        try {
            StudentClass studentClass = studentClassMapper.toEntity(dto);
            studentClass = studentClassRepository.save(studentClass);
            return studentClassMapper.toDTO(studentClass);
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при добавлении класса: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void deleteStudentClassDto(StudentClassDto dto) {
        if (findStudentClassById(dto.getId())) {
            StudentClass studentClass = studentClassMapper.toEntity(dto);
            studentClassRepository.delete(studentClass);
        } else {
            log.error("Класс с идентификатором " + dto.getId() + " не существует");
        }
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public List<StudentClassDto> getAllStudentClass() {
        try {
            List<StudentClass> institutions = studentClassRepository.findAll();
            return institutions.stream()
                    .map(studentClassMapper::toDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при получении всех классов: " + e.getMessage(), e);
        }
    }

    @Override
    public List<StudentClassDto> getStudentClassByTeacherId(Long id) {
        try {
            List<StudentClass> subjects = studentClassRepository.findByTeacherId(id);
            List<StudentClassDto> subjectDto = new ArrayList<>();
            for (StudentClass subject : subjects) {
                subjectDto.add(studentClassMapper.toDTO(subject));
            }
            return subjectDto;
        } catch (Exception e) {
            throw new RuntimeException("Не удалось получить предмет: " + e.getMessage(), e);
        }

    }

    private boolean findStudentClassById(Long id) {
        Optional<StudentClass> studentClass = studentClassRepository.findById(id);
        return studentClass.isPresent();
    }
}
