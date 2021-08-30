<template>
  <div id="award-record">
    <div>
      <h1 class="title">获奖记录</h1>
      <div class="award-record-item m-b-16" v-for="(item, index) in tableData" :key="index">
        <div class="create-time">
          {{ moment(item.create_time).format('YYYY-MM-DD HH:mm:ss') }}：
        </div>
        <div>恭喜「 {{ item.user_name }} 」获得奖品：「 {{ item.prize_name }} 」</div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, toRefs, watch } from 'vue';
import { getLatestAwardRecord } from '@/apis/awardRecord';
import moment from 'moment';

export default {
  props: {
    latestMessage: Object,
  },
  setup(props) {
    const state = reactive({
      tableData: [],
      pagination: {
        page: 1,
        pageSize: 10,
        total: 0,
      },
    });

    watch(
      () => props.latestMessage,
      (val) => (state.tableData = [props.latestMessage].concat(state.tableData))
    );

    const getWardRecordData = () => {
      getLatestAwardRecord()
        .then((res) => {
          if (res.data.code === 200) {
            state.tableData = res.data.data;
          }
        })
        .catch();
    };

    onMounted(() => {
      getWardRecordData();
    });

    return {
      ...toRefs(state),
      moment,
    };
  },
};
</script>

<style lang="scss" scoped>
#award-record {
  max-width: 3rem;
  height: calc(100vh - 1.32rem);
  background-color: #f2c889;
  overflow: auto;
  padding: 0.16rem;
  border-radius: 0.04rem;
  box-shadow: 0 0 0.15rem #000;
  margin: 0 auto;

  .title {
    margin: 0 0 0.16rem 0;
    text-align: center;
  }

  .award-record-item {
    font-size: 0.12rem;
    .create-time {
      color: #939da8;
      font-size: 0.12rem;
    }
  }
}
</style>
