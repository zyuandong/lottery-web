<template>
  <div id="lottery">
    <el-row>
      <el-col :sm="20">
        <div>金币数量：{{ user.gold_coin_num }}</div>
        <!-- <div>{{ probabilityTotal }}</div> -->
        <div class="lottery-panel">
          <div class="lottery-border">
            <el-row class="p-8">
              <el-col
                v-for="(item, index) in prizePoolData"
                :key="index"
                :span="8"
              >
                <div
                  class="btn-lottery"
                  v-if="index === 4"
                  @click="handleLottery()"
                >
                  <div class="text-lottery">抽奖</div>
                  <div class="text">100 金币 / 次</div>
                </div>

                <div
                  class="prize-item"
                  v-else
                  :class="[
                    `item-${placeIndexArr[index]}`,
                    { 'is-active': index === 0 },
                  ]"
                >
                  <!-- <img src="../assets/260.jpg" alt="" /> -->
                  <div class="text" v-if="item">{{ item.name }}</div>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
      <el-col :sm="4">
        <!-- <div class="award-record-panel">记录</div> -->
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { computed, onMounted, reactive, ref, toRefs, watch } from 'vue';
import { lottery } from '@/apis/user';
import { getPrizePool } from '@/apis/prize';

export default {
  setup() {
    const state = reactive({
      user: JSON.parse(sessionStorage.getItem('user')),
      prizePoolData: new Array(9).fill(0),
    });

    // const arr = [1, 2, 3, 6, 9, 8, 7, 4];
    // const placeIndexArr = [0, 1, 2, 7, 8, 3, 6, 5, 4];
    let index = ref(0);
    let interval = null;
    let timeout = null;
    let stopWatch = null;

    const probabilityTotal = computed(() => {
      let count = 0;
      state.prizePoolData.forEach((item) => {
        if (item && item.probability >= 0) count += Number(item.probability);
      });
      return count;
    });

    const sendRequest = () => {
      // 概率和不等于 1，前端随机出奖，不存储入库。
      if (probabilityTotal.value != 1) {
        const placeIndex = Math.floor(Math.random() * 8);
        return stopAnimation(placeIndex)
      }
      lottery({ ...state.user })
        .then((res) => {
          const placeIndex = res.data.data;

          stopAnimation(placeIndex)
        })
        .catch();
    };

    const stopAnimation = (placeIndex) => {
      clearTimeout(timeout);

      timeout = setTimeout(() => {
        stopWatch = watch(
          () => index.value,
          (val) => {
            if (val === placeIndex) {
              clearInterval(interval);
              interval = null;
              // stop watch: index.value
              stopWatch();
            }
          }
        );
      }, 1000);
    };

    const handleLottery = () => {
      if (!interval) {
        sendRequest();
        interval = setInterval(() => {
          document
            .querySelector(`.item-${index.value}`)
            .classList.remove('is-active');

          document
            .querySelector(`.item-${index.value === 7 ? 0 : index.value + 1}`)
            .classList.add('is-active');

          index.value = index.value === 7 ? 0 : index.value + 1;
        }, 100);
      }
    };

    const getPrizePoolData = () => {
      getPrizePool()
        .then((res) => {
          res.data.data.forEach((item) => {
            state.prizePoolData[item.place_index] = item;
          });
        })
        .catch();
    };

    onMounted(() => {
      getPrizePoolData();
    });

    return {
      ...toRefs(state),
      probabilityTotal,
      placeIndexArr: [0, 1, 2, 7, 8, 3, 6, 5, 4],
      handleLottery,
    };
  },
};
</script>

<style lang="scss" scoped>
#lottery {
  .lottery-panel {
    width: 50%;
    min-width: 3.7rem;
    text-align: center;
    background-color: #f2c889;
    padding: 0.16rem;
    border-radius: 0.04rem;
    margin: 0.5rem auto;

    .lottery-border {
      background-color: #df7823;
      border-radius: 0.04rem;
    }

    .prize-item,
    .btn-lottery {
      height: 0;
      background-color: #fff;
      padding-bottom: 70%;
      border-radius: 0.03rem;
      margin: 0.04rem;
      overflow: hidden;

      &.is-active {
        background-color: #ffcf8f;
      }

      img {
        max-width: 50%;
        max-height: 0.6rem;
        margin: 18% auto 0.08rem;
      }

      .text {
        color: #df7823;
      }
    }

    .btn-lottery {
      background-color: #fdebd4;

      .text-lottery {
        margin-top: calc(35% - 0.19rem);
      }
    }
  }
  .award-record-panel {
    border: 1px solid #ccc;
  }
}
</style>
