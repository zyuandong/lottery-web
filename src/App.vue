<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue';
import { getUser } from '@/apis/user';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const router = useRouter();
const store = useStore();

const getUserData = () => {
  const user = sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')) : {};

  if (!user.oid) {
    console.log('==0==', user);
    // sessionStorage.removeItem('user');
    sessionStorage.clear();
    // debugger
    // 不需要此处跳转，通过路由守卫去跳转
    // router.push('/login');
  } else {
    console.log('==1==', user);
    getUser({ oid: user.oid })
      .then((res) => {
        if (res.data.code === 200) {
          console.log('==2==', user);          
          sessionStorage.setItem('user', JSON.stringify(res.data.data));
          // store.dispatch('updateUser', res.data.data);
        }
      })
      .catch();
  }
};

onMounted(() => {
  getUserData();
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  // text-align: center;
  color: #2c3e50;
}
</style>
