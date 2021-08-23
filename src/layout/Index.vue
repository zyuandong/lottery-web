<template>
  <el-container id="layout">
    <el-header>
      <Header />
    </el-header>
    <el-container>
      <el-aside width="200px" v-if="isAdminPage">
        <Aside />
      </el-aside>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { ref, reactive, toRefs, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import Header from '@/layout/Header.vue';
import Aside from '@/layout/Aside.vue';

export default {
  components: {
    Header,
    Aside,
  },
  setup() {
    const state = reactive({
      isAdminPage: false
    })

    const route = useRoute();

    watch(
      () => route.path,
      (val) => {
        state.isAdminPage = val.includes('admin')
      }
    );

    onMounted(() => {
      state.isAdminPage = route.path.includes('admin')
    });

    return {
      ...toRefs(state)
    }
  },
};
</script>

<style lang="scss" scoped>
.el-header {
  color: var(--white-main);
  background-color: var(--black-main);
  padding: 0;
  // border-bottom: 1px solid #e6e6e6;
}
.el-aside {
  background-color: #2e363f;
}
.el-container {
  // height: calc(100vh - 0.6rem);
  height: 100vh;
}
</style>
