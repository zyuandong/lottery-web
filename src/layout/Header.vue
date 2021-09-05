<template>
  <div id="app-header" class="flex-box justify-content-flex-end">
    <el-menu
      mode="horizontal"
      background-color="#000"
      text-color="#939da8"
      active-text-color="#fff"
      :default-active="defaultActive"
      @select="toPage"
    >
      <el-submenu index="submenu">
        <template #title>
          <el-avatar size="small" :src="`/lottery_service_api/${user.avatar}`"></el-avatar>
          {{ user.name }}
        </template>
        <el-menu-item index="/lottery">去抽奖</el-menu-item>
        <el-menu-item index="/profile">个人资料</el-menu-item>
        <el-menu-item index="/admin" v-if="user.is_admin">系统管理</el-menu-item>
        <el-menu-item index="/login" @click="handleSignOut">退出</el-menu-item>
      </el-submenu>
    </el-menu>
  </div>
</template>

<script>
import { compile, computed, reactive, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default {
  setup() {
    const store = useStore();

    const state = reactive({
      // user: JSON.parse(sessionStorage.getItem('user')),
      // user: computed(() => store.state.user)
    });

    const user = computed(() => store.state.user);

    const router = useRouter();
    let defaultActive = router.currentRoute.value.fullPath;
    if (router.currentRoute.value.fullPath.includes('admin')) {
      defaultActive = '/admin';
    }

    const toPage = (index, indexPath) => {
      // console.log(index, indexPath);
      router.push(index);
    };

    const handleSignOut = () => {
      sessionStorage.clear();
      toPage('/login');
    };

    return {
      ...toRefs(state),
      toPage,
      user,
      defaultActive,
      handleSignOut,
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
