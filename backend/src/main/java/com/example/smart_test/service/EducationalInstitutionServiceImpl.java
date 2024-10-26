package com.example.smart_test.service;

import com.example.smart_test.domain.EducationalInstitution;
import com.example.smart_test.dto.EducationalInstitutionDto;
import com.example.smart_test.mapper.api.EducationalInstitutionMapperInterface;
import com.example.smart_test.repository.EducationalInstitutionRepositoryInterface;
import com.example.smart_test.service.api.EducationalInstitutionServiceInterface;
import org.springframework.transaction.annotation.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
public class EducationalInstitutionServiceImpl implements EducationalInstitutionServiceInterface {
    @Autowired
    private EducationalInstitutionRepositoryInterface educationalInstitutionRepository;
    @Autowired
    private EducationalInstitutionMapperInterface educationalInstitutionMapperInterface;

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public EducationalInstitutionDto addEducationalInstitutionDto(EducationalInstitutionDto dto) {
        try {
            EducationalInstitution educationalInstitution = educationalInstitutionMapperInterface.toEntity(dto);
            educationalInstitution = educationalInstitutionRepository.save(educationalInstitution);
            return educationalInstitutionMapperInterface.toDTO(educationalInstitution);
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при добавлении учреждения: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void deleteEducationalInstitutionDto(EducationalInstitutionDto dto) {
        if (findEducationalInstitutionById(dto.getId())) {
            EducationalInstitution educationalInstitution = educationalInstitutionMapperInterface.toEntity(dto);
            educationalInstitutionRepository.delete(educationalInstitution);
        } else {
            log.error("Учреждение с идентификатором " + dto.getId() + " не существует");
        }
    }

    @Override
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public List<EducationalInstitutionDto> getAllEducationalInstitutions() {
        try {
            List<EducationalInstitution> institutions = educationalInstitutionRepository.findAll();
            return institutions.stream()
                    .map(educationalInstitutionMapperInterface::toDTO)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            throw new RuntimeException("Ошибка при получении всех учреждений: " + e.getMessage(), e);
        }
    }

    private boolean findEducationalInstitutionById(Long id) {
        Optional<EducationalInstitution> educationalInstitution = educationalInstitutionRepository.findById(id);
        return educationalInstitution.isPresent();
    }
}
