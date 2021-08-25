<template>
  <div id="user">
    <el-table :data="tableData">
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="gold_coin_num" label="金币数量"></el-table-column>
      <el-table-column prop="is_admin" label="管理员"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { onMounted, reactive, toRefs } from 'vue';
import { getUsers } from '@/api/user';

export default {
  setup() {
    const state = reactive({
      tableData: [],
    });

    const getUsersData = () => {
      getUsers()
        .then((res) => console.log(res.data))
        .catch();
    };

    onMounted(() => {
      getUsersData();
    });

    return {
      ...toRefs(state),
    };
  },
};
</script>

<style></style>
