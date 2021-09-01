import { ElMessage } from 'element-plus';
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
      {
        path: '/profile',
        component: () => import('@/views/Profile.vue'),
      },
      {
        path: '404',
        component: () => import('@/views/404.vue'),
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
    path: '/:pathMatch(.*)',
    redirect: '/404',
  },
];

export const asyncRoutes = {
  admin: {
    name: 'admin',
    path: '/admin',
    component: () => import('@/layout/Index.vue'),
    redirect: '/admin/prizes/setting',
    children: [
      {
        path: 'users',
        component: () => import('@/views/admin/User.vue'),
      },
      {
        path: 'prizes',
        redirect: '/admin/prizes/list',
      },
      {
        path: 'prizes/list',
        component: () => import('@/views/admin/Prize.vue'),
      },
      {
        path: 'prizes/setting',
        component: () => import('@/views/admin/PrizePool.vue'),
      },
      {
        path: 'award_record',
        component: () => import('@/views/admin/AwardRecord.vue'),
      },
    ],
  },
};

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes, // short for `routes: routes`
});

router.beforeEach((to, form, next) => {
  // console.log(to);
  // console.log(form);
  const user = JSON.parse(sessionStorage.getItem('user'));
  if (to.path === '/login' || to.path === '/register') {
    if (user) {
      return next('/lottery');
    }
    return next();
  }
  if (user) {
    // TODO 鉴权
    // console.log(router.hasRoute('admin'));
    // console.log(router.getRoutes());
    if (user.is_admin && !router.hasRoute('admin')) {
      router.addRoute(asyncRoutes.admin);
      next({ ...to, replace: true });
    }
    next();
  } else {
    ElMessage.warning('请登录系统！');
    console.log('== to login ==');
    next('/login');
  }
});

export default router;
