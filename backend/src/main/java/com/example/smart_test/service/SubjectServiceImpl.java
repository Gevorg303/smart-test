package com.example.smart_test.service;

import com.example.smart_test.domain.Subject;
import com.example.smart_test.domain.SubjectUser;
import com.example.smart_test.domain.Theme;
import com.example.smart_test.domain.User;
import com.example.smart_test.dto.SubjectDto;
import com.example.smart_test.mapper.api.SubjectMapperInterface;
import com.example.smart_test.repository.SubjectRepositoryInterface;
import com.example.smart_test.repository.SubjectUserRepositoryInterface;
import com.example.smart_test.request.AddSubjectRequest;
import com.example.smart_test.service.api.SubjectServiceInterface;
import com.example.smart_test.service.api.SubjectUserServiceInterface;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
public class SubjectServiceImpl implements SubjectServiceInterface {
    @Autowired
    private SubjectRepositoryInterface subjectRepository;
    @Autowired
    private SubjectMapperInterface subjectMapper;
    @Autowired
    private SubjectUserRepositoryInterface subjectUserRepository;
    @Autowired
    private SubjectUserServiceInterface subjectUserService;

    @Override
    @Transactional
    public SubjectDto addSubjectDto(AddSubjectRequest addSubjectRequest) {
        try {
            Subject subject = subjectRepository.save(addSubjectRequest.getSubject());
            subjectUserRepository.save(new SubjectUser(subject, addSubjectRequest.getUser()));
            return subjectMapper.toDTO(subject);
        } catch (Exception e) {
            throw new RuntimeException("Не удалось добавить предмет" + e.getMessage(), e);
        }
    }


    @Override
    public List<SubjectDto> getAllSubject() {
        try {
            List<Subject> subjects = subjectRepository.findAll();
            List<SubjectDto> subjectDto = new ArrayList<>();
            for (Subject subject : subjects) {
                subjectDto.add(subjectMapper.toDTO(subject));
            }
            return subjectDto;
        } catch (Exception e) {
            throw new RuntimeException("Не удалось получить список предметов." + e.getMessage(), e);
        }

    }

    @Override
    public List<SubjectDto> getSubjectByClassAndTeacher(Long idClass, Long idTeacher) {
        try {
            List<Subject> subjects = subjectRepository.findByClassAndTeacher(idClass, idTeacher);
            List<SubjectDto> subjectDto = new ArrayList<>();
            for (Subject subject : subjects) {
                subjectDto.add(subjectMapper.toDTO(subject));
            }
            return subjectDto;
        } catch (Exception e) {
            throw new RuntimeException("Не удалось получить предмет: " + e.getMessage(), e);
        }

    }

    @Override
    public List<Theme> getThemesBySubjectId(Long subjectId) {
        return null;
    }

    @Transactional
    @Override
    public List<SubjectDto> getSubjectByUser(User user) {
        if (user == null || user.getId() == null) {
            throw new IllegalArgumentException("Некорректный пользователь: ID не должен быть null");
        }

        try {
            List<SubjectDto> subjectDtoList = new ArrayList<>();
            List<SubjectUser> subjectUserList = subjectUserService.findByUserId(user);
            for (SubjectUser subjectUser : subjectUserList) {
                if (subjectUser.getUser() != null && subjectUser.getUser().getId().equals(user.getId())) {
                    Subject subject = findSubjectById(subjectUser.getSubject().getId());
                    if (subject != null) {
                        subjectDtoList.add(subjectMapper.toDTO(subject)); // Маппинг каждого объекта отдельно
                    }
                }
            }
            return subjectDtoList;
        } catch (Exception e) {
            throw new RuntimeException("Не удалось получить предмет: " + e.getMessage(), e);
        }
    }

    private Subject findSubjectById(Long id) {
        return subjectRepository.findById(id).orElse(null);
    }

    @Override
    @Transactional
    public void deleteSubjectDto(SubjectDto dto) {
        try {
            subjectUserRepository.deleteBySubjectId(dto.getId());
            subjectRepository.delete(subjectMapper.toEntity(dto));
        } catch (Exception e) {
            throw new RuntimeException("Не удалось удалить предмет" + e.getMessage(), e);
        }
    }
}
