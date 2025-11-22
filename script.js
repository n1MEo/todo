document.getElementById('themeToggle').addEventListener('click', function () {
    const currentTheme = document.body.className;
    const ThemeIcon = document.getElementById('ThemeIcon');
    if (currentTheme === 'light-theme') {
        document.body.className = 'dark-theme';
        ThemeIcon.src = "photos/sun.svg";
    } else {
        document.body.className = 'light-theme';
        ThemeIcon.src = "photos/moon.svg";
    }
});

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

const apply = document.querySelector('#apply');
const cancel = document.querySelector('#cancel');
const input = document.getElementById('task_name');
const tasksContainer = document.querySelector('.box_for_tasks');

function setupTaskEvents(taskList, checkbox, editBtn, deleteBtn, taskText, hr) {
    deleteBtn.addEventListener('click', () => {
        taskList.remove();
        hr.remove();
        checkEmptyState();
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

apply.addEventListener('click', (e)=>{
    e.preventDefault(); 
    if(!input.value.trim()){
        alert('Введите текст задачи!');
        return;
    }

    const taskList = document.createElement('div');
    taskList.className = 'tasklist';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task';
    
    const taskText = document.createElement('p');
    taskText.className = 'task_text';
    taskText.textContent = input.value;
    
    const label = document.createElement('label');
    label.className = 'checkbox-label';
    
    label.appendChild(checkbox);
    label.appendChild(taskText);
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
    
    modaleWindow.style.display = "none";
    background.style.display = "none";

    const hr = document.createElement('hr');
    
    tasksContainer.insertBefore(taskList, empty);
    tasksContainer.insertBefore(hr, empty);
    
    empty.style.display = 'none';
    emptyText.style.display = 'none';
    
    input.value = '';
    
    setupTaskEvents(taskList, checkbox, editBtn, deleteBtn, taskText, hr);
});

cancel.addEventListener('click', (e)=>{
    e.preventDefault();
    modaleWindow.style.display = "none";
    background.style.display = "none";
});

background.addEventListener('click', (e)=>{
    e.preventDefault();
    modaleWindow.style.display = "none";
    background.style.display = "none";
});

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
        
        switch(filterType) {
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

selectElement.addEventListener('change', (e) => {
    const selectedValue = e.target.value;
    filterTasks(selectedValue);
});