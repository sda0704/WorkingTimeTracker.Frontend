<script setup>

    import {ref, computed} from 'vue';

       const daysInMonth = (month, year) => {
        return new Date(year, month + 1, 0).getDate();
    }

    const projects = ref([]);
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
    const totalMonthHours = ref(0);
    const avgHoursPerDay = ref(0);
  
    const activeProjectsCount = computed(() => {
        return projects.value.filter(p => p.isActive).length;
    })

    const prevMonth = () => {
        if(currentMonth.value === 0){
            currentMonth.value = 11;
            currentYear.value--;
        }else{
            currentMonth.value--;
        }
        buildCalendar(currentYear.value, currentMonth.value);
    }
    const nextMonth = () => {
        if(currentMonth.value === 11){
            currentMonth.value = 0;
            currentYear.value++;
        } else{
            currentMonth.value++;
        }
         buildCalendar(currentYear.value, currentMonth.value);
    }

    const getFirstDayOfMonth = (month, year) => {

        const day =  new Date(year, month, 1).getDay();
        return day === 0 ? 6 : day - 1;
    }

    const getCalendarTable = (month, year) => {
        let calendar = [];
        let firstDayShift =getFirstDayOfMonth(month, year);
        for(let i = 0; i < firstDayShift; i++){
            calendar.push(null);
        }
        let daysCount = daysInMonth(month, year);
        for(let i = 1; i <= daysCount; i++){
            calendar.push(i);
        }
        while(calendar.length < 42){
            calendar.push(null);
        }
        return calendar;
    }
    const now = new Date();
    const currentYear = ref(now.getFullYear());
    const currentMonth = ref(now.getMonth());
    const calendarCells = ref([]);
    const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 
                     'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

    const currentMonthName = computed(() => monthNames[currentMonth.value]);
    const loadMonthData = async (year, month) => {
        let dateString = `${year}-${String(month+1).padStart(2, '0')}-01`
        const response = await fetch(`https://localhost:7222/api/timeentry?month=${dateString}`);
        if(!response.ok) {throw new Error(`Http: ${response.status}`)};
        let data = await response.json();
        return data;

    }

    const getHoursByDay =  (entries) => {
        let hoursMap = {};
        entries.forEach(element => {
            let day = new Date(element.date).getDate();
            let hours = element.hours;
            if(!hoursMap[day]){
                hoursMap[day] = 0;
            }
            hoursMap[day] +=hours;
        });
        return hoursMap
    }

    


    const getColorForHours = (hours) =>{
        if(hours == 0) return 'gray';
        if(hours < 8) return 'yellow';
        if(hours === 8) return 'green';
        return 'red';
    }
    const buildCalendar = async (year, month) => {
        const entries = await loadMonthData(year,month);

        const hoursMap = getHoursByDay(entries);

        let sum = 0;
        let daysWithHours = 0;
        for(let day in hoursMap){
            sum += hoursMap[day];
            daysWithHours++;
        }
        totalMonthHours.value = sum;
        avgHoursPerDay.value = daysWithHours > 0 ? (sum / daysWithHours).toFixed(1) : 0;

        const rawCalendar = getCalendarTable(month, year);

        const cells = rawCalendar.map(day => {
            if(day === null){
                return {day: null, color: 'gray'};
            }
            const hours = hoursMap[day] || 0;
            const color = getColorForHours(hours);
            return {day, color, hours};
        });
        calendarCells.value = cells;
    }
    buildCalendar(currentYear.value, currentMonth.value);

    

</script>

<template>
    <div>
        <h1>Дашборд</h1>
        <div class="stats-wrapper">

    <div class="stats-by-month">
        <p class="stats-title">Всего часов за месяц</p>
        <p class="stats-text">{{ totalMonthHours }}</p>
    </div>
    <div class="avg-by-month">
        <p class="stats-title">Среднее часов в день</p>
        <p class="stats-text">{{ avgHoursPerDay }}</p>
    </div>
    <div class="active-projects">
        <p class="stats-title">Активных проектов</p>
        <p class="stats-text">{{ activeProjectsCount }}</p>
    </div>

