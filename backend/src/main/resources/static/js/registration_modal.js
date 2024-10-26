// Получаем ссылки на модальное окно и overlay
const modal = document.getElementById('myModal');
const overlay = document.getElementById('overlay');

// Функция для открытия модального окна
function openModal() {
    modal.style.display = 'block';
}

// Функция для закрытия модального окна
function closeModal() {
    modal.style.display = 'none';
}

window.onclick = function(event) {
if (event.target == modal) {
modal.style.display = 'none';
body.style.overflow = 'auto';
}
}

// Обработчик клика по кнопке открытия модального окна
// Здесь вы можете добавить логику, при которой модальное окно открывается, например, после успешной регистрации
// В данном случае, я просто вызываю функцию openModal()
document.getElementById('openModalButton').addEventListener('click', function() {
    openModal();
});