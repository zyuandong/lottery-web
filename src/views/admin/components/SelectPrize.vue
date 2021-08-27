<template>
  <div id="select-prize">
    <!-- <router-link to="/admin/prizes/list">新增奖品</router-link> -->
    <el-table :data="tableData">
      <!-- <el-table-column type="selection" width="55"></el-table-column> -->
      <el-table-column label="选择" align="center" width="55">
        <template #default="scope">
          <el-radio
            v-model="selectedId"
            :label="scope.row.oid"
            v-if="!scope.row.is_active"
            @change="handleChangeSelect(scope.row)"
          ></el-radio>
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
    </el-table>

    <Pagination
      v-if="tableData.length > pagination.pageSize"
      :pagination="pagination"
      @currentChange="handleCurrentChange"
    />

    <div class="btn-box m-t-16">
      <el-button size="small" @click="handleCancel">取消</el-button>
      <el-button size="small" type="primary" @click="handleSure"
        >确定</el-button
      >
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, toRefs, ref } from 'vue';
import { getPrizes } from '@/apis/prize';
import Pagination from '@/components/Pagination.vue';

export default {
  components: {
    Pagination,
  },

  setup(props, { emit }) {
    const state = reactive({
      tableData: [],
      pagination: {
        total: 0,
        page: 1,
        pageSize: 10,
      },
      loading: false,
      dialogForm: false,
      selectedObj: null,
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

    const handleChangeSelect = (obj) => {
      state.selectedObj = obj;
    };

    const handleSure = () => {
      emit('selectPrize', state.selectedObj);
    };

    const handleCancel = () => {
      emit('close')
    }

    onMounted(() => {
      getPrisesData();
    });

    return {
      ...toRefs(state),
      selectedId: ref(''),
      handleCurrentChange,
      handleSure,
      handleCancel,
      handleChangeSelect,
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
