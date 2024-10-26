function registerUser() {
            // Получаем данные из формы
            let role = document.getElementById('role').value;
            let surname = document.getElementById('surname').value;
            let name = document.getElementById('name').value;
            let patronymic = document.getElementById('patronymic').value;
            let email = document.getElementById('email').value;

            // Создаем случайный логин и пароль
            let login = surname +name[0] + Math.floor(Math.random() * 100);
            let password = Math.random().toString(36).substring(2, 15);

            // Отображаем модальное окно
           document.getElementById('modalLogin').textContent = login;
           document.getElementById('modalPassword').textContent = password;
           document.getElementById('myModal').style.display = 'block';
           document.getElementById('overlay').style.display = 'block';
            }

            function closeModal() {
            document.getElementById('myModal').style.display = 'none';
            document.getElementById('overlay').style.display = 'none';
            }
</script>