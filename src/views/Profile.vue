<template>
  <div id="profile">
    <el-row :gutter="18">
      <el-col :sm="19">
        <el-card class="profile-panel">
          <div class="avatar-box m-b-16">
            <el-avatar :src="`lottery_service_api/${user.avatar}`"></el-avatar>
          </div>
          <el-button size="small" type="primary">更换头像</el-button>
        </el-card>
      </el-col>
      <el-col :sm="5">
        <UserAwardRecord />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import UserAwardRecord from '@/components/UserAwardRecord.vue';
import { reactive, toRefs } from '@vue/reactivity';

export default {
  components: {
    UserAwardRecord,
  },
  setup() {
    const state = reactive({
      user: JSON.parse(sessionStorage.getItem('user')),
    });

    return {
      ...toRefs(state),
    };
  },
};
</script>

<style lang="scss">
#profile {
  .profile-panel {
    height: calc(100vh - 1rem);

    .el-avatar {
      width: 2rem;
      height: 2rem;
    }
    // width: 50%;
    text-align: center;
    margin: 0 auto;
  }
}
</style>
