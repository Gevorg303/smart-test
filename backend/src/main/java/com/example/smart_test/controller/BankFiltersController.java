package com.example.smart_test.controller;

import com.example.smart_test.domain.TypeTest;
import com.example.smart_test.domain.User;
import com.example.smart_test.domain.Theme;
import com.example.smart_test.domain.Subject;
import com.example.smart_test.dto.*;
import com.example.smart_test.request.IndicatorFilterRequest;
import com.example.smart_test.request.TaskFilterRequest;
import com.example.smart_test.request.TestFilterRequest;
import com.example.smart_test.service.api.BankFilterServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/bank-filters")
public class BankFiltersController {
    @Autowired
    private BankFilterServiceInterface bankFilterService;

    /**
     * Обработчик запроса для получения списка заданий, отфильтрованных по заданным критериям.
     * <p>
     * Фильтрация выполняется по следующим критериям:
     * 1. {@code user} - пользователь, чьи задания должны быть возвращены.
     * 2. {@code subject} - предмет, по которому нужно фильтровать задания.
     * 3. {@code theme} - тема, по которой нужно фильтровать задания.
     * 4. {@code indicator} - индикатор, по которому нужно фильтровать задания.
     * <p>
     * Варианты работы фильтров:
     * - Если переданы все фильтры ({@code user}, {@code subject}, {@code theme}, {@code indicator}),
     * метод вернет задания, соответствующие всем указанным критериям.
     * - Если передан только один фильтр (например, {@code subject}), метод отфильтрует задания только по этому критерию.
     * - Если переданы два или три фильтра, они будут комбинироваться для фильтрации (например, {@code subject} и {@code theme}).
     * - Если не передан ни один фильтр, возвращаются все задания, доступные для указанного пользователя.
     * <p>
     * Примеры запросов:
     * 1. Фильтрация по теме:
     * <pre>
     *    {
     *      "user": { "id": 1 },
     *      "theme": { "id": 5 }
     *    }
     *    </pre>
     * Вернет все задания пользователя с указанной темой.
     * <p>
     * 2. Фильтрация по теме и индикатору:
     * <pre>
     *    {
     *      "user": { "id": 1 },
     *      "theme": { "id": 5 },
     *      "indicator": { "id": 10 }
     *    }
     *    </pre>
     * Вернет задания, соответствующие указанной теме и индикатору.
     * <p>
     * 3. Фильтрация по всем параметрам:
     * <pre>
     *    {
     *      "user": { "id": 1 },
     *      "subject": { "id": 3 },
     *      "theme": { "id": 5 },
     *      "indicator": { "id": 10 }
     *    }
     *    </pre>
     * Вернет только те задания, которые удовлетворяют всем переданным фильтрам.
     *
     * @param testFilterRequest объект запроса с параметрами фильтрации:
     *                          - {@link TaskFilterRequest#getUser()} пользователь, для которого выполняется поиск заданий.
     *                          - {@link TaskFilterRequest#getSubject()} предмет, по которому выполняется фильтрация (может быть {@code null}).
     *                          - {@link TaskFilterRequest#getTheme()} тема, по которой выполняется фильтрация (может быть {@code null}).
     *                          - {@link TaskFilterRequest#getIndicator()} индикатор, по которому выполняется фильтрация (может быть {@code null}).
     * @return {@link ResponseEntity} содержащий список объектов {@link TaskDto}.
     * Если задания найдены, возвращается HTTP-статус 200 OK с отфильтрованным списком заданий.
     * Если задания отсутствуют, возвращается пустой список.
     */
    @PostMapping("/tasks")
    public ResponseEntity<List<TaskDto>> getTasksFilter(@RequestBody TaskFilterRequest testFilterRequest) {
        List<TaskDto> sortedTasks = bankFilterService.getTasksFilter(
                testFilterRequest.getUser(),
                testFilterRequest.getSubject(),
                testFilterRequest.getTheme(),
                testFilterRequest.getIndicator()
        );
        return ResponseEntity.ok(sortedTasks);
    }


    /**
     * Получение отсортированных тестов с фильтрацией по типу теста, предмету и/или теме.
     * В зависимости от того, какие фильтры переданы, результат может включать тесты, отфильтрованные по одному или нескольким критериям.
     *
     * Логика фильтрации:
     * 1. Если фильтр по типу теста передан, тесты будут отфильтрованы по соответствующему типу.
     * 2. Если фильтр по предмету передан, тесты будут фильтроваться по темам, связанным с данным предметом.
     * 3. Если фильтр по теме передан, тесты будут дополнительно фильтроваться по конкретной теме.
     * 4. Если переданы все три фильтра (тип теста, предмет и тема), тесты должны соответствовать всем указанным критериям.
     * 5. Если фильтры не указаны, возвращаются все тесты пользователя без фильтрации.
     *
     * @param request объект типа {@link TestFilterRequest}, который содержит параметры для фильтрации:
     *                - {@link TypeTest testType}: Тип теста, по которому будет происходить фильтрация.
     *                - {@link User user}: Пользователь, чьи тесты необходимо отфильтровать.
     *                - {@link Subject subject}: Предмет, по которому будет происходить дополнительная фильтрация тестов.
     *                - {@link Theme theme}: Тема, по которой дополнительно фильтруются тесты.
     * @return {@link ResponseEntity} с HTTP-статусом 200 OK и списком объектов {@link TestDto}, представляющих отфильтрованные тесты.
     * В случае успеха возвращается список тестов, отфильтрованных по указанным критериям, обернутый в объект {@link ResponseEntity}.
     * Если тесты не найдены, возвращается пустой список.
     *
     * Пример запроса:
     * POST /tests/by-filters
     * {
     *   "testType": { "nameOfTestType": "Входной контроль" },
     *   "user": { "id": 2 },
     *   "subject": { "id": 16 },
     *   "theme": { "id": 5 }
     * }
     */
    @PostMapping("/tests")
    public ResponseEntity<List<TestDto>> getTestsFilter(@RequestBody TestFilterRequest request) {
        List<TestDto> sortedTests = bankFilterService.getTestsFilter(request.getTestType(), request.getUser(), request.getSubject(), request.getTheme());
        return ResponseEntity.ok(sortedTests);
    }

    /**
     * Получает список индикаторов пользователя с возможностью фильтрации по предмету.
     *
     * @param request Объект `IndicatorFilterRequest`, содержащий:
     *                - `user` (обязательный) - пользователь, для которого запрашиваются индикаторы.
     *                - `subject` (необязательный) - предмет, по которому нужно отфильтровать индикаторы.
     * 1. Если `subject` не задан, возвращает все индикаторы пользователя.
     * 2. Если `subject` задан, возвращает только индикаторы, относящиеся к указанному предмету.
     */
    @PostMapping("/indicators")
    public ResponseEntity<List<IndicatorDto>> getIndicatorFilter(@RequestBody IndicatorFilterRequest request) {
        List<IndicatorDto> sortedIndicators = bankFilterService.getIndicatorFilter(request.getUser(), request.getSubject());
        return ResponseEntity.ok(sortedIndicators);
    }

    @PostMapping("/subjects")
    public ResponseEntity<Set<SubjectDto>> getSubjectFilter(@RequestBody StudentClassDto request){
        Set<SubjectDto> subjectDto = bankFilterService.getSubjectFilter(request);
        return ResponseEntity.ok(subjectDto);
    }
}
