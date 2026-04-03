<script setup>



import {ref} from 'vue';


const errorMessage = ref('');

const showModal = ref(false);
const modalMode = ref('create');
const formData = ref({
    title: '',
    isActive: true, 
    projectId: ''
});

const editingId = ref(null);


const openCreateModal = () => {
    errorMessage.value = '';
    modalMode.value = 'create';
    formData.value = {title: '', isActive: true, projectId: ''};
    editingId.value = null;
    showModal.value = true;
}

const openEditModal = (task) => {
    errorMessage.value = '';
    modalMode.value = 'edit';
    formData.value = {...task};
    editingId.value = task.id;
    showModal.value = true;
}

const saveTask = async () => {

    if(!formData.value.title){
        errorMessage.value = "Название не может быть пустым";
        return;
    }
    if(!formData.value.projectId){
        errorMessage.value = "Выберите проект";
        return;
    }

    if(modalMode.value === 'create'){
        await createTask(formData.value);
    }
    else{
        await updateTask(editingId.value, formData.value)
    }
    showModal.value = false;
}

  const isProjectDropdownOpen = ref(false);
    const selectedProjectName = ref('Выберите проект');

    const selectProject = (project) => {
        formData.value.projectId = project.id;
       selectedProjectName.value = project.title;
        isProjectDropdownOpen.value = false
    }

let pageTitle = ref("Задачи");
let tasks = ref([]);

const loadTasks = async () => {
    try{
        const response = await fetch("https://localhost:7222/api/tasks");
        if(!response.ok) {throw new Error(`HTTP ${response.status}`)};
        let data = await response.json();
        tasks.value = data
    }
    catch(error){
        console.log("Ошибка:", error.message);
    }
}
loadTasks();



const createTask = async(data) => {
    try{
        const response = await fetch("https://localhost:7222/api/tasks",{
            method: 'POST',
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(data)
        });
        if(!response.ok) {
            let errorText = await response.text();
            try{
                const errorJson = await JSON.parse(errorText);
                errorText = errorJson.message || errorText;
            }catch(e){

            }
            throw new Error(errorText);
        }
        const createdTask = await response.json();
        tasks.value.push(createdTask);
        
    }
    catch(error){
      throw error;  
    }
};

const GetActiveStatus = (isActive) => {
    return isActive ? "Активна" : "Неактивна"
}


