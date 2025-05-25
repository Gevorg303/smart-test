package com.example.smart_test.service.statistics;

import com.example.smart_test.dto.SubjectDto;
import com.example.smart_test.dto.UserDto;
import com.example.smart_test.enums.UserRoleEnum;
import com.example.smart_test.request.TeacherStatisticsResponse;
import com.example.smart_test.service.api.SubjectServiceInterface;
import com.example.smart_test.service.api.SubjectUserServiceInterface;
import com.example.smart_test.service.statistics.api.TeacherStatisticsServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
public class TeacherStatisticsServiceImpl extends BasicStatistics implements TeacherStatisticsServiceInterface {
    @Autowired
    private SubjectServiceInterface subjectService;
    @Autowired
    private SubjectUserServiceInterface subjectUserService;

    @Override
    public List<TeacherStatisticsResponse> getTeacherStatistics(UserDto user, SubjectDto subject) {
        List<TeacherStatisticsResponse> teacherStatisticsResponseList = new ArrayList<>();
        Set<SubjectDto> subjectDtoList = subjectService.getSubjectByUser(user);

        for (SubjectDto subjectDto : subjectDtoList) {
            if (subject != null && subject.getId().equals(subjectDto.getId())) {

                List<UserDto> excellentStudents = new ArrayList<>();
                List<UserDto> goodStudents = new ArrayList<>();
                List<UserDto> averageStudents = new ArrayList<>();
                List<UserDto> poorStudents = new ArrayList<>();

                List<UserDto> userDtoList = subjectUserService.getUsersBySubject(subjectDto);
                if (userDtoList != null) {
                    for (UserDto userDto : userDtoList) {
                        if (userDto != null && UserRoleEnum.STUDENT.getDescription().equals(userDto.getRole().getRole())) {
                            double scope = calculateFinalGrade(subjectDto, userDto);

                            if (scope >= 90.0) {
                                excellentStudents.add(userDto);
                            } else if (scope >= 70.0) {
                                goodStudents.add(userDto);
                            } else if (scope >= 50.0) {
                                averageStudents.add(userDto);
                            } else {
                                poorStudents.add(userDto);
                            }
                        }
                    }
                }

                TeacherStatisticsResponse response = new TeacherStatisticsResponse(
                        subjectDto,
                        excellentStudents,
                        goodStudents,
                        averageStudents,
                        poorStudents
                );
                teacherStatisticsResponseList.add(response);
            }
        }
        return teacherStatisticsResponseList;
    }
}