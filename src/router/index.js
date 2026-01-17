import { createRouter, createWebHistory } from 'vue-router'

import Login from '../components/log.vue'
import Ingredients from '../components/Ingredients.vue'
const routes = [
 
   {
    path: '/log',
    name: 'Log',
    component: Login,
    meta: { requiresAuth: false }
  },
  {
    path: '/ingredients',
    name: 'Ingredients',
    component: Ingredients,
  }
  
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Authentication guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('auth_token')
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.meta.requiresGuest && isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
