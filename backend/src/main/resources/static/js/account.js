
// Получение предметов при загрузке страницы
document.addEventListener('DOMContentLoaded', fetchUserToAccount);
 document.addEventListener('DOMContentLoaded', CheckRole);
async function CheckRole() {
    const adduserbutton = document.getElementById('adduserbutton');
    const edit = document.getElementById('openModal');
    console.log(edit)
    console.log(adduserbutton)
     const response = await fetch('/users/current');
            if (!response.ok) {
                throw new Error('Ошибка сети');
            }
            const user = await response.json();
             if(user.role.role.toLowerCase()=="учитель" || user.role.role.toLowerCase()=="админ")
             {
             console.log("You are admin")
             }
             else{
                                 adduserbutton.style.display = "none"
                                     edit.style.display = "none"
             }
}

async function fetchUserToAccount() {
    try {

        const response = await fetch('/users/current');
        if (!response.ok) {
            throw new Error('Ошибка сети');
        }
        const user = await response.json();
        const surname = document.getElementById('surname');
        const name = document.getElementById('name');
        const patronymic = document.getElementById('patronymic');
        const email = document.getElementById('email');
        const role = document.getElementById('role');

        surname.innerHTML = user.surname;
        name.innerHTML = user.name;
        patronymic.innerHTML = user.patronymic;
        email.innerHTML = user.email;
        role.innerHTML = user.role.role;
    } catch (error) {
        console.error('Ошибка получения данных:', error);
    }
}
document.querySelector('.out-button').addEventListener('click', function() {
    // Получаем все куки
    var cookies = document.cookie.split(";");

    // Перебираем все куки и удаляем их
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
    }

    // Перенаправляем пользователя на страницу входа
    window.location.href = 'login';
});

