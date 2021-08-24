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
        <template #title>userName</template>
        <el-menu-item index="/admin/user">系统管理</el-menu-item>
        <el-menu-item index="/lottery">去抽奖</el-menu-item>
        <el-menu-item index="/login">退出</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();
    let defaultActive = '/lottery';
    if (router.currentRoute.value.fullPath.includes('admin')) {
      defaultActive = '/admin/user';
    }

    const toPage = (index, indexPath) => {
      // console.log(index, indexPath);
      router.push(index);
    };

    return {
      toPage,
      defaultActive
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

  .el-menu {
    float: right;
  }
}
</style>
