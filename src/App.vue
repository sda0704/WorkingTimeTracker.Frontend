<script setup lang="ts">

   import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
<div>
   <div class="header">

<img src="/images/timer-with-red-colour_78370-7250.jpg" alt="" class="header-logo">
<p class="header-text">Учет рабочего времени</p>

    </div>
    <div class="main-part">

    <!-- <h2>Меню</h2>
   <router-link to="/projects" class="nav-link">Проекты</router-link>
   <router-link to="/tasks" class="nav-link">Задачи</router-link>
   <router-link to="/timeentry" class="nav-link" >Проводки</router-link> -->
   
   <div class="aside">
        <div class="btn-wrapper-aside">
           
      <router-link to="/projects" class="aside-btn"> <img src="/images/dashboard.svg" alt="" class="aside-logo">Дашборд</router-link>
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

.main-part{
  display:flex;
}
.header{
    height: 60px;
    border-bottom: 1px solid lightgray;
    display: flex;
    align-items: center;
}
.header-logo{
    height: 60px;
    width: 60px;
}
.header-text{
    font-size: 20px;
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    font-weight: bold;
}   
.aside{
   
    height: 1000px;
    border-right: 1px solid lightgray;
    align-items: center;
    display: block;
    text-align: center; 
}

.aside-btn{
    width: 300px;
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
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
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
    width: 90%;
    display: flex;
    align-items: center ;
    justify-content: center;
}


</style>
