<script setup> 


import {ref} from 'vue';


    const errorMessage = ref('');
    const showModal = ref(false);
    const modalMode = ref('create');
    const formData = ref({
        date: '',
        taskId: '',
        description: '',
        hours: ''
    });
    const editingId = ref(null);

    const openCreateModal =() => {
        modalMode.value = 'create';
        formData.value = {  date: '',
        taskId: '',
        description: '',
        hours: ''}
        editingId.value = null;
        showModal.value = true;
    }

    const openEditModal = (timeEntry) => {
        modalMode.value = 'edit';
        formData.value = {...timeEntry};
        editingId.value = timeEntry.id;
        showModal.value = true;
    }


    const isTaskDropdownOpen = ref(false);
    const selectedTaskName = ref('Выберите задачу');

    const selectTask = (task) => {
        formData.value.taskId = task.id;
        selectedTaskName.value = task.title;
        isTaskDropdownOpen.value = false
    }

    const editingTimeEntry = ref(null);
    const tasks = ref([]);
    const projects = ref([]);

    const saveTimeEntry = async () => {


        const dataToSend = {
            ...formData.value,
            hours: parseFloat(formData.value.hours)
        }

        if (modalMode.value === 'create'){
            await createTimeEntry(dataToSend);
        } else{
            await updateTimeEntry(editingId.value,  dataToSend);
        }
        showModal.value = false;
        
       
    }

    let pageTitle = ref("Проводки");
    const timeEntries = ref([]);

    const selectedDate = ref(new Date().toISOString().split('T')[0]);
    const dailySummary = ref(null);

    const loadTasks = async () => {
        const response = await fetch("https://localhost:7222/api/tasks");
        tasks.value = await response.json()
        }
    loadTasks();
    const loadProjects = async () => {
        const response = await fetch("https://localhost:7222/api/project");
        projects.value = await response.json();
    }
    loadProjects();

    const getTaskTitle =  (taskId) => {
        const task = tasks.value.find(t => t.id === taskId);
        return task ? task.title: 'Неизвестная задача';
    }
    const getProjectTitle =  (projectId) => {
        const project = projects.value.find(p => p.id === projectId);

        return project ? project.title: "Неизвестный проект";
    }

    const getTaskProjectId = (taskId) => {
        const task = tasks.value.find(t => t.id === taskId);
        return taskId ? task.projectId : null;
    };


        const loadTimeEntry = async () => {
        try{
            const response = await fetch("https://localhost:7222/api/timeentry");
            if(!response.ok){throw new Error(`HTTP ${response.status}`)};
            let data = await response.json();
            timeEntries.value = data;
        }
        catch(error){
            console.log("Ошибка:", error.message);
        }

    }
    loadTimeEntry();

    const loadDailySummary = async() => {
        try {
            const response = await fetch(`https://localhost:7222/api/timeentry/summary/daily?date=${selectedDate.value}`)
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            dailySummary.value = await response.json();
        }
        catch(error){
             console.log("Ошибка загрузки статистики:", error.message);
        dailySummary.value = null;
        }
    }

    loadDailySummary();

    const newTimeEntry = ref({
        taskId: '',
        date: '',
        hours: '',
        description: ''
    })
    const createTimeEntry = async (data)=>{
        try{
            const response = await fetch("https://localhost:7222/api/timeentry", {
                method: 'POST',
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify(data)
            })
         if(!response.ok){throw new Error(`HTTP ${response.status}`)};
         const createdTimeEntry = await response.json();
        
        
         timeEntries.value.push(createdTimeEntry);
         await loadDailySummary();

       
         console.log("Проводка создана");
        
        }
        
        catch(error){
            console.log("Ошибка", error.message);
        }
    }

    const startEdit =  (timeEntry) => {
        editingTimeEntry.value = {...timeEntry}
    }

    const updateTimeEntry = async(id, data) => {
        try{
            const response = await fetch(`https://localhost:7222/api/timeentry/${id}`,{
                method: 'PUT',
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify(data)
            });
             if(!response.ok){throw new Error(`HTTP ${response.status}`)};
             const index = timeEntries.value.findIndex(p => p.id === id);
             if(index !== -1){
                timeEntries.value[index] = {...data, id}
             }       
             console.log("Проводка обновлена");
             await loadDailySummary();

        }
        catch(error){
            console.log("Ошибка", error.message);
        }
    }
    const deleteTimeEntry = async (id) => {
        try{
            const response = await fetch(`https://localhost:7222/api/timeentry/${id}`, {
                method: 'DELETE'
            });
              if(!response.ok){throw new Error(`HTTP ${response.status}`)};
                timeEntries.value = timeEntries.value.filter(p => p.id !== id);
                console.log("Проводка удалена")
                await loadDailySummary();
        }
        catch(error){
            console.log("Ошибка", error.message);
        }
    }

    const getTodaysDate = () => {
        let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    today = mm + '.' + dd + '.' + yyyy;
        return (today);
    }


    const currentFilter = ref('all');
    const filterDate = ref(new Date().toISOString().split('T')[0]);


    const loadTimeEntriesWithFilter = async () => {
        try{
            let url = "https://localhost:7222/api/timeentry";

            if(currentFilter.value === 'day' && filterDate.value){
                url = `https://localhost:7222/api/timeentry?date=${filterDate.value}`;
            } else if (currentFilter.value === 'month' && filterDate.value){
                const monthStr = filterDate.value.slice(0, 7);
                url =  `https://localhost:7222/api/timeentry?month=${monthStr}-01`;
            }

            const response = await fetch(url);
            if(!response.ok) throw new Error(`Http ${response.status}`);
            timeEntries.value = await response.json();
        }catch(error){
            console.log("Ошибка загрузки:", error);
        }
    }

    const setFilterAll = () => {
        currentFilter.value = 'all';
        loadTimeEntriesWithFilter();
    }
    const setFilterDay = () => {
        currentFilter.value = 'day';
        filterDate.value = new Date().toISOString().split('T')[0];
        loadTimeEntriesWithFilter();
    }
    const setFilterMonth = () => {
        currentFilter.value = 'month';
        filterDate.value = new Date().toISOString().split('T')[0];
        loadTimeEntriesWithFilter();
    }


