<template>
  <div id="user">
    <el-table :data="tableData">
      <el-table-column label="用户" width="60">
        <template #default="scope">
          <el-avatar :src="`/lottery_service_api/${scope.row.avatar}`"></el-avatar>
        </template>
      </el-table-column>
      <el-table-column prop="name"></el-table-column>
      <el-table-column prop="gold_coin_num" label="金币数量"></el-table-column>
      <el-table-column prop="is_admin" label="是否为管理员">
        <template #default="scope">
          <el-tag size="small" v-if="scope.row.is_admin">是</el-tag>
          <el-tag size="small" v-else type="info">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="注册时间">
        <template #default="scope">
          {{ moment(scope.row.create_time).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
    </el-table>

    <Pagination
      v-if="tableData.length"
      :pagination="pagination"
      @currentChange="handleCurrentChange"
    />
  </div>
</template>

<script>
import { onMounted, reactive, toRefs } from 'vue';
import { getUsers } from '@/apis/user';
import Pagination from '@/components/Pagination.vue';
import moment from 'moment';

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
      moment,
      handleCurrentChange,
    };
  },
};
</script>

<style></style>
