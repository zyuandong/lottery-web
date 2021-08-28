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
          <el-input v-model="form.password" type="password" placeholder="密码"></el-input>
        </el-form-item>
      </el-form>

      <div class="btn-box">
        <el-button size="small" @click="handleLogin"> 登录 </el-button>
        <el-button size="small" @click="toPage('/register')"> 注册 </el-button>
      </div>

      <!-- <router-link to="/lottery">lottery</router-link> -->
    </div>

    <div class="text-tip">注：密码未做加密处理，请不要使用常用账户、密码</div>
  </div>
</template>

<script>
import { reactive, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { login } from '@/apis/user';

export default {
  setup() {
    const router = useRouter();

    const state = reactive({
      form: {
        name: 'admin',
        password: '123456',
      },
    });

    const toPage = (path) => router.push({ path });

    const handleLogin = () => {
      login(state.form)
        .then((res) => {
          if (res.data.code === 200) {
            if (res.data.data.length === 1) {
              const user = res.data.data[0];
              sessionStorage.setItem('user', JSON.stringify(user));
              ElMessage.success('登录成功');
              router.push({ path: '/lottery' });
            } else {
              ElMessage.error('用户名或密码错误！');
            }
          }
        })
        .catch(() => {});
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
  background-color: #3C6AF2;
  overflow: hidden;

  h1 {
    text-align: center;
  }

  .login-panel {
    width: 3rem;
    height: 4rem;
    background-color: #DEE4FD;
    padding: 0.2rem;
    // border: 1px solid #000;
    border-radius: 0.04rem;
    box-shadow: 0 0 5px #000;
    margin: 1rem auto 0.16rem;
  }

  .text-tip {
    width: 3.4rem;
    margin: 0 auto;
  }
}
</style>
