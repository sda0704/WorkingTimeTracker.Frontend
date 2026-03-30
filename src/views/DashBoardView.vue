<script setup>

    import {ref, computed} from 'vue';

       const daysInMonth = (month, year) => {
        return new Date(year, month + 1, 0).getDate();
    }

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
    const currentYear = ref(2026);
    const currentMonth = ref(2);
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

<div class="dashboard">
    <div class="calendar-header">
        <button @click="prevMonth">◀</button>
        <h2>{{ currentMonthName }} {{ currentYear }}</h2>
        <button @click="nextMonth">▶</button>
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
</div>
</template>


<style>

.hours-number{
    font-size: 20px;

}
.dashboard {
    padding: 30px;
    justify-content: center;
    
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
    padding: 10px;
    background: #f0f0f0;
}

.calendar-cell {
    aspect-ratio: 1;
    display: flex;
    flex-direction: column;
    width: 100px;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    font-size: 35px;
    cursor: pointer;
}

.yellow { background: #fff3cd; }
.green { background: #d4edda; }
.red { background: #f8d7da; }
.gray { background: #e9ecef; }

</style>