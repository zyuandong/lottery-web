<template>
  <div id="award-record">
    <div>
      <h1 class="title">获奖记录</h1>
      <div
        class="award-record-item m-b-16"
        v-for="(item, index) in tableData"
        :key="index"
      >
        <div class="creat-time">{{ item.create_time }}：</div>
        <div>恭喜「 {{ item.user_name }} 」获得 「 {{ item.prize_name }} 」</div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, reactive, toRefs } from 'vue';
import { getLatestAwardRecord } from '@/apis/awardRecord';

export default {
  setup() {
    const state = reactive({
      tableData: [],
      pagination: {
        page: 1,
        pageSize: 10,
        total: 0,
      },
    });

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
    };
  },
};
</script>

<style lang="scss">
#award-record {
  height: calc(100vh - 1.32rem);
  background-color: #f2c889;
  overflow: auto;
  padding: 0.16rem;
  border-radius: 0.04rem;

  .title {
    margin: 0 0 0.16rem 0;
    text-align: center;
  }

  .award-record-item {
    font-size: 0.12rem;
  }
}
</style>
