<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue';
import { getUser } from '@/apis/user';
import { useRouter } from 'vue-router';

const router = useRouter();

const getUserData = () => {
  const user = sessionStorage.getItem('user')
    ? JSON.parse(sessionStorage.getItem('user'))
    : {};
  if (!user.oid) {
    sessionStorage.removeItem('user');
    router.push('/login');
  }
  getUser({ oid: user.oid })
    .then((res) => {
      if (res.data.code === 200) {
        sessionStorage.setItem('user', JSON.stringify(res.data.data));
      }
    })
    .catch();
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
