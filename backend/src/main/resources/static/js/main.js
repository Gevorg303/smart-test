// Функция для создания HTML-карточки предмета
function createSubjectCard(subject) {
    const card = document.createElement('div');
    card.id=subject.id
    card.className = 'card';

    const title = document.createElement('h2');
    title.textContent = subject.subjectName;
    card.appendChild(title);

    const description = document.createElement('p');
    description.textContent = subject.description;
    card.appendChild(description);
    card.addEventListener('click',function (event) {
    window.location.href = '/test-smart/theme';
    document.cookie = "sub="+subject.id+"; path=/;";
     });
    return card;
}

// Получение предметов при загрузке страницы
document.addEventListener('DOMContentLoaded', CheckRole);
document.addEventListener('DOMContentLoaded', fetchSubjects);
document.addEventListener('DOMContentLoaded', fetchUser);
document.addEventListener('DOMContentLoaded', fetchStudentCLass);
document.addEventListener('DOMContentLoaded', VisibleDelAdd);

const selectClass = document.getElementById('selectClass');
selectClass.addEventListener('change', fetchSubjectsByClass);
selectClass.addEventListener('click', fetchSubjectsByClass);
const radioAdd= document.getElementById('radioAdd');
const radioDel= document.getElementById('radioDel');
radioAdd.addEventListener('click', VisibleDelAdd);
radioDel.addEventListener('click', VisibleDelAdd);
const confirmButton= document.getElementById('confirmAction');
confirmButton.addEventListener('click', Confirm);

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


async function Confirm() {
    const itemName=document.getElementById('itemName');
    const itemDescription=document.getElementById('itemDescription');
    const selectClass=document.getElementById('selectClass');
    const selectSubject=document.getElementById('selectSubject');
    if(radioAdd.checked == true)
    {

         try {
            const response = await fetch('/users/current');
                if (!response.ok) {
                    throw new Error('Ошибка сети');
                }
            const user = await response.json();
            const response2 = await fetch('/teacherClass/classid='+selectClass.value+'/teacherid='+user.id);
                            if (!response2.ok) {
                                throw new Error('Ошибка сети');
                            }
           const teacher = await response2.json();
           console.log(teacher)
        var formData = {
            subjectName: itemName.value,
            description: itemDescription.value,
            teacherClass: teacher,
        };
            console.log(formData)
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/subject/add", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(JSON.stringify(formData));
         } catch (error) {
                console.error('Ошибка получения данных:', error);
            }
    }
    else
    {
    try {
            const response = await fetch('/subject/id:'+selectSubject.value);
                            if (!response.ok) {
                                throw new Error('Ошибка сети');
                            }
            const subject = await response.json();
            console.log(subject)
            var xhr = new XMLHttpRequest();
            xhr.open("DELETE", "/subject/delete", true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify(subject));
             } catch (error) {
                    console.error('Ошибка получения данных:', error);
                }
    }
    setInterval(() => window.location.reload(), 100);
}

//отображение меню выббора удаления и добавления предмета
async function VisibleDelAdd() {
    const radioAdd= document.getElementById('radioAdd');
    const radioDel= document.getElementById('radioDel');

    const itemName=document.getElementById('itemName');
    const itemDescription=document.getElementById('itemDescription');
    const selectClass=document.getElementById('selectClass');
    const selectSubject=document.getElementById('selectSubject');

    const labelitemName=document.getElementById('labelitemName');
    const labelitemDescription=document.getElementById('labelitemDescription');
    const labelselectClass=document.getElementById('labelselectClass');
    const labelselectSubject=document.getElementById('labelselectSubject');

    itemName.style.visibility = "hidden";
    itemDescription.style.visibility = "hidden";
    selectClass.style.visibility = "hidden";
    selectSubject.style.visibility = "hidden";

    labelitemName.style.visibility = "hidden";
    labelitemDescription.style.visibility = "hidden";
    labelselectClass.style.visibility = "hidden";
    labelselectSubject.style.visibility = "hidden";

    if(radioDel.checked == false)
    {

        itemName.style.visibility = "visible";
        itemDescription.style.visibility = "visible";
        selectClass.style.visibility = "visible";
        selectSubject.style.visibility = "hidden";

         labelitemName.style.visibility = "visible";
         labelitemDescription.style.visibility = "visible";
         labelselectClass.style.visibility = "visible";
         labelselectSubject.style.visibility = "hidden";

    }else
    {
            itemName.style.visibility = "hidden";
            itemDescription.style.visibility = "hidden";
            selectClass.style.visibility = "visible";
            selectSubject.style.visibility = "visible";

             labelitemName.style.visibility = "hidden";
            labelitemDescription.style.visibility = "hidden";
            labelselectClass.style.visibility = "visible";
            labelselectSubject.style.visibility = "visible";
    }
}

