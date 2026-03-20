<script setup>
import {ref } from 'vue';



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


    const response = await fetch("http://localhost:5268/api/project");
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
            
            const response = await fetch("http://localhost:5268/api/project", {
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
        const response = await fetch(`http://localhost:5268/api/project/${id}`, {
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


<div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
    <div class="modal">
        <h2>{{ modalMode === 'create' ? 'Создать проект' : 'Редактировать проект' }}</h2>

        <input v-model="formData.title" placeholder="Название">
        <input v-model="formData.code" placeholder="Код">
        <label for="" class="switch">
            <input type="checkbox"  v-model="formData.isActive"  name="" id="">Активен
            <span class="slider round"></span>
        </label>
        <div class="modal-buttons">
            <button @click="saveProject()">Сохранить</button>
            <button @click="showModal = false">Отменить</button>
        </div>
    </div>
</div>

</div>

</template>
<style>




.modal{
    position: fixed;       
    top: 25%;
    left:39%;   
    background-color: white;
    border-radius: 8px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    max-width: 500px;
    max-height: 300px;
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
.page-title{
    display: flex;
    align-items: center;
}

.title-btn{
    margin-left: 1170px;
    width: 200px;
    background-color: black;
    border: 0;
    color: white;
    font-size: 20px;
    border-radius: 10px;
    height: 40px;

}

.table{
    display: grid;
    grid-template-columns:800px 300px 300px 300px;
    border-bottom: 1px solid lightgray;

}
.projects-items:last-child{
    margin-bottom: 30px;
}
.table-title{
    margin-left: 30px;
    font-size: 20px;
    font-weight: bold;
}
.projects-items{
      display: grid;
    grid-template-columns:800px 300px 300px 30px 30px;
    border-bottom: 1px solid #f5f5f5;
}
.project-text:first-child{
    margin-left: 30px;
}
.table-text:first-child{
    margin-left: 30px;
}
h1{
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
    width:1500px;
    margin-left: 30px;
    border-radius: 20px;
   height: 100%;
}


</style>