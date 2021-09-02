<template>
  <el-card id="user-award-record">
    <template #header>
      <span>个人获奖记录</span>
    </template>
    <div class="award-record-body">
      <div class="item m-b-16" v-for="(item, index) in data" :key="index">
        <div class="create-time">{{ moment(item.create_time).format('YYYY-MM-DD HH:mm:ss') }}</div>
        <div class="prize">{{ item.prize_name }}</div>
      </div>
      <div v-if="!data.length">暂无数据</div>
    </div>
  </el-card>
</template>

<script>
import { computed, onMounted, reactive, toRefs } from 'vue';
import { getUserAwardRecord } from '@/apis/awardRecord';
import moment from 'moment';
import { useStore } from 'vuex';

export default {
  setup() {
    const store = useStore();

    const state = reactive({
      data: [],
      user: computed(() => store.state.user),
    });

    // const user = JSON.parse(sessionStorage.getItem('user'));

    const getUserAwardRecordData = () => {
      getUserAwardRecord({ oid: state.user.oid }).then((res) => {
        if (res.data.code === 200) {
          state.data = res.data.data;
        }
      });
    };

    onMounted(() => {
      getUserAwardRecordData();
    });

    return {
      ...toRefs(state),
      moment,
    };
  },
};
</script>

<style lang="scss">
#user-award-record {
  max-height: calc(100vh - 1.1rem);
  overflow: auto;
  text-align: center;

  .award-record-body {
    text-align: left;
  }

  .item {
    font-size: 0.12rem;
    .create-time {
      color: #939da8;
      font-size: 0.12rem;
    }
  }
}
</style>
