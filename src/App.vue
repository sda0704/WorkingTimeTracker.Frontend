<script setup lang="ts">


   import {ref, onMounted, computed} from 'vue';
import { useRoute, RouterView } from 'vue-router';


   const isDarkMode = ref(false);
    const isAsideHidden = ref(false);

   const MoscowTime = ref('');
   const MoscowDate = ref('');

   const route = useRoute();
    const isStartPage = computed(() => route.path === '/')


   const dashboardIcon = computed(() => {
        return isDarkMode.value ? "/images/dashboard-dark.svg": "/images/dashboard.svg" ;
   });
   const projectsIcon = computed(() => {
        return isDarkMode.value ? "/images/projects-dark.svg" : "/images/projects.svg";
   });
   const tasksIcon = computed (() => {
        return isDarkMode.value ? "/images/tasks-dark.svg" : "/images/tasks.svg";
   });
   const timeentryIcon = computed (() => {
        return isDarkMode.value ? "/images/time-dark.svg" : "/images/time.svg";
   });
   
    const headerLogoIcon = computed(() => {
        return isDarkMode.value ? "/images/clock_dark.svg" : "/images/clock.svg";
    });
   
    const getMoscowTime = () => {
    const now = new Date();

    const moscowTime = new Date(now.toLocaleString('en-US', {timeZone: 'Europe/Moscow'}));
    const hours = String(moscowTime.getHours()).padStart(2, '0');
    const minutes = String(moscowTime.getMinutes()).padStart(2,'0');
    const seconds = String(moscowTime.getSeconds()).padStart(2, '0');
    MoscowTime.value = `${hours}:${minutes}:${seconds}`

     

    }
     
    const getMoscowDate = () => {
      const now = new Date();
      
       const moscowTime = new Date(now.toLocaleString('en-US', {timeZone: 'Europe/Moscow'}));
       const days = String(moscowTime.getDate()).padStart(2, '0');
       const month = String(moscowTime.getMonth() + 1).padStart(2, '0');
       const years = String(moscowTime.getFullYear());

       MoscowDate.value = `${days}.${month}.${years}`;

      
    }


const toggleAside = () => {
    isAsideHidden.value = !isAsideHidden.value;
    if (isAsideHidden.value) {
        document.body.classList.add('aside-hidden');
    } else {
        document.body.classList.remove('aside-hidden');
    }
    localStorage.setItem('asideHidden', String(isAsideHidden.value));
};



   const toggleDarkMode = () => {
    
   
    if(isDarkMode.value){
        document.body.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }else{
        document.body.classList.remove('dark');
        localStorage.setItem('theme','light');
    }
   }
    onMounted(() => {
          const savedAsideState = localStorage.getItem('asideHidden');
    if (savedAsideState === 'true') {
        isAsideHidden.value = true;
        document.body.classList.add('aside-hidden');
    }
        const savedTheme = localStorage.getItem('theme');
        if(savedTheme==='dark'){
            isDarkMode.value = true;
            document.body.classList.add('dark');
        }else{
            isDarkMode.value = false;
            document.body.classList.remove('dark');
        }
          UpdateDateTime();
        setInterval(UpdateDateTime, 1000)
    });
   

    
    const UpdateDateTime = () => {
        getMoscowDate();
        getMoscowTime();
    };

   

</script>



<template>

<div class="app-root">
   <div class="header">
<button class="toggle-aside" @click="toggleAside()"  >{{ isAsideHidden ? '☰' : '✖' }}</button>
<img :src="headerLogoIcon" alt="не работает" class="header-logo">
<p class="header-text">Учет рабочего времени</p>

<p class="dateTime">{{ MoscowTime}}  {{ MoscowDate }}</p>

    </div>
    <div class="main-part">

   
   <div class="aside">
    
        <div class="btn-wrapper-aside">
           
      <router-link to="/dashboard" class="aside-btn"> <img :src="dashboardIcon" alt="✖" class="aside-logo">Дашборд</router-link>
        </div>
              <div class="btn-wrapper-aside">
         <router-link  to="/projects" class="aside-btn"> <img :src="projectsIcon" alt="✖" class="aside-logo">Проекты</router-link>
        </div>
              <div class="btn-wrapper-aside">
         <router-link  to="/tasks" class="aside-btn"> <img :src="tasksIcon" alt="✖" class="aside-logo">Задачи</router-link>
        </div>
              <div class="btn-wrapper-aside">
        <router-link to="/timeentry" class="aside-btn"><img :src="timeentryIcon" alt="✖" class="aside-logo">Учет времени</router-link>
        </div>
        
       <label class="switch">
    <input class="checkbox" type="checkbox" v-model="isDarkMode" @change="toggleDarkMode">
    <span class="slider">
        <span class="knob"></span>
    </span>