</div>
<div class="page-container">





<div class="dashboard">
    <h3>Календарь учета времени</h3>
    <div class="calendar-header">
        <button class="month-button" @click="prevMonth">◀</button>
        <h2>{{ currentMonthName }} {{ currentYear }}</h2>
        <button class="month-button" @click="nextMonth">▶</button>
    </div>
    
    <div class="calendar-grid">
        <div class="weekday">Пн</div>
        <div class="weekday">Вт</div>
        <div class="weekday">Ср</div>
        <div class="weekday">Чт</div>
        <div class="weekday">Пт</div>
        <div class="weekday">Сб</div>
        <div class="weekday">Вс</div>
        
        <div v-for="(cell, index) in calendarCells" :key="index" 
             :class="['calendar-cell', cell.color]">
            {{ cell.day || '' }}
            <div v-if="cell.hours > 0" class="hours-number"> {{ cell.hours }} ч.</div>
        </div>
        </div>
       <div class="tips-container">
        <div class="tip-item">
          <div class="tip-yellow"></div>
          <p>&lt; 8 часов</p>
        </div>
        <div class="tip-item">
          <div class="tip-green"></div>
          <p>8 часов</p>
        </div>
        <div class="tip-item">
          <div class="tip-red"></div>
          <p>&gt; 8 часов</p>
        </div>
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

.stats-title{
    font-family: "Comfortaa", sans-serif;
    font-size: 20px;
    margin-left: 20px;
}
.stats-text{
     font-family: "Comfortaa", sans-serif;
    font-size: 24px;
    font-weight: bold;
    margin-left: 20px;
}

.stats-wrapper{
    display: flex;
    justify-content: center;
    
    }

.stats-by-month{
    
    width: 400px;
   height: 150px;
    border-radius: 15px;
    border: 2px solid rgb(190, 190, 190);
    background-color: white;
    
}
.avg-by-month{
 width: 400px;
   height: 150px;
   margin-left: 20px;
    border-radius: 15px;
        border: 2px solid rgb(190, 190, 190);
          background-color: white;
}
.active-projects{
 width: 400px;
  height: 150px;
      border: 2px solid rgb(190, 190, 190);
      border-radius: 15px;
    margin-left: 20px;
      background-color: white;
}



.tips-container {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid lightgray;
}

.tip-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tip-item p {
  margin: 0;
  font-size: 14px;
    font-family: "Comfortaa", sans-serif;
  color: #666;
}

.tip-yellow {
  width: 25px;
  height: 25px;
  background: #fff3cd;
  border-radius: 4px;
  border: 1px solid #ffeaa7;
}

.tip-red {
  width: 25px;
  height: 25px;
  background: #f8d7da;
  border-radius: 4px;
  border: 1px solid #f5c6cb;
}

.tip-green {
  width: 25px;
  height: 25px;
  background: #d4edda;
  border-radius: 4px;
  border: 1px solid #c3e6cb;
}


.month-button{
    border: 1px solid lightgray;
    background-color: white;
    border-radius: 15px;
    height: 40px;
    width: 60px;
     transition: background-color 0.3s;
}
.month-button:hover{
    background:  rgb(246, 138, 138);
}

.page-container{
    display: flex;
}

.hours-number{
    font-size: 20px;
      font-family: "Comfortaa", sans-serif;

}
.dashboard {
    border: 1px solid lightgray;
    padding: 50px 100px;
    margin-top: 50px;
    border-radius: 15px;
    margin-left: 30px;
    
    background-color: white;
    

}


.calendar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.calendar-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 5px;
        
    
}

.weekday {
    text-align: center;
    font-weight: bold;
      font-family: "Comfortaa", sans-serif;
    padding: 10px;
    background: #f0f0f0;
    border-radius: 15px;
}

.calendar-cell {
     font-family: "Comfortaa", sans-serif;
    height: 100px;
    width: 180px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    font-size: 24px;
    cursor: pointer;

}

.yellow { background: #fff3cd; }
.green { background: #d4edda; }
.red { background: #f8d7da; }
.gray { border: 1px solid lightgray; }

</style>