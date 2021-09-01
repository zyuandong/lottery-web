import { createApp } from 'vue';
import App from './App.vue';
import router, { asyncRoutes } from '@/router';
import store from './store';
import ElementPlus from 'element-plus';

import 'element-plus/packages/theme-chalk/src/index.scss';
import '@/styles/index.scss';

// 刷新时，动态添加 admin 路由
const user = sessionStorage.getItem('user')
  ? JSON.parse(sessionStorage.getItem('user'))
  : {};
if (user && user.is_admin) {
  router.addRoute(asyncRoutes.admin);
}

const app = createApp(App);

app.use(router);
app.use(store);
app.use(ElementPlus);

app.mount('#app');
