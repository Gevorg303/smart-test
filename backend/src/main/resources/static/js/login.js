
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const requestBody = {
            login: username,
            password: password
        };

        fetch('/teacher/check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        })
        .then(response => response.json())
        .then(data => {
            if (data) {
                window.location.href = '/test-smart/account'; // Переход на главную страницу при успешном входе
            } else {
                alert('Неверный логин или пароль'); // Сообщение об ошибке
            }
        })
        .catch(error => {
            console.error('Ошибка:', error);
            alert('Произошла ошибка. Попробуйте еще раз.');
        });
    });
});
