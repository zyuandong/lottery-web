<template>
  <div id="login">
    <div class="login-panel">
      <h1>登录</h1>
      <el-form
        ref="loginForm"
        label-position="top"
        label-width="60px"
        :model="form"
        :rules="rules"
        @keyup.enter="handleLogin"
      >
        <el-form-item label="" prop="name">
          <el-input v-model="form.name" placeholder="用户名"></el-input>
        </el-form-item>

        <el-form-item label="" prop="password">
          <el-input v-model="form.password" type="password" placeholder="密码"></el-input>
        </el-form-item>
      </el-form>

      <div class="btn-box">
        <el-button size="small" type="primary" @click="handleLogin"> 登录 </el-button>
        <el-button size="small" @click="toPage('/register')"> 注册 </el-button>
      </div>

      <!-- <router-link to="/lottery">lottery</router-link> -->
    </div>

    <div class="text-tip">注：密码未做加密处理，请不要使用常用账户、密码</div>
  </div>
</template>

<script>
import { reactive, ref, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import { login } from '@/apis/user';

export default {
  setup() {
    const router = useRouter();

    const state = reactive({
      loginForm: null,
      form: {
        name: '',
        password: '',
      },
      rules: {
        name: [{ required: true, message: '请填写用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请填写密码', trigger: 'blur' }],
      },
    });

    const socket = io();

    const toPage = (path) => router.push({ path });

    const handleLogin = () => {
      state.loginForm.validate((valid) => {
        if (valid) {
          login(state.form)
            .then((res) => {
              if (res.data.code === 200) {
                if (res.data.data.length === 1) {
                  const user = res.data.data[0];
                  sessionStorage.setItem('user', JSON.stringify(user));
                  ElMessage.success('登录成功');
                  socket.emit('MSG_LOGIN', `用户「${user.name}」上线了！`);

                  router.push({ path: '/lottery' });
                } else {
                  ElMessage.error('用户名或密码错误！');
                }
              } else if (res.data.errorCode === '500_01') {
                ElMessage.warning('请输入用户名和密码！');
              }
            })
            .catch(() => {});
        }
      });
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
  background-color: #3c6af2;
  overflow: hidden;

  h1 {
    text-align: center;
  }

  .login-panel {
    width: 3rem;
    height: 4rem;
    background-color: #dee4fd;
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
