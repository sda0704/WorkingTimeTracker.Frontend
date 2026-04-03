<script setup lang="ts">

   import { RouterLink, RouterView } from 'vue-router';
   import {ref, onMounted} from 'vue';

   const isDarkMode = ref(false);

   const toggleDarkMode = () => {
    isDarkMode.value = !isDarkMode.value;
    if(isDarkMode.value){
        document.body.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }else{
        document.body.classList.remove('dark');
        localStorage.setItem('theme','light');
    }
   }
    onMounted(() => {
        const savedTheme = localStorage.getItem('theme');
        if(savedTheme==='dark'){
            isDarkMode.value = true;
            document.body.classList.add('dark');
        }
    })
   
</script>

<template>
<div class="app-root">
   <div class="header">

<img src="/images/timer-with-red-colour_78370-7250.jpg" alt="" class="header-logo">
<p class="header-text">Учет рабочего времени</p>
<button @click="toggleDarkMode" class="theme-toggle">
    {{ isDarkMode ? '🌞' : '🌕'}}
</button>
    </div>
    <div class="main-part">

   
   <div class="aside">
        <div class="btn-wrapper-aside">
           
      <router-link to="/dashboard" class="aside-btn"> <img src="/images/dashboard.svg" alt="" class="aside-logo">Дашборд</router-link>
        </div>
              <div class="btn-wrapper-aside">
         <router-link  to="/projects" class="aside-btn"> <img src="/images/projects.svg" alt="" class="aside-logo">Проекты</router-link>
        </div>
              <div class="btn-wrapper-aside">
         <router-link  to="/tasks" class="aside-btn"> <img src="/images/tasks.svg" alt="" class="aside-logo">Задачи</router-link>
        </div>
              <div class="btn-wrapper-aside">
        <router-link to="/timeentry" class="aside-btn"><img src="/images/time.svg" alt="" class="aside-logo">Учет времени</router-link>
        </div>
        
    </div>
  <main class="content">
    <RouterView />
    
  </main>
  </div>

</div>
</template>

<style scoped>

@import url(./assets/dark-theme.css);
*{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
:global(html), :global(body){
    height: 100%;
    margin: 0;
    padding: 0;
}

.theme-toggle{
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    margin-left: auto;
    margin-right: 20px;
}

.app-root{
    display: flex;
    flex-direction: column;
    height: 100vh;
    min-height: 100vh;
    width: 100%;
    overflow: hidden;
}
@font-face{
    font-family: "Comfortaa";
    src: local("Comfortaa-Regular"),
    url(/src/fonts/Comfortaa/Comfortaa-Regular.ttf) format("ttf");
    font-weight: normal;
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
    margin-left: 100px;
    height: 60px;
    width: 60px;
}
.header-text{
    font-size: 20px;
    font-family: "Comfortaa" sans-serif;
    font-weight: bold;
}   
.aside{
   
    width: 300px;
    flex-shrink: 0;
    border-right: 1px solid lightgray;
    align-items: center;
    background-color: white;
    display: block;
    text-align: center; 
    overflow-y: auto;
    
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
    padding: 20px;
    
}

</style>
