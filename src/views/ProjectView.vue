<script setup>
import {ref } from 'vue';



const ErrorMessage = ref('');

const showModal = ref(false);
const modalMode = ref('create');
const formData = ref({
    title: '',
    code: '',
    isActive: true
});
const editingId = ref(null)
  


const openCreateModal = () => {
    modalMode.value = 'create';
    formData.value = {title: '', code: '', isActive: true};
    editingId.value = null;
    showModal.value = true;
}

const openEditModal = (project) => {
    modalMode.value = 'edit';
    formData.value = {...project}
    editingId.value = project.id;
    showModal.value = true;

}

const saveProject = async () => {
    if(modalMode.value === 'create'){
        await createProjects(formData.value);
    } else{
        await updateProject(editingId.value, formData.value)
    }
    showModal.value = false;
}
    
    let pageTitle = ref("Проекты");
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
 
    const createProjects = async (data) => {
        try{
            
            const response = await fetch("https://localhost:7222/api/project", {
                method: 'POST',
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify(data)
            });
            if(!response.ok){throw new Error(`HTTP ${response.status}`)};
            const createdProject = await response.json();

            projects.value.push(createdProject);

          
            console.log("Проект создан");

        }
        catch(error){
            console.log("Ошибка:", error.message)
        }
    }


    
    const GetActiveStatus = (isActive) => {
            return isActive ? "Активен" : "Неактивен";
    }

    const updateProject = async(id, data) => {
        
        try{  
        const response = await fetch(`https://localhost:7222/api/project/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify(data)
            });
              if(!response.ok){throw new Error(`HTTP ${response.status}`)};
              const index = projects.value.findIndex(p => p.id ===id);
              if(index !== -1){
                projects.value[index] = {...data, id};
              }
             
              console.log("Проект обновлен!");
            }
            catch(error){
                console.log("Ошибка:", error.message);
            }
    }
    const deleteProjects = async (id) => {
        try{
            const response = await fetch(`https://localhost:7222/api/project/${id}`,{
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
    <div class="page-title">
    <h1>{{ pageTitle }}</h1>
    <button class="title-btn" @click="openCreateModal">+ Создать проект</button>
    </div>

    
    <div class="projects-list">
        <p class="table-title">Список проектов</p>
        
        <div class="table">
            <p class="table-text">Название</p>
            <p class="table-text">Код</p>
            <p class="table-text">Статус</p>
            <p class="table-text">Действия</p>
        </div>

        <div v-for="project in projects" :key="project.id" class="projects-items">
            <p class="project-text">{{ project.title }}</p>
            <p  class="project-text"> {{ project.code }}</p>
            <p class="project-text"> {{ GetActiveStatus(project.isActive) }}</p>
              <button  class="projects-btn" @click="openEditModal(project)">🛠️</button>
           <button class="projects-btn"  @click ="deleteProjects(project.id)">🗑️</button>
           
        </div>
   
    </div>

<!-- Модалка -->

<div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
    <div class="modal">
        <h3 class="modal-title">{{ modalMode === 'create' ? 'Создать проект' : 'Редактировать проект' }}</h3>

        <input v-model="formData.title" placeholder="Название" class="modal-input">
        <input v-model="formData.code" placeholder="Код" class="modal-input">
    <label class="switch">
        <input class="checkbox" type="checkbox" v-model="formData.isActive">
        <span class="slider"></span>
        
    </label>
        <div class="modal-buttons">
            <button @click="showModal = false" class="modal-button">Отменить</button>
            <button @click="saveProject()" class="modal-button">Сохранить</button>
        </div>
    </div>
</div>

</div>

</template>
<style>

@font-face{
    font-family: "Comfortaa";
    src: local("Comfortaa-Regular"),
    url(/src/fonts/Comfortaa/Comfortaa-Regular.ttf) format("ttf");
    font-weight: normal;
}



.modal{
    position: fixed;       
    top: 25%;
    left:39%;   
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    max-width: 500px;
    max-height: 270px;
    height: 100%;
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
    font-family: "Comfortaa", sans-serif;
    font-weight: bold;
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
    
    background-color: lightgray;
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

.page-title{
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.title-btn{
   
    width: 200px;
    background-color: black;
    border: 0;
      font-family: "Comfortaa", sans-serif;
    color: white;
    font-size: 20px;
    border-radius: 10px;
    height: 40px;

}

.table{
    display: grid;
  
    grid-template-columns:  800px  300px  300px 300px;
    border-bottom: 1px solid lightgray;

}
.projects-items:last-child{
    margin-bottom: 30px;
}
.table-title{
    margin-left: 30px;
    font-size: 20px;
    font-family: "Comfortaa", sans-serif;
    font-weight: bold;
}
.projects-items{
      display: grid;
      margin-top: 10px;
        font-family: "Comfortaa", sans-serif;
    grid-template-columns:800px  300px  300px  30px 30px;
    border-bottom: 1px solid #f5f5f5;
}
.project-text:first-child{
    margin-left: 30px;
}
.table-text{
    font-family: "Comfortaa", sans-serif;
}
.table-text:first-child{
    margin-left: 30px;
}


h1{
    font-family: "Comfortaa", sans-serif;
    margin-left: 30px;
}
.projects-btn{
    width: 40px;
    height: 40px;
    background-color: transparent;
    border-radius: 10px;
    border: 0;
    cursor: pointer;
    text-align: center;
     transition: background-color 0.3s;
}
.projects-btn:hover{
    background-color: lightgray;
}
.projects-btn:last-child{
    margin-left: 10px;
}

.projects-list{
    border: 2px solid lightgray;
    background-color: white;
    max-width: 1500px ;
    margin-left: 30px;
    border-radius: 20px;
   height: 100%;
}


</style>