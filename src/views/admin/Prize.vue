<template>
  <div id="prize">
    <div class="control-box">
      <div class="left">
        <el-button type="primary" size="small" @click="handleAdd"
          >添加</el-button
        >
      </div>
    </div>
    <el-table :data="tableData">
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="pic" label="图片"></el-table-column>
      <el-table-column prop="number" label="数量"></el-table-column>
      <el-table-column prop="probability" label="概率"></el-table-column>
      <el-table-column prop="is_gold_coin" label="是否为金币">
        <template #default="scope">
          <el-tag v-if="scope.row.is_gold_coin">是</el-tag>
          <el-tag v-else type="info">否</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="is_active" label="状态">
        <template #default="scope">
          <el-tag v-if="scope.row.is_active">激活</el-tag>
          <el-tag v-else type="info">未激活</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination
      v-if="tableData.length"
      :pagination="pagination"
      @currentChange="handleCurrentChange"
    />

    <el-dialog v-model="dialogForm" width="500px" v-if="dialogForm">
      <template #title>新增奖品</template>
      <PrizeForm />
    </el-dialog>
  </div>
</template>

<script>
import { onMounted, reactive, toRefs } from 'vue';
import { getPrizes } from '@/apis/prize';
import Pagination from '@/components/Pagination.vue';
import PrizeForm from './components/PrizeForm.vue';

export default {
  components: {
    Pagination,
    PrizeForm,
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
      dialogForm: false,
    });

    const getPrisesData = () => {
      const { page, pageSize } = state.pagination;
      getPrizes({
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
      getPrisesData();
    };

    const handleEdit = () => {};

    const handleAdd = () => {
      state.dialogForm = true;
    };

    onMounted(() => {
      getPrisesData();
    });

    return {
      ...toRefs(state),
      handleCurrentChange,
      handleEdit,
      handleAdd,
    };
  },
};
</script>

<style></style>
