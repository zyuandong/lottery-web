<template>
  <div id="register">
    <div class="register-panel">
      <h1>注册</h1>
      <el-form
        ref="registerForm"
        label-position="top"
        label-width="60px"
        :model="form"
      >
        <el-form-item label="">
          <el-input v-model="form.name" placeholder="用户名"></el-input>
        </el-form-item>

        <el-form-item label="">
          <el-input v-model="form.password" placeholder="密码"></el-input>
        </el-form-item>
      </el-form>

      <div class="btn-box">
        <el-button class="register-btn" size="small" @click="handleRegister">
          注册
        </el-button>
        <div class="m-t-8">
          已有账号，去 <router-link to="/login">登录</router-link>
        </div>
      </div>
      <!-- <div class="btn-box">
        <span>已有账号，去 <router-link to="/login">登录</router-link></span>
      </div> -->
    </div>
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import { register } from '@/apis/user';
import { ElMessage } from 'element-plus';

export default {
  setup() {
    const router = useRouter();

    const state = reactive({
      form: {},
    });

    const toPage = (path) => router.push({ path });

    const handleRegister = () => {
      register(state.form)
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
  background-color: #ccc;
  overflow: hidden;

  .register-panel {
    width: 3rem;
    height: 4rem;
    background-color: #989898;
    padding: 0.2rem;
    // border: 1px solid #000;
    border-radius: 0.04rem;
    box-shadow: 0 0 5px #000;
    margin: 1rem auto;
  }

  .register-btn {
    width: 100%;
  }
}
</style>
