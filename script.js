// изменение темы

document.getElementById('themeToggle').addEventListener('click', function () {
    const currentTheme = document.body.className;
    const modaleTheme = document.getElementsByClassName('modale_window');
    const ThemeIcon = document.getElementById('ThemeIcon');

    if (currentTheme === 'dark-theme') {
        document.body.className = 'light-theme';
        for (let i = 0; i < modaleTheme.length; i++) {
            modaleTheme[i].classList.add('modale_window-dark');
        }
        ThemeIcon.src = "photos/moon.svg";
    } else {
        document.body.className = 'dark-theme';
        for (let i = 0; i < modaleTheme.length; i++) {
            modaleTheme[i].classList.remove('modale_window-dark');
        }
        ThemeIcon.src = "photos/sun.svg";
    }
});

// модальное окно (создание)

const modaleWindow = document.querySelector('.modale_window');
const background = document.querySelector('.background_box');
const button = document.getElementById('add_task');
const empty = document.getElementById('empty');
const emptyText = document.getElementById('emt_txt');

button.addEventListener('click', (e) => {
    e.preventDefault();
    modaleWindow.style.display = "flex";
    background.style.display = "flex";
});

// кнопки действия в модальном окне

const apply = document.querySelector('#apply');
const cancel = document.querySelector('#cancel');
const input = document.getElementById('task_name');
const tasksContainer = document.querySelector('.box_for_tasks');

function setupTaskEvents(taskList, checkbox, editBtn, deleteBtn, taskText, hr) {
    deleteBtn.addEventListener('click', () => {

        const taskTextToDelete = taskText.textContent;
        
        let fd = new FormData();
        fd.append('task_text', taskTextToDelete);
        
        fetch("server/deleteTask.php", {
            method: 'post',
            body: fd
        })
        .then(() => {
            taskList.remove();
            hr.remove();
            checkEmptyState();
        })
        .catch(error => {
            console.error('Ошибка:', error);
            taskList.remove();
            hr.remove();
            checkEmptyState();
        });
    });
    
    editBtn.addEventListener('click', () => {
        const newText = prompt('Редактировать задачу:', taskText.textContent);
        if (newText !== null && newText.trim() !== '') {
            taskText.textContent = newText.trim();
        }
    });
    
    checkbox.addEventListener('change', () => {
        const selectElement = document.querySelector("#spisok");
        const selectedValue = selectElement.value;
        
        if (selectedValue !== "ALL") {
            const isChecked = checkbox.checked;
            if ((selectedValue === "DONE" && !isChecked) || 
                (selectedValue === "ONGOING" && isChecked)) {
                taskList.style.display = "none";
                hr.style.display = "none";
            } else {
                taskList.style.display = "flex";
                hr.style.display = "block";
            }
            checkEmptyState();
        }
    });
}

function checkEmptyState() {
    const taskLists = document.querySelectorAll(".box_for_tasks > .tasklist");
    const emptyImg = document.querySelector("#empty");
    const emptyText = document.querySelector("#emt_txt");

    const hasVisibleTasks = Array.from(taskLists).some(task =>
        task.style.display !== 'none'
    );

    if (hasVisibleTasks) {
        emptyImg.style.display = "none";
        emptyText.style.display = "none";
    } else {
        emptyImg.style.display = "block";
        emptyText.style.display = "block";
    }
}

// создание задачи через модальное окно

apply.addEventListener('click', (e) => {
    e.preventDefault();

    if (!input.value.trim()) {
        alert('Введите текст задачи!');
        return;
    }

    const taskText = input.value.trim();
    let fd = new FormData();
    fd.append('task_text', taskText);

    fetch("server/createTask.php", {
        method: 'post',
        body: fd
    })
        .then(response => response.json())
        .then((response) => {
            console.log('Задача сохранена на сервере:', response);

            const taskList = document.createElement('div');
            taskList.className = 'tasklist';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'task';

            const taskTextElement = document.createElement('p');
            taskTextElement.className = 'task_text';
            taskTextElement.textContent = taskText;
            taskTextElement.style.color = document.body.className === 'dark-theme' ? '#ffffff' : '#333333';

            const label = document.createElement('label');
            label.className = 'checkbox-label';

            label.appendChild(checkbox);
            label.appendChild(taskTextElement);
            taskList.appendChild(label);

            const actions = document.createElement('div');
            actions.className = 'note_actions';

            const editBtn = document.createElement('button');
            editBtn.type = 'button';
            editBtn.classList.add("icon-btn", "edit-btn");
            editBtn.title = 'Редактировать';

            const editImg = document.createElement('img');
            editImg.src = 'photos/edit.svg';
            editImg.alt = 'Редактировать';
            editBtn.appendChild(editImg);

            const deleteBtn = document.createElement('button');
            deleteBtn.type = 'button';
            deleteBtn.classList.add("icon-btn", "delete-btn");
            deleteBtn.title = 'Удалить';

            const deleteImg = document.createElement('img');
            deleteImg.src = 'photos/trash.svg';
            deleteImg.alt = 'Удалить';
            deleteBtn.appendChild(deleteImg);

            actions.appendChild(editBtn);
            actions.appendChild(deleteBtn);
            taskList.appendChild(actions);

            const hr = document.createElement('hr');

            tasksContainer.insertBefore(taskList, empty);
            tasksContainer.insertBefore(hr, empty);

            empty.style.display = 'none';
            emptyText.style.display = 'none';

            input.value = '';

            setupTaskEvents(taskList, checkbox, editBtn, deleteBtn, taskTextElement, hr);

            modaleWindow.style.display = "none";
            background.style.display = "none";
        })
        .catch(error => {
            console.error('Ошибка при сохранении задачи:', error);
            alert('Ошибка при сохранении задачи');
        });
});

