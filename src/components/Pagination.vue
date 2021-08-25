<template>
  <div id="pagination">
    <el-pagination
      background
      layout="prev, pager, next"
      :total="pagination.total"
      :page-size="pagination.pageSize"
      :current-page="pagination.page"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </div>
</template>

<script>
import { ref, watch } from 'vue';

export default {
  props: {
    pagination: Object,
  },
  setup(props, { emit }) {
    // const currpage = ref(Number(props.newPage));
    // const pageChange = ref(Number(props.pagination.pageSize));
    const handleCurrentChange = (page) => {
      // currpage.value = page;
      props.pagination.page = page
      emit('currentChange', page);
    };

    // const handleSizeChange = (val) => {
    //   // pageChange.value = val;
    //   props.pagination.pageSize = val
    //   emit('sizeChange', val);
    // };

    // watch(
    //   () => props.newPage,
    //   (val) => {
    //     currpage.value = props.newPage;
    //   }
    // );

    return {
      handleCurrentChange,
      // handleSizeChange,
      // pageChange,
      // currpage,
    };
  },
};
</script>

<style lang="scss" scoped>
#pagination {
  text-align: center;
  padding-top: 0.16rem;
}
</style>
