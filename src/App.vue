<script setup lang="ts">

   import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
<div>
  <nav class="sidebar">
    <h2>Меню</h2>
   <router-link to="/projects" class="nav-link">Проекты</router-link>
   <router-link to="/tasks" class="nav-link">Задачи</router-link>
   <router-link to="/timeentry" class="nav-link" >Проводки</router-link>
  </nav>

  <main class="content">
    <RouterView />
  </main>
</div>
</template>

<style scoped>

.app{
  display: flex;
  height: 100hv;
}
.sidebar{
  width: 200px;
  background: #f0f0f0;
  padding: 20px;
}
.nav-link{
  display: block;
  margin: 10px 0;
  padding: 10px;
  color: #333;
  text-decoration: none;
  border-radius: 4px;
}
.nav-link:hover{
  background: #ddd;
}
.nav-link.router-link-active{
  background: #007bff;
  color: white;
}
.content{
  flex: 1;
  padding: 20px;
}

</style>
