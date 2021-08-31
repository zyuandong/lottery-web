<template>
  <div id="app-header" class="flex-box justify-content-flex-end">
    <!-- <h1 class="title">header</h1>
    <router-link to="/admin/user">Admin</router-link>
    <router-link to="/lottery">lottery</router-link> -->
    <el-menu
      mode="horizontal"
      background-color="#000"
      text-color="#939da8"
      active-text-color="#fff"
      :default-active="defaultActive"
      @select="toPage"
    >
      <el-submenu index="submenu">
        <template #title>{{ user.name }}</template>
        <el-menu-item index="/admin" v-if="user.is_admin">系统管理</el-menu-item>
        <el-menu-item index="/lottery" v-if="user.is_admin">去抽奖</el-menu-item>
        <el-menu-item index="/login" @click="handleSignOut">退出</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const state = reactive({
      user: JSON.parse(sessionStorage.getItem('user')),
    });

    const router = useRouter();
    let defaultActive = '/lottery';
    if (router.currentRoute.value.fullPath.includes('admin')) {
      defaultActive = '/admin';
    }

    const toPage = (index, indexPath) => {
      // console.log(index, indexPath);
      router.push(index);
    };

    const handleSignOut = () => {
      sessionStorage.clear('user')
      toPage('/login')
    }

    return {
      ...toRefs(state),
      toPage,
      defaultActive,
      handleSignOut
    };
  },
};
</script>

<style lang="scss">
#app-header {
  line-height: 0.6rem;

  .title {
    font-size: 0.2rem;
    margin: 0;
  }
}
</style>
