<script setup>

const editingProject = ref(null);

import {ref } from 'vue';
    
    let pageTitle = ref("Учет рабочего времени - Проекты");
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
    const newProject = ref({
                title: '',
                code: '',
                isActive: true
            });
    const createProjects = async () => {
        try{
            
            const response = await fetch("http://localhost:5268/api/project", {
                method: 'POST',
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify(newProject.value)
            });
            if(!response.ok){throw new Error(`HTTP ${response.status}`)};
            const createdProject = await response.json();

            projects.value.push(createdProject);

            newProject.value = { title: '', code: '', isActive: true}
            console.log("Проект создан");

        }
        catch(error){
            console.log("Ошибка:", error.message)
        }
    }


    const startEdit = async (project) => {
        editingProject.value = {...project}
    }

    const updateProject = async() => {
        try{  
        const response = await fetch(`http://localhost:5268/api/project/${editingProject.value.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify(editingProject.value)
            });
              if(!response.ok){throw new Error(`HTTP ${response.status}`)};
              const index = projects.value.findIndex(p => p.id === editingProject.value.id);
              if(index !== -1){
                projects.value[index] = {...editingProject.value};
              }
              editingProject.value = null;
              console.log("Проект обновлен!");
            }
            catch(error){
                console.log("Ошибка:", error.message);
            }
    }
    const deleteProjects = async (id) => {
        try{
            const response = await fetch(`http://localhost:5268/api/project/${id}`,{
                method: 'DELETE'
            });
            if(!response.ok){throw new Error(`Http ${response.status}`)};
            projects.value = projects.value.filter(p => p.id !== id);
            console.log("Проект удален")

        }
        catch(error){
            console.log("Ошибка:", error.message);
        }
    }
loadProjects();
    


</script>
<template>
<div>
    <h1>{{ pageTitle }}</h1>

    <ul>
        <li v-for="project in projects" :key="project.id">{{ project.title }} 
             <button @click ="deleteProjects(project.id)">Удалить</button>
             <button @click="startEdit(project)">Редактировать</button>
         </li>
       
    </ul>

    <div v-if="!editingProject">
        
        <input v-model="newProject.title" placeholder="Название">
        <input v-model="newProject.code" placeholder="Код">
        <label for="">
            <input type='checkbox' v-model="newProject.isActive" > Активен
        </label>
        <button @click="createProjects">Создать проект</button>

    </div>
    <div v-else>
        <input v-model="editingProject.title" placeholder="Название">
        <input v-model="editingProject.code" placeholder="Код">
        <label for="">
            <input type="checkbox" v-model="editingProject.isActive">
        </label>
        <button @click="updateProject()">Сохранить</button>
        <button @click="editingProject = null">Отменить</button>



    </div>
</div>

</template>
<style>
li{
    list-style-type: none;
    margin-right: 20px;
}
ul
{
    display: flex;

}
</style>