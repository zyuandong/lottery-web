<template>
  <div id="prize-form">
    <el-form ref="prizeForm" label-width="82px" :model="form">
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

      <el-form-item label="图片" v-if="form.type === 2">
        <el-upload
          action="/lottery_service_api/prizes/pic/upload"
          :limit="1"
          :show-file-list="false"
          :on-success="handleSuccess"
          :on-change="handleChange"
        >
          <img v-if="form.pic" :src="`/lottery_service_api/${form.pic}`" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
    </el-form>

    <div class="btn-box">
      <el-button size="small" @click="handleCancel">取消</el-button>
      <el-button size="small" type="primary" @click="handleSubmit"> 确定 </el-button>
    </div>

    <!-- <pre>{{ form }}</pre> -->
  </div>
</template>

<script>
import { reactive, ref, toRefs } from 'vue';
import { ElMessage } from 'element-plus';
import { addPrize, updatePrize } from '@/apis/prize';

export default {
  props: {
    data: Object,
  },
  setup(props, { emit }) {
    const { oid, name, type, number, pic } = props.data;
    const state = reactive({
      form: {
        name: name || '',
        type: type || 0,
        number: number || 1,
        pic: pic || '',
        place_index: -1,
      },
    });

    const handleChange = (file) => {
      // console.log(file);
      // // const blob = new Blob(file.raw);
      // // state.form.pic = blob;
      // // console.log(blob);
      // let reader = new FileReader();
      // // let src = '';
      // reader.readAsDataURL(file.raw);
      // // console.log(reader.readAsDataURL(file.raw));
      // reader.addEventListener(
      //   'load',
      //   () => {
      //     if (typeof reader.result === 'object') {
      //       state.form.pic = new Blob([reader.result]);
      //     } else {
      //       state.form.pic = reader.result;
      //     }
      //     // console.log(src);
      //   },
      //   false
      // );
    };

    const handleSuccess = (res, file) => {
      if (res.code === 200) {
        // imageUrl.value = URL.createObjectURL(file.raw);
        state.form.pic = res.data;
      }
    };

    const handleSubmit = () => {
      if (props.data.oid) {
        updatePrize({ oid, ...state.form })
          .then((res) => {
            if (res.data.code === 200) {
              ElMessage.success('编辑奖品成功！');
              handleCancel();
              emit('reset');
            }
          })
          .catch();
      } else {
        addPrize(state.form)
          .then((res) => {
            if (res.data.code === 200) {
              ElMessage.success('新增奖品成功！');
              handleCancel();
              emit('reset');
            } else if (res.data.errorCode === '500_01') {
              ElMessage.error('奖品已存在！');
            }
          })
          .catch();
      }
    };

    const handleCancel = () => {
      emit('close');
    };

    return {
      ...toRefs(state),
      handleSubmit,
      handleCancel,
      handleChange,
      handleSuccess,
    };
  },
};
</script>

<style lang="scss">
#prize-form {
  .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;

    &:hover {
      border-color: #409eff;
    }

    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 1.5rem;
      height: 1.5rem;
      line-height: 1.5rem;
      text-align: center;
    }
  }

  .avatar {
    width: 1.5rem;
    height: 1.5rem;
    display: block;
  }
}
</style>
