import { createRouter, createWebHistory } from 'vue-router'

const routes = [{
  path: '/',
  component: () => import('@/layout/Index.vue'),
  redirect: '/lottery',
  children: [
    {
      path: 'login',
      component: () => import('@/views/Login.vue')
    },
    {
      path: 'register',
      component: () => import('@/views/Register.vue')
    },
    {
      path: 'lottery',
      component: () => import('@/views/Lottery.vue')
    },
  ]
}]

const router = createRouter({
  history: createWebHistory(),
  routes, // short for `routes: routes`
})

export default router;