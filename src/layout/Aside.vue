<template>
  <div id="aside">
    aside
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
      defaultActive
    };
  }
};
</script>

<style lang="scss" scoped>
#layout-menu {
  &.el-menu {
    border: none;
    li.is-active {
      background-color: var(--primary) !important;
    }
  }
}
</style>
