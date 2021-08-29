<template>
  <div id="aside">
    <el-menu
      background-color="#2E363F"
      text-color="#939da8"
      active-text-color="#fff"
      :default-active="defaultActive"
      @select="toPage"
    >
      <!-- <el-menu-item index="/admin/prize">奖品管理</el-menu-item> -->
      <el-submenu index="/admin/prizes">
        <template #title>奖品管理</template>
        <el-menu-item index="/admin/prizes/list">奖品列表</el-menu-item>
        <el-menu-item index="/admin/prizes/setting">奖池设置</el-menu-item>
      </el-submenu>
      <el-menu-item index="/admin/users">用户管理</el-menu-item>
      <el-menu-item index="/admin/award_record">获奖记录</el-menu-item>
    </el-menu>
  </div>
</template>

<script>
import { ref, onMounted, onUpdated, onBeforeUpdate } from 'vue';
import { useRouter, useRoute } from 'vue-router';

export default {
  setup() {
    const router = useRouter();
    const route = useRoute();
    const defaultActive = router.currentRoute.value.fullPath;

    const toPage = (index, indexPath) => {
      // console.log(index, indexPath);
      router.push(index);
    };

    return {
      toPage,
      defaultActive,
    };
  },
};
</script>

<style lang="scss" scoped>
#layout-menu {
  &.el-menu {
    text-align: left;
    border: none;
    li.is-active {
      background-color: var(--primary) !important;
    }
  }
}
</style>
