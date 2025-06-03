package com.example.smart_test.service;

import com.example.smart_test.domain.*;
import com.example.smart_test.dto.SubjectDto;
import com.example.smart_test.dto.UserDto;
import com.example.smart_test.enums.UserRoleEnum;
import com.example.smart_test.mapper.api.SubjectMapperInterface;
import com.example.smart_test.mapper.api.ThemeMapperInterface;
import com.example.smart_test.mapper.api.UserMapperInterface;
import com.example.smart_test.repository.SubjectRepositoryInterface;
import com.example.smart_test.repository.SubjectUserRepositoryInterface;
import com.example.smart_test.request.AddSubjectRequest;
import com.example.smart_test.service.api.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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
    @Autowired
    private UserEducationalInstitutionServiceInterface userEducationalInstitutionService;
    @Autowired
    private UserMapperInterface userMapper;
    @Autowired
    private ThemeServiceInterface themeService;
    @Autowired
    private ThemeMapperInterface themeMapper;
    @Autowired
    private IndicatorServiceInterface indicatorService;
    @Autowired
    private TaskOfIndicatorServiceInterface taskOfIndicatorService;
    @Autowired
    private TaskServiceInterface taskService;
    @Autowired
    private TestServiceInterface testService;

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

    @Override
    public Subject updateSubject(Subject updatedSubject) {
        return subjectRepository.findById(updatedSubject.getId())
                .map(subject -> {
                    subject.setSubjectName(updatedSubject.getSubjectName());
                    subject.setDescription(updatedSubject.getDescription());
                    return subjectRepository.save(subject);
                })
                .orElseThrow(() -> new EntityNotFoundException("Предмет с ID " + updatedSubject.getId() + " не найден"));
    }

    @Transactional
    @Override
    public Set<SubjectDto> getSubjectByUser(UserDto user) {
        // TODO: Проверка на null и корректность пользователя
        if (user == null || user.getId() == null) {
            throw new IllegalArgumentException("Некорректный пользователь: ID не должен быть null");
        }

        try {
            List<UserDto> userList = new ArrayList<>();

            // TODO: Если пользователь - админ, получаем всех пользователей учреждения (кроме него самого)
            if (user.getRole().getRole().equals(UserRoleEnum.ADMIN.getDescription())) {
                for (User user1 : userEducationalInstitutionService.getUsersByEducationalInstitutionExcludingSelf(user.getId())) {
                    userList.add(userMapper.toDTO(user1));
                }
            } else {
                // TODO: Иначе обрабатываем только текущего пользователя
                userList.add(user);
            }
            Set<SubjectDto> subjectDtoList = new HashSet<>();
            for (UserDto currentUser : userList) {
                // TODO: Получаем список связей "пользователь-предмет"
                List<SubjectUser> subjectUserList = subjectUserService.findByUserId(currentUser);

                // TODO: Проверяем, привязан ли предмет именно к исходному пользователю (а не просто текущему из userList)
                for (SubjectUser subjectUser : subjectUserList) {
                    if (subjectUser.getUser() != null && subjectUser.getUser().getId().equals(currentUser.getId())) {
                        // TODO: Получаем предмет по ID, если он не null
                        Subject subject = findSubjectById(subjectUser.getSubject().getId());
                        if (subject != null) {
                            subjectDtoList.add(subjectMapper.toDTO(subject));
                        }
                    }
                }
            }
            return subjectDtoList;

        } catch (Exception e) {
            throw new RuntimeException("Не удалось получить предмет: " + e.getMessage(), e);
        }
    }

    @Override
    public Subject findSubjectById(Long id) {
        return subjectRepository.findById(id).orElse(null);
    }

    @Override
    @Transactional
    public void deleteSubjectDto(SubjectDto dto) {
        try {
            log.info("Начало удаления предмет с ID: {}", dto.getId());

            subjectUserRepository.deleteBySubjectId(dto.getId());
            log.info("Удалены связи с пользователями по предмету ID: {}", dto.getId());

            List<Theme> themeList = themeService.findThemeByIdSubject(dto);
            for (Theme theme : themeList) {
                log.info("Обработка темы ID: {}, название: {}", theme.getId(), theme.getThemeName());

                List<Indicator> indicatorList = indicatorService.findIndicatorByIdTheme(theme);
                for (Indicator indicator : indicatorList) {
                    log.info("Удаляется индикатор ID: {}, название: {}", indicator.getId(), indicator.getNameOfTheIndicator());

                    List<TaskOfIndicator> taskOfIndicatorList = taskOfIndicatorService.findTaskOfIndicatorByIdIndicator(indicator);
                    for (TaskOfIndicator taskOfIndicator : taskOfIndicatorList) {
                        taskOfIndicatorService.deleteTaskOfIndicator(taskOfIndicator);
                        //taskOfIndicatorService.deleteByIndicatorId(indicator.getId());
                        log.info("Удалены связи индикатора с заданиями, ID индикатора: {}", indicator.getId());
                        Task task = taskOfIndicator.getTask();
                        log.info("Удаляется задание ID: {}", task.getId());
                        taskService.deleteTask(task);
                    }

                    indicatorService.deleteByIndicatorId(indicator.getId());
                    log.info("Удалён индикатор ID: {}", indicator.getId());
                }

                testService.deleteByThemeId(theme.getId());
                log.info("Удалены тесты по теме ID: {}", theme.getId());

                themeService.deleteThemeDto(themeMapper.toDTO(theme));
                log.info("Удалена тема ID: {}", theme.getId());
            }

            subjectRepository.delete(subjectMapper.toEntity(dto));
            log.info("Удалён предмет ID: {}", dto.getId());

        } catch (Exception e) {
            log.error("Ошибка при удалении предмета ID: {}. Причина: {}", dto.getId(), e.getMessage(), e);
            throw new RuntimeException("Не удалось удалить предмет: " + e.getMessage(), e);
        }
    }


}