</script>

<template>
<div>
    
    
    <div class="page-title">
     <h1>{{ pageTitle }}</h1>
    <button class="title-button" @click="openCreateModal">+ Добавить проводку</button>
    
    </div>

    <div class="timeEntry-list">
        <p class="table-title"> Список проводок</p>
    

    <div class="filter">

        <button class="filter-button" @click="setFilterAll()">Все время</button>
        <button class="filter-button" @click="setFilterDay()">За день</button>
        <button class="filter-button" @click="setFilterMonth()">За месяц</button>
    </div>

    <div class="timeEntry-table">
        <p class="timeEntry-table-text">Дата</p>
        <p class="timeEntry-table-text">Задача</p>
        <p class="timeEntry-table-text">Проект</p>
        <p class="timeEntry-table-text">Описание</p>
        <p class="timeEntry-table-text">Часы</p>
        <p class="timeEntry-table-text">Действия</p>
    </div>

    <div v-for="timeEntry in timeEntries" :key="timeEntry.id" class="timeEntry-items">
        <p class="timeEntry-text"> {{ timeEntry.date?.split('T')[0] || '' }}</p>
        <p class="timeEntry-text"> {{ getTaskTitle(timeEntry.taskId) }}</p>
       
        <p class="timeEntry-text">{{getProjectTitle(getTaskProjectId(timeEntry.taskId)) }}</p>
        <p class="timeEntry-text"> {{ timeEntry.description }}</p>
        <p class="timeEntry-text"> {{ timeEntry.hours }}</p>
        <button class="timeEntry-button" @click="openEditModal(timeEntry)">🛠️</button>
         <button class="timeEntry-button" @click="deleteTimeEntry(timeEntry.id)">🗑️</button>
       

    </div>

    </div>


    <!-- Модалка -->

    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">

        <div class="modal">

            <h3 class="modal-title">{{ modalMode === 'create' ? 'Создать проводку' : 'Редактировать проводку' }}</h3>
            <div v-if="errorMessage"> {{errorMessage  }}</div>
            <input class="modal-date" type="date" v-model="formData.date">

             
                <div class="custom-select">
                   
                    <button type="button" class="select-button" @click="isTaskDropdownOpen = !isTaskDropdownOpen">
                    {{ selectedTaskName }}
                    <span class="arrow">🢃</span>    
                    </button>
                    <div v-if="isTaskDropdownOpen" class="dropdown-list">
                        <div v-for="task in tasks" :key = "task.id" class="dropdown-item" @click="selectTask(task)">

                            {{ task.title }}
                        </div>
                    </div>
                </div>
           
             
             <input v-model="formData.hours" type="text" name="" id="" class="modal-input" placeholder="Кол-во часов">
             <p class="modal-text">Уже спиcано за {{ getTodaysDate() }}: {{ dailySummary.totalHours }} часов</p>

             <input type="text" v-model="formData.description" class="modal-input" placeholder="Описание">
            
             <div class="modal-buttons">
            <button @click="showModal = false" class="modal-button">Отменить</button>
            <button @click="saveTimeEntry()" class="modal-button">Сохранить</button>
        </div>

        </div>

    </div>

