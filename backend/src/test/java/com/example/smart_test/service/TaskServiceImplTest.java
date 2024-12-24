package com.example.smart_test.service;

import com.example.smart_test.domain.Task;
import com.example.smart_test.dto.TaskDto;
import com.example.smart_test.mapper.api.TaskMapperInterface;
import com.example.smart_test.repository.TaskRepositoryInterface;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
public class TaskServiceImplTest {

    @InjectMocks
    private TaskServiceImpl taskService;
    @Mock
    private TaskRepositoryInterface taskRepositoryInterface;
    @Mock
    private TaskMapperInterface taskMapperInterface;

    /**
     ToDo Проверка, что задача успешно сохраняется, и мапперы корректно преобразуют DTO и Entity
     * */
    @Test
    public void testAddTaskDto_Success() {
        TaskDto inputDto = new TaskDto();
        inputDto.setId(11L);
        Task taskEntity = new Task();
        taskEntity.setId(11L);

        when(taskMapperInterface.toEntity(inputDto)).thenReturn(taskEntity);
        when(taskRepositoryInterface.save(taskEntity)).thenReturn(taskEntity);
        when(taskMapperInterface.toDto(taskEntity)).thenReturn(inputDto);

        TaskDto result = taskService.addTaskDto(inputDto);

        assertNotNull(result);
        assertEquals(11L, result.getId());
        verify(taskRepositoryInterface, times(1)).save(taskEntity);
    }
}
