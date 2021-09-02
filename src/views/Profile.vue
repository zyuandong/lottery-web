<template>
  <div id="profile">
    <el-row :gutter="18">
      <el-col :sm="19">
        <el-card class="profile-panel">
          <div class="avatar-box m-b-16">
            <el-avatar :src="newAvatar" v-if="showNewAvatar"></el-avatar>
            <!-- <img :src="newAvatar" alt=""> -->
            <el-avatar
              :src="`lottery_service_api/${user.avatar}`"
              :class="{ 'old-avatar': showNewAvatar }"
            ></el-avatar>
          </div>
          <!-- <el-button size="small" type="primary">更换头像</el-button> -->
          <el-upload
            action="#"
            :auto-upload="false"
            :show-file-list="false"
            :on-change="handleChange"
          >
            <el-button size="small" type="primary" v-if="!showNewAvatar">更换头像</el-button>
          </el-upload>

          <div class="bnt-box" v-if="showNewAvatar">
            <el-button size="small" @click="handleCancel">取消</el-button>
            <el-button size="small" type="primary" @click="handleSubmit">确定</el-button>
          </div>
        </el-card>
      </el-col>
      <el-col :sm="5">
        <UserAwardRecord />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { computed, reactive, ref, toRefs } from 'vue';
import UserAwardRecord from '@/components/UserAwardRecord.vue';
import { uploadAvatar } from '@/apis/user';
import { ElMessage } from 'element-plus';
import { useStore } from 'vuex';

export default {
  components: {
    UserAwardRecord,
  },
  setup() {
    const store = useStore();

    const state = reactive({
      // user: JSON.parse(sessionStorage.getItem('user')),
      user: computed(() => store.state.user),
      showNewAvatar: false,
    });

    let newAvatar = ref('');
    let formData = new FormData();

    // const user = computed(() => store.state.user);

    const handleChange = (file) => {
      formData.append('file', file.raw);

      state.showNewAvatar = true;
      newAvatar.value = URL.createObjectURL(file.raw);
    };

    const handleCancel = () => {
      state.showNewAvatar = false;
    };

    const handleSubmit = () => {
      formData.append('oid', state.user.oid);

      uploadAvatar(formData)
        .then((res) => {
          if (res.data.code === 200) {
            state.showNewAvatar = false;
            state.user.avatar = res.data.data;
            // console.log('===user', user);
            // sessionStorage.setItem('user', JSON.stringify(state.user));
            store.dispatch('updateUser', state.user);
            ElMessage.success('更新头像成功！');
          }
        })
        .catch();
    };

    return {
      ...toRefs(state),
      newAvatar,
      handleChange,
      handleCancel,
      handleSubmit,
    };
  },
};
</script>

<style lang="scss">
#profile {
  min-width: 2.8rem;
  .profile-panel {
    height: calc(100vh - 1.1rem);

    .el-avatar {
      width: 2rem;
      height: 2rem;

      &.old-avatar {
        width: 0.5rem;
        height: 0.5rem;
      }
    }
    // width: 50%;
    text-align: center;
    margin: 0 auto;
  }
}
</style>
