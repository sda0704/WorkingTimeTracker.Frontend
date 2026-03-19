import { createRouter, createWebHistory } from 'vue-router'
import ProjectView from '@/views/ProjectView.vue';
import TaskView from '@/views/TaskView.vue';
import TimeEntryView from '@/views/TimeEntryView.vue';


const routes = [
  {
    path: '/',
    redirect: '/projects'
  },
  {
    path: '/projects',
    name: 'projects',
    component: ProjectView  
  },
  {
    path: '/tasks',
    name: 'tasks',
    component: TaskView
  },
  {
    path: '/timeentry',
    name: 'timeentry',
    component: TimeEntryView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
