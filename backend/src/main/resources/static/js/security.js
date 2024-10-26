document.addEventListener('DOMContentLoaded', function() {
    // Устанавливаем задержку в 10 секунд (10000 миллисекунд)
    setTimeout(function() {
        // Функция для получения значения куки по имени
        function getCookie(name) {
            // Создаем шаблон для поиска значения куки
            let cookieName = name + "=";
            // Разбиваем все куки по разделителю ";"
            let cookieArray = document.cookie.split(';');
            // Перебираем все куки
            for (let i = 0; i < cookieArray.length; i++) {
                let cookie = cookieArray[i];
                // Удаляем пробелы в начале и конце куки
                while (cookie.charAt(0) == ' ') {
                    cookie = cookie.substring(1);
                }
                // Если куки начинается с заданного шаблона
                if (cookie.indexOf(cookieName) == 0) {
                    // Возвращаем значение куки
                    return cookie.substring(cookieName.length, cookie.length);
                }
            }
            // Если куки не найдены
            return "";
        }

        // Получаем JWT из куки с именем 'jwtToken'
        let jwtToken = getCookie('jwtToken');

        // Проверяем наличие JWT и его корректность (можно добавить дополнительные проверки)
        if (!jwtToken || jwtToken.trim() === "") {
            // Перенаправляем на страницу логина
            window.location.href = '/test-smart/login';
        }
    }, 1000); // Задержка в 10 секунд (10000 миллисекунд)
});
