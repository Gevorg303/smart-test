var modal = document.getElementById('myModal');
    var openModalBtn = document.getElementById('openModal');
    var confirmActionBtn = document.getElementById('confirmAction');
    var action;
    var itemNameInput = document.getElementById('itemName');

    openModalBtn.onclick = function() {
        modal.style.display = 'block';
    }

    confirmActionBtn.onclick = function() {
        var actionRadios = document.getElementsByName('action');
        for (var i = 0; i < actionRadios.length; i++) {
            if (actionRadios[i].checked) {
                action = actionRadios[i].value;
                break;
            }
        }

        var itemName = itemNameInput.value;

        if (action === 'delete') {
            // Действия для удаления темы
            console.log('Удалить предмет: ' + itemName);
        } else if (action === 'add') {
            // Действия для добавления предмета
            console.log('Добавить предмет: ' + itemName);
        }

        modal.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    }