</label>
        
   
    </div>
  <main class="content">
    <RouterView />
    
  </main>
  </div>

</div>

</template>

<style>

@import url(./assets/hide-aside.css);
</style>


<style scoped>

@import url(./assets/dark-theme.css);
*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}


@font-face{
    font-family: "Comfortaa";
    src: local("Comfortaa-Regular"),
    url(/src/fonts/Comfortaa/Comfortaa-Regular.ttf) format("ttf");
    font-weight: normal;
}



.dateTime{
      margin-left: auto;
    margin-right: 20px;
  font-family: "Comfortaa", sans-serif;
  font-weight: bold;
  font-size: 20px;
}

.switch {
    position: relative;
    flex-direction: end;
    display: inline-block;
    width: 60px;
    height: 30px;
    margin-left: auto;
    margin-right: 30px;
    margin-bottom: 40px;
    margin-top: auto;
}

.switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
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

input:checked + .slider{
    background-color: rgb(0, 0, 0);

}

.knob {
    position: absolute;
    height: 22px;
    width: 22px;
    
    left: 4px;
    bottom: 4px;
    background-color: rgb(189, 189, 189);
    
    transition: 0.3s;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    
}



.knob::before {
    content: "☀️";
    transition: 0.3s;
}

input:checked + .slider .knob {
    transform: translateX(30px);
    background-color: rgb(44, 44, 44);  
}

.slider .knob{
    background-color: #ccc;
}


input:checked + .slider .knob {
    transform: translateX(30px);
}

input:checked + .slider .knob::before {
    content: "🌙";
    
}
.slider:before{
    width: 0px;
    height: 0px;
}
.app-root{
    display: flex;
    flex-direction: column;
    height: 100vh;
    min-height: 100vh;
    width: 100%;
    overflow: hidden;
}


.main-part{
  display:flex;
    flex: 1;
    min-height: 0;
    overflow: hidden;
}

.header{
    height: 80px;
    flex-shrink: 0;
    border-bottom: 1px solid lightgray;
    display: flex;
    align-items: center;
    background-color: white;
}
.header-logo{
    margin-left: 90px;
    margin-right: 30px;
    height: 60px;
    width: 60px;
}
.header-text{
    font-size: 20px;
    font-family: "Comfortaa", sans-serif;
    font-weight: bold;
}   
.aside{
   display: flex;
   flex-direction: column;
    width: 300px;
    flex-shrink: 0;
    border-right: 1px solid lightgray;
    align-items: center;
    background-color: white;
    text-align: center; 
    overflow-y: auto;
    
}


.toggle-aside{
    height: 40px;
    width: 40px;
    border: 2px solid lightgray;
    background-color: transparent;
    border-radius: 15px;
       transition: background-color 0.3s;
       margin-left: 10px;
   
}
.toggle-aside:hover{
    background-color: lightgray;
}

.aside-btn{
    width: 100%;
    height: 40px;
    border: 0;
    border-radius: 10px;
    font-size: 18px;
    padding-left: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
    
    color: black;
    text-decoration: none;
   
    margin-top: 8px;
    text-align: left;
    font-weight: bold;
       font-family: "Comfortaa" sans-serif;
    background-color: white;
    cursor: pointer;
     transition: background-color 0.3s;
     
}
.aside-btn:hover{
    background-color: rgb(246, 138, 138);
}
.router-link-active{
    background-color: rgb(246, 138, 138);
}
.aside-logo{
    width: 30px;
    height: 30px;
    
}
.btn-wrapper-aside:first-child{
    padding-top: 30px;
}
.btn-wrapper-aside{
    width: 100%;
    padding: 0 10px;
   box-sizing: border-box;
}

.content{
    background-color: rgb(247, 247, 247);
    flex: 1;
    overflow-y: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    padding: 20px;
    
}
.content::-webkit-scrollbar{
    display: none;
}


</style>
