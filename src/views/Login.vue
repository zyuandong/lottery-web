<template>
  <div id="login">
    <div class="login-panel">
      <h1>登录</h1>
      <el-form
        ref="loginForm"
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
        <el-button size="small" @click="handleLogin"> 登录 </el-button>
        <el-button size="small" @click="toPage('/register')"> 注册 </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import { login } from '@/apis/user';

export default {
  setup() {
    const router = useRouter();

    const state = reactive({
      form: {},
    });

    const toPage = (path) => router.push({ path });

    const handleLogin = () => {
      login(state.form)
        .then(res => console.log(res))
        .catch(() => {})
    };

    return {
      ...toRefs(state),
      toPage,
      handleLogin,
    };
  },
};
</script>

<style lang="scss" scoped>
#login {
  height: 100vh;
  background-color: #ccc;
  overflow: hidden;

  .login-panel {
    width: 3rem;
    height: 4rem;
    background-color: #989898;
    padding: 0.2rem;
    // border: 1px solid #000;
    border-radius: 0.04rem;
    box-shadow: 0 0 5px #000;
    margin: 1rem auto;
  }
}
</style>
