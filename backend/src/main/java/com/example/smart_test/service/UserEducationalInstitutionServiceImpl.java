package com.example.smart_test.service;


import com.example.smart_test.domain.StudentClass;
import com.example.smart_test.domain.UserEducationalInstitution;
import com.example.smart_test.dto.UserDto;
import com.example.smart_test.dto.UserEducationalInstitutionDto;
import com.example.smart_test.mapper.api.UserEducationalInstitutionMapperInterface;
import com.example.smart_test.repository.StudentClassRepositoryInterface;
import com.example.smart_test.repository.UserEducationalInstitutionRepositoryInterface;
import com.example.smart_test.service.api.UserEducationalInstitutionServiceInterface;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
public class UserEducationalInstitutionServiceImpl implements UserEducationalInstitutionServiceInterface {

    @Autowired
    private UserEducationalInstitutionRepositoryInterface userEducationalInstitutionRepositoryInterface;
    @Autowired
    private UserEducationalInstitutionMapperInterface userEducationalInstitutionMapperInterface;
    @Autowired
    private StudentClassRepositoryInterface studentClassRepository;

    @Transactional
    @Override
    public List<StudentClass> findUserEducationalInstitutionByUser(UserDto userDto) {
        UserEducationalInstitution userEducationalInstitution = userEducationalInstitutionRepositoryInterface.findByUserId(userDto.getId());
        return studentClassRepository.findByEducationalInstitution(userEducationalInstitution.getEducationalInstitution());
    }

    @Override
    @Transactional
    public UserEducationalInstitutionDto addUserEducationalInstitution(UserEducationalInstitution userEducationalInstitution) {
        try {
             userEducationalInstitutionRepositoryInterface.save(userEducationalInstitution);
            return userEducationalInstitutionMapperInterface.toDto(userEducationalInstitution);
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при добавлении связи 'Пользователь-образовательное учреждение': " + e.getMessage(), e);
        }
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void deleteTeacherEducationalInstitutionDto(UserEducationalInstitutionDto dto) {
        if (findTeacherEducationalInstitutionById(dto.getId())) {
            UserEducationalInstitution teacherEducationalInstitution = userEducationalInstitutionMapperInterface.toEntity(dto);
            userEducationalInstitutionRepositoryInterface.delete(teacherEducationalInstitution);
        } else {
            log.error("Индикатор с идентификатором " + dto.getId() + " не существует");
        }
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public List<UserEducationalInstitutionDto> getAllTeacherEducationalInstitutions() {
        try {
            List<UserEducationalInstitution> teacherEducationalInstitutions = userEducationalInstitutionRepositoryInterface.findAll();
            return teacherEducationalInstitutions.stream()
                    .map(userEducationalInstitutionMapperInterface::toDto)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при получении всех индикаторов: " + e.getMessage(), e);
        }
    }

    private boolean findTeacherEducationalInstitutionById(Long id) {
        Optional<UserEducationalInstitution> teacherEducationalInstitution = userEducationalInstitutionRepositoryInterface.findById(id);
        return teacherEducationalInstitution.isPresent();
    }
}
