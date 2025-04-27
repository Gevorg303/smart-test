package com.example.smart_test.service;

import com.example.smart_test.domain.EducationalInstitution;
import com.example.smart_test.domain.StudentClass;
import com.example.smart_test.dto.EducationalInstitutionDto;
import com.example.smart_test.dto.StudentClassDto;
import com.example.smart_test.mapper.api.StudentClassMapperInterface;
import com.example.smart_test.repository.StudentClassRepositoryInterface;
import com.example.smart_test.service.api.EducationalInstitutionServiceInterface;
import com.example.smart_test.service.api.StudentClassServiceInterface;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class StudentClassServiceImpl implements StudentClassServiceInterface {
    @Autowired
    private StudentClassMapperInterface studentClassMapper;
    @Autowired
    private StudentClassRepositoryInterface studentClassRepository;
    @Autowired
    private EducationalInstitutionServiceInterface educationalInstitutionService;

    @Transactional
    @Override
    public List<StudentClass> findClassByEducationalInstitution(EducationalInstitutionDto educationalInstitutionDto) {
        EducationalInstitution educationalInstitution = educationalInstitutionService.getEducationalInstitutionsById(educationalInstitutionDto);
        List<StudentClass> studentClassList = new ArrayList<>();
        if (educationalInstitution != null) {
            List<StudentClass> studentClasses = getAllActiveStudentClasses();
            for (StudentClass studentClass : studentClasses) {
                if (studentClass.getEducationalInstitution().getId().equals(educationalInstitution.getId())) {
                    studentClassList.add(studentClass);
                }
            }
        }
        return studentClassList;
    }

    @Override
    @Transactional
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

    private List<StudentClass> getAllActiveStudentClasses() {
        try {
            return studentClassRepository.findByIsDeleteFalse();
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при получении активных классов: " + e.getMessage(), e);
        }
    }

    @Override
    public List<StudentClassDto> getStudentClassByUserId(Long id) {
        try {
            List<StudentClass> subjects = studentClassRepository.findByUserId(id);
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

    /**
     * Увеличивает номер класса на 1 для всех классов
     */
    @Transactional
    @Override
    public void incrementClassNumbers() {
        List<StudentClass> classes = studentClassRepository.findAll();
        for (StudentClass studentClass : classes) {
            try {
                int currentNumber = Integer.parseInt(studentClass.getNumberOfInstitution());
                if (currentNumber >= 11) {
                    studentClass.setIsDelete(true);
                } else {
                    studentClass.setNumberOfInstitution(String.valueOf(currentNumber + 1));
                }
            } catch (NumberFormatException e) {
                System.out.println("Ошибка преобразования номера класса для ID: " + studentClass.getId());
            }
        }
        studentClassRepository.saveAll(classes);
    }

}
