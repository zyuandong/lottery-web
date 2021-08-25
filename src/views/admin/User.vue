<template>
  <div id="user">
    <el-table :data="tableData">
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="gold_coin_num" label="金币数量"></el-table-column>
      <el-table-column prop="is_admin" label="管理员">
        <template #default="scope">
          <el-tag v-if="scope.row.is_admin === 'T'">是</el-tag>
          <el-tag v-else type="info">否</el-tag>
        </template>
      </el-table-column>
    </el-table>

    <Pagination
      v-if="!loading"
      :pagination="pagination"
      @currentChange="handleCurrentChange"
    />
  </div>
</template>

<script>
import { onMounted, reactive, toRefs } from 'vue';
import { getUsers } from '@/apis/user';
import Pagination from '@/components/Pagination.vue';

export default {
  components: {
    Pagination,
  },
  setup() {
    const state = reactive({
      tableData: [],
      pagination: {
        total: 0,
        page: 1,
        pageSize: 10,
      },
      loading: false,
    });

    const getUsersData = () => {
      const { page, pageSize } = state.pagination;
      getUsers({
        page,
        pageSize,
      })
        .then((res) => {
          state.tableData = res.data.data.resultSet;
          state.pagination.total = res.data.data.metadata.pagination.total;
        })
        .catch();
    };

    const handleCurrentChange = (page) => {
      state.pagination.page = page;
      getUsersData();
    };

    onMounted(() => {
      getUsersData();
    });

    return {
      ...toRefs(state),
      handleCurrentChange,
    };
  },
};
</script>

<style></style>
