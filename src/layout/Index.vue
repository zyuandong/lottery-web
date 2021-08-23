<template>
  <!-- <el-container>
    <el-header>
      <Header />
    </el-header>
    <el-container>
      <el-aside width="200px">
        <Aside />
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container> -->
  <div id="layout">
    <Header />
    <Aside />
    <router-view />
  </div>
</template>

<script>
import Header from '@/layout/Header.vue';
import Aside from '@/layout/Aside.vue';

export default {
  components: {
    Header,
    Aside,
  },
};
</script>

<style lang="scss" scoped>
.el-header {
  color: var(--white-main);
  background-color: var(--black-main);
  // border-bottom: 1px solid #e6e6e6;
}
.el-aside {
  background-color: #2e363f;
}
.el-container {
  height: calc(100vh - 0.6rem);
}
</style>
