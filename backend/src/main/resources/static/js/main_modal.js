// Открытие и закрытие модального окна
var modal = document.getElementById('myModal');
var openModalBtn = document.getElementById('openModal');
var closeModalBtn = document.getElementById('closeModal');

openModalBtn.onclick = function() {
modal.style.display = 'block';
}

closeModalBtn.onclick = function() {
modal.style.display = 'none';
}

// Закрытие модального окна при клике вне его области
window.onclick = function(event) {
if (event.target == modal) {
modal.style.display = 'none';
}
}