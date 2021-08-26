<template>
  <div id="prize-form">
    <el-form ref="prizeForm" label-width="82px" :model="form" >
      <el-form-item label="名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>

      <el-form-item label="是否为金币">
        <el-radio-group v-model="form.is_gold_coin">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="数量" v-if="form.is_gold_coin">
        <el-input v-model="form.number"></el-input>
      </el-form-item>
    </el-form>

    <div class="btn-box">
      <el-button size="small">取消</el-button>
      <el-button size="small" type="primary">确定</el-button>
    </div>

    <!-- <pre>{{ form }}</pre> -->
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue';

export default {
  setup() {
    const state = reactive({
      form: {
        is_gold_coin: 0,
        number: 1
      },
    });

    return {
      ...toRefs(state),
    };
  },
};
</script>

<style></style>