cancel.addEventListener('click', (e) => {
    e.preventDefault();
    modaleWindow.style.display = "none";
    background.style.display = "none";
});

background.addEventListener('click', (e) => {
    e.preventDefault();
    modaleWindow.style.display = "none";
    background.style.display = "none";
});

// загрузка задач 

document.addEventListener("DOMContentLoaded", () => {
    loadTasksFromServer();
});

function loadTasksFromServer() {
    fetch('server/getTask.php')
        .then(response => response.json())
        .then((tasks) => {
            console.log('Загруженные задачи:', tasks);

            const existingTasks = document.querySelectorAll(".box_for_tasks > .tasklist, .box_for_tasks > hr");
            existingTasks.forEach(task => task.remove());

            if (Array.isArray(tasks) && tasks.length > 0) {
                tasks.forEach((taskText, index) => {
                    if (taskText !== null && taskText.trim() !== '') {
                        createTaskFromServer(taskText, index);
                    }
                });

                setTimeout(checkEmptyState, 100);
            } else {
                checkEmptyState();
            }
        })
        .catch(error => {
            console.error('Ошибка при загрузке задач:', error);
            checkEmptyState();
        });
}

function createTaskFromServer(taskText, index) {
    const taskList = document.createElement('div');
    taskList.className = 'tasklist';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task';
    checkbox.id = `task_${index}`;

    const taskTextElement = document.createElement('p');
    taskTextElement.className = 'task_text';
    taskTextElement.textContent = taskText;
    taskTextElement.style.color = document.body.className === 'dark-theme' ? '#ffffff' : '#333333';

    const label = document.createElement('label');
    label.className = 'checkbox-label';
    label.htmlFor = `task_${index}`;

    label.appendChild(checkbox);
    label.appendChild(taskTextElement);
    taskList.appendChild(label);

    const actions = document.createElement('div');
    actions.className = 'note_actions';

    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.classList.add("icon-btn", "edit-btn");
    editBtn.title = 'Редактировать';

    const editImg = document.createElement('img');
    editImg.src = 'photos/edit.svg';
    editImg.alt = 'Редактировать';
    editBtn.appendChild(editImg);

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.classList.add("icon-btn", "delete-btn");
    deleteBtn.title = 'Удалить';

    const deleteImg = document.createElement('img');
    deleteImg.src = 'photos/trash.svg';
    deleteImg.alt = 'Удалить';
    deleteBtn.appendChild(deleteImg);

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);
    taskList.appendChild(actions);

    const hr = document.createElement('hr');

    tasksContainer.insertBefore(taskList, empty);
    tasksContainer.insertBefore(hr, empty);

    setupTaskEvents(taskList, checkbox, editBtn, deleteBtn, taskTextElement, hr);
}

// сортировка

const selectElement = document.querySelector("#spisok");

function filterTasks(filterType) {
    const taskLists = document.querySelectorAll(".box_for_tasks > .tasklist");
    const hrs = document.querySelectorAll(".box_for_tasks > hr");

    let visibleTasks = 0;

    taskLists.forEach((taskList, index) => {
        const checkbox = taskList.querySelector('.task');
        const hr = hrs[index];
        const isChecked = checkbox ? checkbox.checked : false;

        let shouldShow = false;

        switch (filterType) {
            case "ALL":
                shouldShow = true;
                break;
            case "DONE":
                shouldShow = isChecked;
                break;
            case "ONGOING":
                shouldShow = !isChecked;
                break;
        }

        if (shouldShow) {
            taskList.style.display = "flex";
            if (hr) hr.style.display = "block";
            visibleTasks++;
        } else {
            taskList.style.display = "none";
            if (hr) hr.style.display = "none";
        }
    });

    if (visibleTasks === 0 && taskLists.length > 0) {
        empty.style.display = "block";
        emptyText.style.display = "block";
    } else {
        empty.style.display = "none";
        emptyText.style.display = "none";
    }
}

// поиск

selectElement.addEventListener('change', (e) => {
    const selectedValue = e.target.value;
    filterTasks(selectedValue);
});

const searchInput = document.getElementById('finder-light');
const searchButton = document.getElementById('btnfind');

function performSearch(searchTerm) {
    const taskLists = document.querySelectorAll(".box_for_tasks > .tasklist");
    const hrs = document.querySelectorAll(".box_for_tasks > hr");
    const emptyImg = document.querySelector("#empty");
    const emptyText = document.querySelector("#emt_txt");

    let foundTasks = 0;

    if (searchTerm.trim() === '') {
        const selectElement = document.querySelector("#spisok");
        filterTasks(selectElement.value);
        return;
    }

    const searchLower = searchTerm.toLowerCase();

    taskLists.forEach((taskList, index) => {
        const taskText = taskList.querySelector('.task_text');
        const hr = hrs[index];

        if (taskText && taskText.textContent.toLowerCase().includes(searchLower)) {
            taskList.style.display = "flex";
            if (hr) hr.style.display = "block";
            foundTasks++;
        } else {
            taskList.style.display = "none";
            if (hr) hr.style.display = "none";
        }
    });

    if (foundTasks === 0) {
        emptyImg.style.display = "block";
        emptyText.style.display = "block";
    } else {
        emptyImg.style.display = "none";
        emptyText.style.display = "none";
    }
}

searchButton.addEventListener('click', (e) => {
    e.preventDefault();
    performSearch(searchInput.value);
});
