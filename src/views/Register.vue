<template>
  <div id="register">
    <div class="register-panel">
      <h1>注册</h1>
      <el-form ref="registerForm" label-position="top" label-width="60px" :model="form">
        <el-form-item label="">
          <el-input v-model="form.name" placeholder="用户名"></el-input>
        </el-form-item>

        <el-form-item label="">
          <el-input v-model="form.password" type="password" placeholder="密码"></el-input>
        </el-form-item>
      </el-form>

      <div class="btn-box">
        <el-button class="register-btn" size="small" @click="handleRegister"> 注册 </el-button>
        <div class="m-t-8">
          已有账号，去 <el-button type="text" @click="toPage('/login')">登录</el-button>
        </div>
      </div>
    </div>

    <div class="text-tip">注：密码未做加密处理，请不要使用常用账户、密码</div>
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import { register } from '@/apis/user';
import { ElMessage } from 'element-plus';
import moment from 'moment';

export default {
  setup() {
    const router = useRouter();

    const state = reactive({
      form: {},
    });

    const toPage = (path) => router.push({ path });

    const handleRegister = () => {
      register({
        ...state.form,
        ...{ create_time: moment(new Date()).format('YYYY-MM-DD HH:mm:ss') },
      })
        .then((res) => {
          if (res.data.errorCode === '500_01') {
            ElMessage.warning('请输入用户名和密码！');
          } else if (res.data.errorCode === '500_02') {
            ElMessage.warning('账户信息已存在！');
          } else {
            ElMessage.success('注册成功，请登录！');
            router.push('/login');
          }
        })
        .catch();
    };

    return {
      ...toRefs(state),
      toPage,
      handleRegister,
    };
  },
};
</script>

<style lang="scss">
#register {
  height: 100vh;
  background-color: #3c6af2;
  overflow: hidden;

  h1 {
    text-align: center;
  }

  .register-panel {
    width: 3rem;
    height: 4rem;
    background-color: #dee4fd;
    padding: 0.2rem;
    // border: 1px solid #000;
    border-radius: 0.04rem;
    box-shadow: 0 0 5px #000;
    margin: 1rem auto 0.16rem;
  }

  .register-btn {
    width: 100%;
  }

  .text-tip {
    width: 3.4rem;
    margin: 0 auto;
  }
}
</style>
