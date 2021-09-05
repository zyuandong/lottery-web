<template>
  <div id="prize-list">
    <div class="control-box">
      <div class="left">
        <el-button type="primary" size="small" @click="handleAdd"> 新增 </el-button>
      </div>
    </div>
    <el-table :data="tableData">
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="pic" label="图片">
        <template #default="scope">
          <img class="prize-pic" v-if="scope.row.type === 1" src="@/assets/svg/gold_coin.svg" />
          <img
            class="prize-pic"
            v-if="scope.row.type === 2 && scope.row.pic"
            :src="'/lottery_service_api/' + scope.row.pic"
          />
        </template>
      </el-table-column>
      <el-table-column prop="number" label="数量"></el-table-column>
      <el-table-column prop="probability" label="概率"></el-table-column>
      <el-table-column label="类型">
        <template #default="scope">
          <el-tag size="small" v-if="scope.row.type === 0" type="info">文字</el-tag>
          <el-tag size="small" v-else-if="scope.row.type === 1" type="warning">金币</el-tag>
          <el-tag size="small" v-else>实物</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="is_active" label="状态">
        <template #default="scope">
          <el-tag size="small" v-if="scope.row.is_active">激活</el-tag>
          <el-tag size="small" v-else type="info">未激活</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="scope">
          <el-button type="text" :disabled="scope.row.is_active === 1" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button type="text" class="text-error" :disabled="scope.row.is_active === 1" @click="handleDelete(scope.row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination
      v-if="pagination.total > pagination.pageSize"
      :pagination="pagination"
      @currentChange="handleCurrentChange"
    />

    <el-dialog
      v-model="dialogForm"
      :title="formData.oid ? '编辑奖品' : '新增奖品'"
      width="500px"
      v-if="dialogForm"
      :close-on-click-modal="false"
    >
      <PrizeForm
        v-if="dialogForm"
        :data="formData"
        @close="dialogForm = false"
        @reset="handleReset"
      />
    </el-dialog>
  </div>
</template>

<script>
import { onMounted, reactive, toRefs } from 'vue';
import Pagination from '@/components/Pagination.vue';
import PrizeForm from './components/PrizeForm.vue';
import { getPrizes, deletePrize } from '@/apis/prize';
import { ElMessage, ElMessageBox } from 'element-plus';

export default {
  components: {
    Pagination,
    PrizeForm,
  },

  setup() {
    const state = reactive({
      tableData: [],
      formData: {},
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

    const handleEdit = (obj) => {
      state.dialogForm = true;
      state.formData = obj;
    };

    const handleAdd = () => {
      state.formData = {};
      state.dialogForm = true;
    };

    const handleReset = () => {
      state.pagination.page = 1;
      getPrisesData();
    };

    const handleDelete = (obj) => {
      ElMessageBox.confirm('请确定是否删除此奖品！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          deletePrize({ oid: obj.oid })
            .then((res) => {
              if (res.data.code === 200) {
                ElMessage.success(`删除奖品成功！`);
                getPrisesData();
              }
            })
            .catch((err) => {});
        })
        .catch();
    };

    onMounted(() => {
      getPrisesData();
    });

    return {
      ...toRefs(state),
      handleCurrentChange,
      handleEdit,
      handleAdd,
      handleReset,
      handleDelete,
    };
  },
};
</script>

<style lang="scss">
#prize-list {
  .prize-pic {
    width: 0.6rem;
  }
}
</style>