const updateTask = async (id, data) => {
    try{
        const response = await fetch(`https://localhost:7222/api/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if(!response.ok) {throw new Error(`HTTP ${response.status}`)}
        const index = tasks.value.findIndex(p => p.id === id);
        if (index !== -1){
            tasks.value[index] = {...data, id};
        }
        console.log("Задача обновлена");
    }
    catch(error){
        console.log("Ошибка:", error.message);
    }
}

const deleteTask = async(id) => {
    try{
        const response = await fetch(`https://localhost:7222/api/tasks/${id}`,{
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


    const response = await fetch("https://localhost:7222/api/project");
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
 
        <div class="page-title">
        <h1 >{{ pageTitle }}</h1>
        <button @click="openCreateModal" class="title-button">+ Добавить задачу</button>
        </div>
    <div class="tasks-list">

        <h2 class="tasks-table-title">Список задач</h2>

        <div class="tasks-table">
            <p class="tasks-text">Название</p>
            <p class="tasks-text">Проект</p>
            <p class="tasks-text">Статус</p>
            <p class="tasks-text">Действия</p>
        </div>

        <div v-for="task in tasks" :key="task.id" class="tasks-items">

           <p class="tasks-text">{{ task.title }}</p> 
           <p class="tasks-text">{{ getProjectTitle(task.projectId) }}</p>
           <p class="tasks-text">{{ GetActiveStatus(task.isActive) }}</p>
           <button @click="openEditModal(task)" class="tasks-button">🛠️</button>
           <button class="tasks-button" @click="deleteTask(task.id)">🗑️</button>

        </div>
        

    </div>

    <!-- Модалка -->

    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
    <div class="modal">
        <h3 class="modal-title">{{ modalMode === 'create' ? 'Создать задачу' : 'Редактировать задачу' }}</h3>

        <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>

        <input v-model="formData.title" placeholder="Название задачи" class="modal-input">
       
                 <div class="custom-select">
                   
                    <button type="button" class="select-button" @click="isProjectDropdownOpen = !isProjectDropdownOpen">
                    {{ selectedProjectName }}
                    <span class="arrow">🢃</span>    
                    </button>
                    <div v-if="isProjectDropdownOpen" class="dropdown-list">
                        <div v-for="project in projects" :key = "project.id" class="dropdown-item" @click="selectProject(project)">

                            {{ project.title }}
                        </div>
                    </div>
                </div>
    <label class="switch">
        <input class="checkbox" type="checkbox" v-model="formData.isActive">
        <span class="slider"></span>
        
    </label>
        <div class="modal-buttons">
            <button @click="showModal = false" class="modal-button">Отменить</button>
            <button @click="saveTask()" class="modal-button">Сохранить</button>
        </div>
    </div>
</div>


</div>

</template>

<style>


@font-face{
    font-family: "Comfortaa";
    src: local("Comfortaa-Regular"),
    url(/workingtime-frontend/src/fonts/Comfortaa/Comfortaa-Regular.ttf) format("ttf");
    font-weight: normal;
}


.error-message{
    background-color: #f8d7da;
      font-family: "Comfortaa", sans-serif;
    color: #721c24;
    padding: 10px;
    border-radius: 8px;
    margin: 10px 15px ;
    border: 1px solid #f5c6cb;
    font-size: 14px;
}
/* page-title */


.page-title{
    display: flex;
    align-items: center;
    justify-content: space-between;
}


.title-button{
     
    width: 200px;
    background-color: black;
    border: 0;
    color: white;
    font-size: 20px;
    border-radius: 10px;
    height: 40px;
  font-family: "Comfortaa", sans-serif;
}


/* task-table */
.tasks-table-title{
    margin-left: 30px;
}
.tasks-list{
    background-color: white;    
     border: 2px solid lightgray;
    max-width: 1500px ;
    margin-left: 30px;
    border-radius: 20px;
   height: 100%;
}
.tasks-text:first-child{
    margin-left: 30px;
}
.tasks-table{
    display: grid;
    /* Обязательно протестировать на длинный текст задачи!!! */
    grid-template-columns:  800px  300px  300px 300px;
    border-bottom: 1px solid lightgray;
}

/* tasks-item */

.tasks-items{
    display: grid;
    grid-template-columns: 800px 300px 300px 30px 30px;
    border-bottom: 1px solid rgb(235, 235, 235);
    margin-top: 10px;
}
.tasks-items:last-child{
    margin-bottom: 30px;
}
.tasks-items:first-child{
    margin-left: 30px;
}
.tasks-button{
  width: 40px;
    height: 40px;
    background-color: transparent;
    border-radius: 10px;
    border: 0;
    cursor: pointer;
    text-align: center;
     transition: background-color 0.3s;
}
.tasks-button:hover{
     background-color: lightgray;
}
.tasks-button:last-child{
    margin-left: 10px;
}

/* modal */

.modal{
    position: fixed;       
    top: 25%;
    left:39%;   
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    max-width: 500px;   
     height: auto;
    width: 90%;
    position: relative;
    animation: modalFadeIn 0.3s ease-out;
    }
@keyframes modalFadeIn{
    from{opacity: 0;
    transform: translateY(-10px);
}
to{
    opacity: 1;
    transform: translateY(0);
}

}
.modal-button{
    border: 0;
    width: 90px;
    height: 40px;
    border: 1px solid lightgray;
    background-color: inherit;
    border-radius: 10px;
    font-weight: bold;
      font-family: "Comfortaa", sans-serif;
      transition: background-color 0.3s;

}
.modal-button:hover{
    background-color: lightgray;
}
.modal-button:hover:last-child{
    background-color: #1e1d1d;
}

.modal-button:last-child{
    background-color: black;
    color: white;
}
.modal-buttons{
    display:flex;
   justify-content: flex-end;
   gap: 10px;
    padding: 10px;
}
.modal-title{
    padding-left: 15px;
    padding-top: 20px;

}
.modal-input{
    display: flex;
    height: 40px;
    background-color: rgb(235, 235, 235);
    border-radius: 10px;
    padding-left: 20px;
    margin-bottom: 10px;
    width: 90%;
    border: 0;
    margin-left: 15px;
    outline: 2px solid transparent; 
  transition: outline-color 0.3s ease;
}

.modal-input:focus{
    outline-color:  gray;
}

/* ПОДУМАТЬ НАД СТИЛИЗАЦИЕЙ */
.modal-selector{
     width: 95%;
    height: 40px;
    background-color: lightgray;
    border: 0;
    border-radius: 10px;
    padding-left: 15px;
    margin-bottom: 10px;
    margin-left: 15px;
    outline: 2px solid transparent;
    transition: outline-color 0.3s ease;
    cursor: pointer;
}

.modal-overlay{
  
    position: fixed;
    top: 0;
    left:0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.7);
    z-index: 1000;
    justify-content: center;
    align-items: center;
}

.switch{
    
    position: relative;
    display: inline-block;
    width:50px;
    height: 24px;
    margin-left: 15px;
    margin-bottom: 10px;

} 


.switch input{
    opacity: 0;
    width: 0;
    height: 0;
}

.slider{
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: 0.3s;
    border-radius: 34px;
}

.slider:before{
    position: absolute;
    content: "";
    height:15px;
    width: 15px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: 0.3s;
    border-radius: 50%;
}

input:checked + .slider{
    background-color: rgb(246, 138, 138);

}
input:checked + .slider:before{
    transform: translateX(26px);
}



.custom-select{
    position: relative;
    height: 40px;
    
    background-color: lightgray;
    border-radius: 10px;
    
    margin-bottom: 10px;
    width: 94%;
    border: 0;
    margin-left: 15px;
     outline: 2px solid transparent; 
  transition: outline-color 0.3s ease;
}

.select-button{
    display: flex;
    justify-content: space-between;
    padding: 0 20px;
    align-items: center;
    height: 40px;
    width: 100%;
    background-color: rgb(235, 235, 235);
    border-radius: 10px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border: 0;
    text-align: start;
    font-size: 13px;
      font-family: "Comfortaa", sans-serif;
     outline: 2px solid transparent; 
  transition: outline-color 0.3s ease;
 
}

.arrow{

    margin-left: auto;
}

.dropdown-list{   
    position: absolute;
   background-color: rgb(235, 235, 235);
   border-bottom-left-radius: 15px;
   border-bottom-right-radius: 15px;
    z-index: 10;
    margin-bottom: 10px;
    width: 100%;
    border: 0;
    outline: 2px solid transparent; 
  transition: outline-color 0.3s ease;
}

.dropdown-item{
    margin-left: 30px;
    font-size: 18px;
      font-family: "Comfortaa", sans-serif;
    margin-bottom: 15px;
    cursor: pointer;


}
.dropdown-item:hover{
    background-color: lightgray;
}
.dropdown-item:first-child{
    margin-top: 10px;
}


</style>