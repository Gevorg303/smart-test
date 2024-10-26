const openModalBtn = document.getElementById('open-modal');
const closeModalBtn = document.getElementById('close-modal');
const modal = document.querySelector('.modal');

openModalBtn.addEventListener('click', function() {
    modal.style.display = 'block';
    document.body.classList.add('modal-open');
});

closeModalBtn.addEventListener('click', function() {
    modal.style.display = 'none';
    document.body.classList.remove('modal-open');
});