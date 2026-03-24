<script setup> 
import {ref} from 'vue';

    const editingTimeEntry = ref(null);
    const tasks = ref([]);
    const projects = ref([]);

    let pageTitle = ref("Учет рабочего времени - Проводки");
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
    const createTimeEntry = async ()=>{
        try{
            const response = await fetch("https://localhost:7222/api/timeentry", {
                method: 'POST',
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify(newTimeEntry.value)
            })
         if(!response.ok){throw new Error(`HTTP ${response.status}`)};
         const createdTimeEntry = await response.json();

         timeEntries.value.push(createdTimeEntry);
         await loadDailySummary();

         newTimeEntry.value = 
         { 
            taskId: '',
            date: '',
            hours: '',
            description: ''
         };
         console.log("Проводка создана");
        
        }
        
        catch(error){
            console.log("Ошибка", error.message);
        }
    }

    const startEdit =  (timeEntry) => {
        editingTimeEntry.value = {...timeEntry}
    }

    const updateTimeEntry = async() => {
        try{
            const response = await fetch(`https://localhost:7222/api/timeentry/${editingTimeEntry.value.id}`,{
                method: 'PUT',
                headers: {
                    'Content-Type': "application/json"
                },
                body: JSON.stringify(editingTimeEntry.value)
            });
             if(!response.ok){throw new Error(`HTTP ${response.status}`)};
             const index = timeEntries.value.findIndex(p => p.id === editingTimeEntry.value.id);
             if(index !== -1){
                timeEntries.value[index] = {...editingTimeEntry.value}
             }
             editingTimeEntry.value = null;
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
</script>

<template>
<div>
    <h1>{{ pageTitle }}</h1>

    <!-- Блок со стикером -->
    <div class="summary-block">
        <h3>Статистика за день</h3>
        <input type="date" v-model="selectedDate" @change="loadDailySummary">
        <div v-if="dailySummary" :class="['sticker', dailySummary.stickerColor]">
            <p class="total-hours">Всего часов: {{ dailySummary.totalHours }}</p>
            <p class="message">{{ dailySummary.message }}</p>
        </div>
        <div v-else class="sticker gray">
            <p>Нет данных за выбранную дату</p>
        </div>
    </div>

    <!-- Список проводок -->
    <h3>Все проводки</h3>
    <ul>
        <li v-for="entry in timeEntries" :key="entry.id">
            {{ entry.date.split('T')[0] }} - 
            {{ getTaskTitle(entry.taskId) }} - 
            {{ entry.hours }}ч - 
            {{ entry.description }}
            <button @click="startEdit(entry)">Редактировать</button>
            <button @click="deleteTimeEntry(entry.id)">Удалить</button>
        </li>
    </ul>

    <!-- Форма создания -->
    <div v-if="!editingTimeEntry">
        <h3>Новая проводка</h3>
        <input type="date" v-model="newTimeEntry.date">
        
        <select v-model="newTimeEntry.taskId">
            <option value="" disabled>Выберите задачу</option>
            <option v-for="task in tasks" :key="task.id" :value="task.id">
                {{ task.title }} ({{ getProjectTitle(task.projectId) }})
            </option>
        </select>
        
        <input type="number" v-model="newTimeEntry.hours" placeholder="Часы" min="0.5" max="24" step="0.5">
        <input v-model="newTimeEntry.description" placeholder="Описание">
        
        <button @click="createTimeEntry">Создать</button>
    </div>

    <!-- Форма редактирования -->
    <div v-else>
        <h3>Редактирование проводки</h3>
        <input type="date" v-model="editingTimeEntry.date">
        
        <select v-model="editingTimeEntry.taskId">
            <option v-for="task in tasks" :key="task.id" :value="task.id">
                {{ task.title }}
            </option>
        </select>
        
        <input type="number" v-model="editingTimeEntry.hours" placeholder="Часы" min="0.5" max="24" step="0.5">
        <input v-model="editingTimeEntry.description" placeholder="Описание">
        
        <button @click="updateTimeEntry">Сохранить</button>
        <button @click="editingTimeEntry = null">Отмена</button>
    </div>
</div>
</template>

<style scoped>
.sticker {
    padding: 15px;
    border-radius: 8px;
    margin: 10px 0;
    font-weight: bold;
    max-width: 300px;
}
.yellow {
    background-color: #fff3cd;
    color: #856404;
    border: 1px solid #ffeeba;
}
.green {
    background-color: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
}
.red {
    background-color: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
}
.gray {
    background-color: #e9ecef;
    color: #495057;
    border: 1px solid #ced4da;
}
.summary-block {
    margin-bottom: 30px;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 8px;
}
ul {
    list-style: none;
    padding: 0;
}
li {
    padding: 10px;
    margin: 5px 0;
    background: white;
    border: 1px solid #dee2e6;
    border-radius: 4px;
}
button {
    margin-left: 10px;
    padding: 5px 10px;
    cursor: pointer;
}
input, select {
    margin: 5px;
    padding: 5px;
}
</style>