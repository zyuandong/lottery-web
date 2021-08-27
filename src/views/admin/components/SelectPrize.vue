<template>
  <div id="select-prize">
    <el-table :data="tableData">
      <!-- <el-table-column type="selection" width="55"></el-table-column> -->
      <el-table-column label="选择" align="center" width="55">
        <template #default="scope">
          <el-radio v-model="selected" :label="scope.row" v-if="!scope.row.is_active"></el-radio>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column prop="pic" label="图片"></el-table-column>
      <el-table-column prop="number" label="数量"></el-table-column>
      <el-table-column prop="probability" label="概率"></el-table-column>
      <el-table-column label="类型">
        <template #default="scope">
          <el-tag v-if="scope.row.type === 0" type="info">文字</el-tag>
          <el-tag v-else-if="scope.row.type === 1" type="warning">金币</el-tag>
          <el-tag v-else>实物</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="is_active" label="状态">
        <template #default="scope">
          <el-tag v-if="scope.row.is_active">激活</el-tag>
          <el-tag v-else type="info">未激活</el-tag>
        </template>
      </el-table-column>
      <!-- <el-table-column label="操作">
        <template #default="scope">
          <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column> -->
    </el-table>

    <Pagination
      v-if="tableData.length > pagination.pageSize"
      :pagination="pagination"
      @currentChange="handleCurrentChange"
    />

    <div class="btn-box m-t-16">
      <el-button size="small">取消</el-button>
      <el-button size="small" type="primary" @click="handleSure">确定</el-button>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, toRefs, ref } from 'vue';
import { getPrizes } from '@/apis/prize';
import Pagination from '@/components/Pagination.vue';
// import PrizeForm from './components/PrizeForm.vue';

export default {
  components: {
    Pagination,
    // PrizeForm,
  },

  setup(props, {emit}) {
    const state = reactive({
      tableData: [],
      pagination: {
        total: 0,
        page: 1,
        pageSize: 10,
      },
      loading: false,
      dialogForm: false,
      selected: null
    });

    // const selected = ref('');

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

    const handleSure = () => {
      emit('selectPrize', state.selected)
    };

    // const handleAdd = () => {
    //   state.dialogForm = true;
    // };

    onMounted(() => {
      getPrisesData();
    });

    return {
      ...toRefs(state),
      // selected,
      handleCurrentChange,
      handleSure
    };
  },
};
</script>

<style lang="scss">
#select-prize {
  table td {
    .el-radio {
      .el-radio__label {
        display: none;
      }
    }
  }
}
</style>
