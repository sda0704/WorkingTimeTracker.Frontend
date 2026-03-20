<script setup>

import {ref} from 'vue';
const editingTask = ref(null);



let pageTitle = ref("Учет рабочего времени - Задачи");
let tasks = ref([]);

const loadTasks = async () => {
    try{
        const response = await fetch("http://localhost:5268/api/tasks");
        if(!response.ok) {throw new Error(`HTTP ${response.status}`)};
        let data = await response.json();
        tasks.value = data
    }
    catch(error){
        console.log("Ошибка:", error.message);
    }
}
loadTasks();

const newTask = ref({
    title: '',
    isActive: true,
    projectId: ''
});

const createTask = async() => {
    try{
        const response = await fetch("http://localhost:5268/api/tasks",{
            method: 'POST',
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(newTask.value)
        });
        if(!response.ok) {throw new Error(`HTTP ${response.status}`)}
        const createdTask = await response.json();
        tasks.value.push(createdTask);
        newTask.value = {title: '', isActive: true, projectId: ''}
        console.log("Задача создана")
    }
    catch(error){
        console.log("Ошибка:", error.message);
    }
};
const startEdit = async (task)  => {
    editingTask.value = {...task};
};

const updateTask = async () => {
    try{
        const response = await fetch(`http://localhost:5268/api/tasks/${editingTask.value.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(editingTask.value)
        });
        if(!response.ok) {throw new Error(`HTTP ${response.status}`)}
        const index = tasks.value.findIndex(p => p.id === editingTask.value.id);
        if (index !== -1){
            tasks.value[index] = {...editingTask.value};
        }
        editingTask.value = null;
        console.log("Задача обновлена");
    }
    catch(error){
        console.log("Ошибка:", error.message);
    }
}

const deleteTask = async(id) => {
    try{
        const response = await fetch(`http://localhost:5268/api/tasks/${id}`,{
            method: 'DELETE'
        });
         if(!response.ok) {throw new Error(`HTTP ${response.status}`)};
        tasks.value = tasks.value.filter(p => p.id !== id);
        console.log("Задача удалена");

    }
    catch(error){
        console.log("Ошибка:", error.message);
    }
}
 let projects = ref([]);

    const loadProjects = async () =>{
try{


    const response = await fetch("http://localhost:5268/api/project");
    if(!response.ok){throw new Error(`HTTP ${response.status}`)};
    let data = await response.json();
    projects.value = data
}
catch(error){
    console.log("Ошибка:", error.message)
}

    }
    loadProjects();

const getProjectTitle = (projectId) => {
    const project = projects.value.find(p => p.id === projectId);
    return project ? project.title: 'Неизвестный проект';
}

</script>

<template>
<div>
    <h1>{{ pageTitle }}</h1>

    <ul>
        <li v-for="task in tasks" :key="task.id">
            {{ task.title }} (Проект: {{ getProjectTitle(task.projectId) }})
            <button @click="startEdit(task)">Редактировать</button>
            <button @click="deleteTask(task.id)">Удалить</button>
        </li>
    </ul>
    <div v-if="!editingTask">
        <input v-model="newTask.title" placeholder="Название задачи">
        <select v-model="newTask.projectId">
            <option value="" disabled>Выберите проект</option>
            <option v-for="project in projects" :key="project.id" :value="project.id">
                {{ project.title }}
            </option>
        </select>
        <label >

            <input type="checkbox" v-model="newTask.isActive"> Активна
        </label>
        <button @click="createTask">Создать задачу</button>
    </div>
    <div v-else>
        <input v-model="editingTask.title" placeholder="Название задачи">
        <select v-model="editingTask.projectId">
            <option value="" disabled>Выберите проект</option>
            <option v-for="project in projects" :key="project.id" :value="project.id">
            {{ project.title }}
            </option>
        </select>
        <label >
            <input type="checkbox" v-model="editingTask.isActive"> Активна
        </label>
        <button @click="updateTask">Сохранить</button>
        <button @click="editingTask = null">Отмена</button>
    </div>
</div>

</template>