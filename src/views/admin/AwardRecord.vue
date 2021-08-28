<template>
  <div id="award-record">
    <el-table :data="tableData">
      <el-table-column prop="user_name" label="用户"></el-table-column>
      <el-table-column prop="prize_name" label="奖品"></el-table-column>
      <el-table-column prop="create_time" label="时间">
        <template #default="scope">
          {{ moment(scope.row.create_time).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
      </el-table-column>
    </el-table>

    <Pagination
      v-if="pagination.total > pagination.pageSize"
      :pagination="pagination"
      @currentChange="handleCurrentChange"
    />
  </div>
</template>

<script>
import { onMounted, reactive, toRefs } from 'vue';
import { getAwardRecord } from '@/apis/awardRecord';
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
        page: 1,
        pageSize: 10,
        total: 0,
      },
    });

    const handleCurrentChange = (page) => {
      state.pagination.page = page;
      getAwardRecordData();
    };

    const getAwardRecordData = () => {
      const { page, pageSize } = state.pagination;
      getAwardRecord({ page, pageSize })
        .then((res) => {
          if (res.data.code === 200) {
            state.tableData = res.data.data.resultSet;
            state.pagination.total = res.data.data.metadata.pagination.total;
          }
        })
        .catch();
    };

    onMounted(() => {
      getAwardRecordData();
    });

    return {
      ...toRefs(state),
      handleCurrentChange,
      moment
    };
  },
};
</script>

<style></style>