</div>
</template>



<style scoped>

.errorMessage{
    background-color: #f8d7da;
    color: #721c24;
    padding: 10px;
    border-radius: 8px;
    margin: 10px 15px ;
    border: 1px solid #f5c6cb;
    font-size: 14px;
}

@font-face{
    font-family: "Comfortaa";
    src: local("Comfortaa-Regular"),
    url(/workingtime-frontend/src/fonts/Comfortaa/Comfortaa-Regular.ttf) format("ttf");
    font-weight: normal;
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
    max-height: 450px;
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

.modal-date{
    width: 90%;
    font-size: 15px;
    margin-left: 10px;
      font-family: "Comfortaa", sans-serif;
    padding-left: 20px;
    
    height: 9%;
    border-radius: 15px;
    border: 2px solid rgb(233, 233, 233);
    background-color: rgb(235, 235, 235);
    margin-bottom: 20px;
}

input[type="date"]::-webkit-calendar-picker-indicator,
input[type="date"]::-webkit-inner-spin-button,
input[type="date"]::-webkit-outer-spin-button {
    /* Подумать как переделать!!! */
    padding-right: 75%;
    
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
    font-size: 25px;
    font-weight: bold;
      font-family: "Comfortaa", sans-serif;
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

.modal-text{
    font-size: 18px;
      font-family: "Comfortaa", sans-serif;
    margin-left: 15px;
}


/* filter */

.filter-button{
    height: 30px;
      font-family: "Comfortaa", sans-serif;
    width: 90px;
    font-weight: bold;
    border: 0;
    cursor: pointer;
    margin-bottom: 15px;
     transition: background-color 0.3s;
}
.filter-button:hover{
    background-color: lightgray;
}
.filter-button:first-child{
    margin-left: 30px;
    border-top-left-radius: 15px;
    border-bottom-left-radius: 15px;
}
.filter-button:last-child{
    border-top-right-radius: 15px;
    border-bottom-right-radius: 15px;
}

.title-button{

    font-size: 19px;
      font-family: "Comfortaa", sans-serif;
}

.timeEntry-list{
    border: 2px solid lightgray;
    max-width: 1500px;
    margin-left: 30px;
    border-radius: 15px;
    background-color: white;
}

.timeEntry-table{
    display: grid;
    grid-template-columns: 150px 300px 400px 350px 200px 200px;
    border-bottom: 1px solid lightgray;
}
.timeEntry-table-text:first-child{
    margin-left: 30px;
}


.timeEntry-text:first-child{
    margin-left: 30px;
}
.timeEntry-items{
    display: grid;
    grid-template-columns: 150px 300px 400px 350px 200px 30px 30px;
    border-bottom: 1px solid rgb(228, 228, 228);
}
.timeEntry-button{
  width: 40px;
    height: 40px;
    background-color: transparent;
    border-radius: 10px;
    border: 0;
    cursor: pointer;
    text-align: center;
     transition: background-color 0.3s;
}
.timeEntry-button:hover{
     background-color: lightgray;
}
.timeEntry-button:last-child{
    margin-left: 10px;
}

</style>