<template>
  <div id="prize-form">
    <el-form ref="prizeForm" label-width="82px" :model="form" >
      <el-form-item label="名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>

      <el-form-item label="类型">
        <el-radio-group v-model="form.type">
          <el-radio :label="0">文字</el-radio>
          <el-radio :label="1">金币</el-radio>
          <el-radio :label="2">实物</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="数量" v-if="form.type === 1">
        <el-input v-model="form.number"></el-input>
      </el-form-item>
    </el-form>

    <div class="btn-box">
      <el-button size="small" @click="handleCancel">取消</el-button>
      <el-button size="small" type="primary" @click="handleSubmit">确定</el-button>
    </div>

    <!-- <pre>{{ form }}</pre> -->
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue';
import { addPrize } from '@/apis/prize';
import { ElMessage } from 'element-plus';

export default {
  setup(props, {emit}) {
    const state = reactive({
      form: {
        type: 0,
        number: 1
      },
    });

    const handleSubmit = () => {
      addPrize(state.form)
        .then(res => {
          if (res.data.code === 200) {
            ElMessage.success('新增奖品成功！');
            handleCancel();
            emit('reset')
          }
        })
        .catch()
    };

    const handleCancel = () => {
      emit('close')
    };

    return {
      ...toRefs(state),
      handleSubmit,
      handleCancel
    };
  },
};
</script>

<style></style>