// Функция для получения предметов по учителю и классу
async function fetchSubjectsByClass() {
    try {
        const response = await fetch('/users/current');
            if (!response.ok) {
                throw new Error('Ошибка сети');
            }
        const user = await response.json();
        const classId = document.getElementById('selectClass').value;
        //console.log('/subject/classId='+classId+';teacherId='+user.id)
        response2 = await fetch('/subject/class='+classId+'/teacher='+user.id);
        if (!response2.ok) {
            throw new Error('Ошибка сети');
        }
        const subjects = await response2.json();
        const select = document.getElementById('selectSubject');
        select.innerHTML = ""
       // console.log(container)
        subjects.forEach(subject => {
             select.append(new Option(subject.subjectName,subject.id))
        });
          //  console.log(subjects)
    } catch (error) {
        console.error('Ошибка получения данных:', error);
    }
}

//получение классов учителя
async function fetchStudentCLass() {
    try {

        const response = await fetch('/users/current');
            if (!response.ok) {
                throw new Error('Ошибка поиска учителя');
            }
        const user = await response.json();
        console.log(user)
        if(user.role.role.toLowerCase()=="учитель" || user.role.role.toLowerCase()=="админ")
        {
            response2 = await fetch('/student-class/teacherid='+user.id);
            if (!response2.ok) {
                throw new Error('Ошибка вывода классов учителя');
            }
            const classes = await response2.json();
            const select = document.getElementById('selectClass');

            classes.forEach(subject => {

              // console.log(subject.numberOfInstitution +" "+ subject.letterDesignation +" "+ subject.educationalInstitution.nameOfTheInstitution + " "+ subject.educationalInstitution.address)
               select.append(new Option(subject.numberOfInstitution +" "+ subject.letterDesignation +" "+ subject.educationalInstitution.nameOfTheInstitution + " "+ subject.educationalInstitution.address,subject.id))
            });


           // console.log(select);
        }else{console.log("Пользователь - ученик")}
    } catch (error) {
        console.error('Ошибка получения данных:', error);
    }
}


// Функция для получения предметов с сервера
async function fetchSubjects() {
    try {
        const response = await fetch('/users/current');
            if (!response.ok) {
                throw new Error('Ошибка сети');
            }
        const user = await response.json();
        response2 = await fetch('/subject/'+user.login);
        if (!response2.ok) {
            throw new Error('Ошибка сети');
        }
        const subjects = await response2.json();
        const container = document.getElementById('subjects-container');
       // console.log(container)
       if(subjects.length !=0)
                   {
        subjects.forEach(subject => {
            const card = createSubjectCard(subject);
            container.appendChild(card);
        });
        }
        else{
        let empty = document.createElement('h3');
        empty.innerHTML="У вас пока нет предметов."
        container.appendChild(empty);
        }
    } catch (error) {
        console.error('Ошибка получения данных:', error);
    }
}
//Получение имени пользователя
async function fetchUser() {
    try {
        document.cookie = "sub=; path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT;";
        const response = await fetch('/users/current');
        if (!response.ok) {
            throw new Error('Ошибка сети');
        }
        const user = await response.json();
        const welcome = document.getElementById('welcome');
        welcome.innerHTML = "Здравствуйте, "+user.name + " ("+user.role.role + ")";
       /* subjects.forEach(subject => {
            const card = createSubjectCard(subject);
            container.appendChild(card);
        });*/
    } catch (error) {
        console.error('Ошибка получения данных:', error);
    }
}
