import { createRouter, createWebHistory } from 'vue-router';

const constantRoutes = [
  {
    path: '/',
    component: () => import('@/layout/Index.vue'),
    redirect: '/lottery',
    children: [
      {
        path: 'lottery',
        component: () => import('@/views/Lottery.vue'),
      },
    ],
  },
  {
    path: '/login',
    component: () => import('@/views/Login.vue'),
  },
  {
    path: '/register',
    component: () => import('@/views/Register.vue'),
  },
  {
    path: '/404',
    component: () => import('@/views/404.vue'),
  },
  {
    path: '/:pathMatch(.*)',
    redirect: '/404'
  }
];

const asyncRoutes = [
  {
    path: '/admin',
    component: () => import('@/layout/Index.vue'),
    redirect: '/admin/user',
    children: [
      {
        path: 'user',
        component: () => import('@/views/admin/User.vue'),
      },
      {
        path: 'prize',
        component: () => import('@/views/admin/Prize.vue'),
      },
      {
        path: 'award_record',
        component: () => import('@/views/admin/AwardRecord.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes, // short for `routes: routes`
});

// asyncRoutes.forEach(item => {
//   router.addRoute(item)
// });

export default router;
