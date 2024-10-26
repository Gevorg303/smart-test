// Функция для создания HTML-карточки темы
/*function createSubjectCard(subject) {
    const card = document.createElement('div');
    card.className = 'card';

    const title = document.createElement('h2');
    title.textContent = subject.themeName;
    card.appendChild(title);

    const description = document.createElement('p');
    description.textContent = subject.description;
    card.appendChild(description);

    return card;
}

// Получение тем при загрузке страницы
document.addEventListener('DOMContentLoaded', fetchSubjects);

// Функция для получения тем с сервера
async function fetchSubjects() {
    try {
        const response = await fetch('/theme/all');
        if (!response.ok) {
            throw new Error('Ошибка сети');
        }
        const subjects = await response.json();
        const container = document.getElementById('subjects-container');
        subjects.forEach(subject => {
            const card = createSubjectCard(subject);
            container.appendChild(card);
        });
    } catch (error) {
        console.error('Ошибка получения данных:', error);
    }
}*/
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
// Функция для создания HTML-карточки темы
function createSubjectCard(subject) {
    const card = document.createElement('div');
    card.className = 'card';

    const title = document.createElement('h2');
    title.className = 'h2';
    title.textContent = subject.themeName;
    card.appendChild(title);

    const description = document.createElement('p');
    description.textContent = subject.description;
    card.appendChild(description);

    // Создание списка пунктов
    const list = document.createElement('ul');

    const items = [
        { text: 'Входной тест'  },
        { text: 'Тренажёр'},
        { text: 'Итоговый тест' }
    ];

    items.forEach(item => {
        const listItem = document.createElement('li');
        const link = document.createElement('button');
        link.className = 'testlink';
      //  link.href = item.url;
        link.textContent = item.text;
        listItem.appendChild(link);
        list.appendChild(listItem);
    });

    card.appendChild(list);

    return card;
}
function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

// Получение тем при загрузке страницы
document.addEventListener('DOMContentLoaded', fetchSubjects);
document.addEventListener('DOMContentLoaded', VisibleDelAdd);
document.addEventListener('DOMContentLoaded', CheckRole);
document.addEventListener('DOMContentLoaded', SetSubject);
const confirmButton= document.getElementById('confirmAction');
confirmButton.addEventListener('click', Confirm);
const radioAdd= document.getElementById('radioAdd');
const radioDel= document.getElementById('radioDel');
radioAdd.addEventListener('click', VisibleDelAdd);
radioDel.addEventListener('click', VisibleDelAdd);


async function SetSubject() {

    const titlesubject=document.getElementById('titlesubject');
    const subid = getCookie("sub");
         try {
            const response = await fetch('/subject/id:'+subid);
                if (!response.ok) {
                    throw new Error('Ошибка сети');
                }
            const subject = await response.json();
           //console.log(subject)
            titlesubject.innerHTML= subject.subjectName;
         } catch (error) {
                console.error('Ошибка получения данных:', error);
            }

}
async function Confirm() {
    const itemName=document.getElementById('itemName');
    const selectTheme=document.getElementById('selectTheme');
    const subid = getCookie("sub");
    if(radioAdd.checked == true)
    {

         try {
            const response = await fetch('/subject/id:'+subid);
                if (!response.ok) {
                    throw new Error('Ошибка сети');
                }
            const subject = await response.json();
           console.log(subject)
        var formData = {
            themeName: itemName.value,
            subject: subject
        };
            console.log(formData)
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/theme/add", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(formData));
         if (xhr.status === 200) {location.reload(true);}
         } catch (error) {
                console.error('Ошибка получения данных:', error);
            }
    }
    else
    {
    try {
            const response = await fetch('/theme/id:'+selectTheme.value);
                            if (!response.ok) {
                                throw new Error('Ошибка сети');
                            }
            const subject = await response.json();
            console.log(subject)
            var xhr = new XMLHttpRequest();
            xhr.open("DELETE", "/theme/delete", true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify(subject));
             if (xhr.status === 200) {location.reload(true);}
             } catch (error) {
                    console.error('Ошибка получения данных:', error);
                }
    }
setInterval(() => window.location.reload(), 100);
//location.reload();
}
async function VisibleDelAdd() {
    const radioAdd= document.getElementById('radioAdd');
    const radioDel= document.getElementById('radioDel');

    const itemName=document.getElementById('itemName');
    const selectSubject=document.getElementById('selectTheme');

    const labelitemName=document.getElementById('labelitemName');
    const labelselectSubject=document.getElementById('labelselectTheme');

    itemName.style.visibility = "hidden";
    selectSubject.style.visibility = "hidden";

    labelitemName.style.visibility = "hidden";
    labelselectSubject.style.visibility = "hidden";

    if(radioDel.checked == false)
    {

        itemName.style.visibility = "visible";
        selectSubject.style.visibility = "hidden";

         labelitemName.style.visibility = "visible";
         labelselectSubject.style.visibility = "hidden";

    }else
    {
            itemName.style.visibility = "hidden";
            selectSubject.style.visibility = "visible";

             labelitemName.style.visibility = "hidden";
            labelselectSubject.style.visibility = "visible";
    }
}


// Функция для получения тем с сервера
async function fetchSubjects() {
    try {
        const response = await fetch('/theme/getbysubject');
        if (!response.ok) {
            throw new Error('Ошибка сети');
        }
        const subjects = await response.json();titlesubject
        const container = document.getElementById('subjects-container');
        container.innerHTML ="";
        if(subjects.length != 0){
        subjects.forEach(subject => {
            const card = createSubjectCard(subject);
            container.appendChild(card);
        });
        const selectTheme = document.getElementById('selectTheme');
        selectTheme.innerHTML ="";
                subjects.forEach(subject => {
                            selectTheme.append(new Option(subject.themeName,subject.id));
                        });
                        }
        else{
                let empty = document.createElement('h3');
                empty.innerHTML="У вас пока нет тем в этом предмете."
                container.appendChild(empty);
        }


    } catch (error) {
        console.error('Ошибка получения данных:', error);
    }
}