<template>
  <div id="lottery">
    <div class="barrage-area">
      <Barrage :message="bulletMessage" />
    </div>
    <el-row>
      <el-col class="m-b-24" :sm="19">
        <div class="message-box">
          当前金币数量：
          <img class="gold-coin" src="@/assets/svg/gold_coin.svg" alt="" />
          x {{ user.gold_coin_num }}
        </div>

        <div class="lottery-panel">
          <div class="lottery-border">
            <el-row class="p-8">
              <el-col v-for="(item, index) in prizePoolData" :key="index" :span="8">
                <div
                  class="btn-lottery"
                  v-if="index === 4"
                  :style="{ height: `${prizeItemHeight}px` }"
                  @click="handleLottery()"
                >
                  <div class="text-lottery">抽奖</div>
                  <div class="text">100 金币 / 次</div>
                </div>

                <div
                  class="prize-item"
                  v-else
                  :style="{ height: `${prizeItemHeight}px` }"
                  :class="[`item-${placeIndexArr[index]}`, { 'is-active': index === 0 }]"
                >
                  <img v-if="item.type === 1" src="@/assets/svg/gold_coin.svg" alt="" />
                  <img
                    v-if="item.type === 2 && item.pic"
                    :src="`/lottery_service_api/${item.pic}`"
                    alt=""
                  />
                  <div class="text" v-if="item">{{ item.name }}</div>
                  <div class="text" v-else>祝你好运</div>
                </div>
              </el-col>
            </el-row>
          </div>
          <div
            class="dot"
            v-for="i in 16"
            :key="i"
            :class="[
              `dot-${i}`,
              { origin: [1, 5, 9, 13].includes(i) },
              { white: [3, 7, 11, 15].includes(i) },
              { 'white-o': [2, 4, 6, 8, 10, 12, 14, 16].includes(i) },
            ]"
          ></div>
        </div>
        <div class="text-tip" v-if="showMessage && probabilityTotal != 1">
          注：当前奖池设置有误，抽奖不扣除金币，获奖结果不做记录。待管理员设置正确之后才能正常使用抽奖功能！
        </div>
      </el-col>
      <el-col :sm="5">
        <AwardRecord :message="latestAwardRecord" />
      </el-col>
    </el-row>

    <el-dialog v-model="dialogLottery" width="300px">
      <template #title>
        中奖信息
      </template>
      <div class="dialog-body">
        <img v-if="prize.type === 1" src="@/assets/svg/gold_coin.svg" alt="">
        <img v-else :src="`/lottery_service_api/${prize.pic}`" alt="">
        <div class="m-b-16">🎉 恭喜你获得奖品：「{{ prize.name }}」</div>
        <el-button size="small" type="primary" @click="dialogLottery = false">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { computed, onBeforeUnmount, onMounted, reactive, ref, toRefs, watch } from 'vue';
import { lottery } from '@/apis/user';
import { getPrizePool } from '@/apis/prize';
import { ElLoading, ElMessage } from 'element-plus';
import AwardRecord from '@/components/AwardRecord.vue';
import Barrage from '@/components/Barrage.vue';
import { useStore } from 'vuex';

export default {
  components: {
    AwardRecord,
    Barrage,
  },
  setup() {
    const store = useStore();

    const state = reactive({
      // user: JSON.parse(sessionStorage.getItem('user')),
      user: computed(() => store.state.user),
      prizePoolData: new Array(9).fill(0),
      showMessage: false,
      bulletMessage: null,
      latestAwardRecord: null,
      dialogLottery: false,
      prize: null
    });

    // index: 抽奖动效所需 index
    let index = ref(0);
    let prizeItemHeight = ref(0);

    const socket = io();
    let interval = null;
    let timeout = null;
    let stopWatch = null;

    let dotAnimationTimer = null;

    // placeIndex => renderIndex
    const renderIndexArr = [0, 1, 2, 5, 8, 7, 6, 3, 4];

    const probabilityTotal = computed(() => {
      let count = 0;
      state.prizePoolData.forEach((item) => {
        if (item && item.probability >= 0) count += Number(item.probability);
      });
      return Math.round(count * 100) / 100;
    });

    const sendRequest = () => {
      // 概率和不等于 1，前端随机出奖，不存储入库。
      if (probabilityTotal.value != 1) {
        const placeIndex = Math.floor(Math.random() * 8);
        return stopAnimation(placeIndex);
      }
      lottery({ ...state.user })
        .then((res) => {
          const { placeIndex, prize } = res.data.data;
          state.prize = prize;

          stopAnimation(placeIndex, prize);
        })
        .catch((err) => {});
    };

    const stopAnimation = (placeIndex, prize) => {
      clearTimeout(timeout);

      timeout = setTimeout(() => {
        stopWatch = watch(
          () => index.value,
          (val) => {
            if (val === placeIndex) {
              clearInterval(interval);
              if (prize && prize.type) {
                // ElMessage.success(`恭喜你获得奖品：「${prize.name}」！`);
                state.dialogLottery = true;
                if (prize.type === 1 && !state.user.is_admin) {
                  state.user.gold_coin_num += prize.number;
                }

                // 发送 socket 消息
                socket.emit('MSG_LOTTERY', {
                  create_time: new Date(),
                  user_name: state.user.name,
                  avatar: state.user.avatar,
                  prize_name: prize.name,
                });
              } else {
                ElMessage.info(`很遗憾，未中奖！`);
              }
              interval = null;
              // stop watch: index.value
              stopWatch();
            }
          }
        );
      }, 5000);
    };

    const startAnimation = (step) => {
      clearInterval(interval);
      interval = setInterval(() => {
        document.querySelector(`.item-${index.value}`).classList.remove('is-active');

        document
          .querySelector(`.item-${index.value === 7 ? 0 : index.value + 1}`)
          .classList.add('is-active');

        index.value = index.value === 7 ? 0 : index.value + 1;
      }, step);
    };

    const handleLottery = () => {
      if (state.user.gold_coin_num < 100) {
        return ElMessage.warning('抱歉，金币数量不足 100，无法参与抽奖！');
      }
      if (!interval) {
        sendRequest();
        if (probabilityTotal.value === 1 && !state.user.is_admin) state.user.gold_coin_num -= 100;
        let step = 250
        let startTime = Date.now();
        startAnimation(200);
        let timer = setInterval(() => {
          startAnimation(step)
          if (Date.now () - startTime < 2500) {
            step = step === 50 ? step : step -= 50
          } else if (Date.now() - startTime > 4000) {
            step = step === 250 ? step : step += 50
          }
        }, 500)

        setTimeout(() => clearInterval(timer), 5000)

        // interval = setInterval(() => {
        //   document.querySelector(`.item-${index.value}`).classList.remove('is-active');

        //   document
        //     .querySelector(`.item-${index.value === 7 ? 0 : index.value + 1}`)
        //     .classList.add('is-active');

        //   index.value = index.value === 7 ? 0 : index.value + 1;
        // }, 100);
      }
    };

    const getPrizePoolData = () => {
      getPrizePool()
        .then((res) => {
          res.data.data.forEach((item) => {
            state.showMessage = true;
            state.prizePoolData[renderIndexArr[item.place_index]] = item;
          });
        })
        .catch((err) => {});
    };

    onMounted(() => {
      getPrizePoolData();

      // 装饰圆点动画
      dotAnimationTimer = setInterval(() => {
        [1, 5, 9, 13].forEach((item) => {
          document.querySelector(`.dot-${item}`).classList.toggle('origin-o');
        });

        [3, 7, 11, 15].forEach((item) => {
          document.querySelector(`.dot-${item}`).classList.toggle('white-o');
        });

        [2, 4, 6, 8, 10, 12, 14, 16].forEach((item) => {
          document.querySelector(`.dot-${item}`).classList.toggle('white-o');
        });
      }, 1000);

      // 方块跟随窗口大小按比例缩放
      const $el = document.querySelector('.prize-item');
      prizeItemHeight.value = Math.round($el.offsetWidth * 70) / 100;

      window.addEventListener('resize', () => {
        prizeItemHeight.value = Math.round($el.offsetWidth * 70) / 100;
      });

      // 登录消息
      socket.on('MSG_LOGIN', (res) => {
        // ElMessage.info(res);
        state.bulletMessage = {
          type: 'MSG_LOGIN',
          data: res,
        };
      });

      // 抽奖消息
      socket.on('MSG_LOTTERY', (res) => {
        // ElMessage.info(res);
        state.bulletMessage = {
          type: 'MSG_LOTTERY',
          data: res,
        };

        // 动态更新获奖记录面板
        state.latestAwardRecord = res;
      });

      // 更新奖池消息
      socket.on('MSG_UPDATE_PRIZE_POOL', (res) => {
        let second = 5;

        const loadingInstance = ElLoading.service({
          target: document.querySelector('#lottery'),
          text: `正在更新奖池，${second}s 后将自动刷新页面`,
        });

        const timer = setInterval(() => {
          second--;
          loadingInstance.setText(`正在更新奖池，${second}s 后将自动刷新页面`);
          if (second === 0) {
            clearInterval(timer);
            loadingInstance.close();
            location.reload();
            // getPrizePoolData()
          }
        }, 1000);
      });
    });

    onBeforeUnmount(() => {
      socket.disconnect();
      clearInterval(dotAnimationTimer);
      dotAnimationTimer = null;
    });

    return {
      ...toRefs(state),
      probabilityTotal,
      placeIndexArr: [0, 1, 2, 7, 8, 3, 6, 5, 4],
      prizeItemHeight,
      handleLottery,
    };
  },
};
</script>

<style lang="scss" scoped>
#lottery {
  margin: -0.2rem;
  padding: 0.2rem;
  background-color: #3b6af1;

  .message-box {
    width: 50%;
    min-width: 3.7rem;
    max-width: 7.5rem;
    color: #fff;
    margin: 0.5rem auto 0.16rem;

    .gold-coin {
      width: 0.2rem;
      vertical-align: sub;
    }
  }
  .text-tip {
    width: 50%;
    min-width: 3.7rem;
    max-width: 7.5rem;
    margin: 0.32rem auto 0;
  }
  .lottery-panel {
    width: 50%;
    min-width: 3.7rem;
    max-width: 7.5rem;
    box-sizing: border-box;
    text-align: center;
    background-color: #f2c889;
    padding: 0.2rem;
    border-radius: 0.04rem;
    box-shadow: 0 0 0.15rem #000;
    margin: 0 auto;
    position: relative;

    .lottery-border {
      background-color: #df7823;
      border-radius: 0.04rem;
    }

    .prize-item,
    .btn-lottery {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      // height: 0;
      background-color: #fff;
      // padding-bottom: 70%;
      border-radius: 0.03rem;
      margin: 0.04rem;
      overflow: hidden;

      &.is-active {
        background-color: #ffcf8f;
      }

      img {
        max-width: 50%;
        max-height: 50%;
      }

      .text {
        color: #df7823;
      }
    }

    .btn-lottery {
      cursor: pointer;
      background-color: #fdebd4;
      box-shadow: 0 0 0.2rem #ff9500 inset;

      .text-lottery {
        font-size: 0.2rem;
      }
    }

    .dot {
      width: 0.1rem;
      height: 0.1rem;
      background-color: #fff;
      border-radius: 50%;
      position: absolute;

      &.dot-1 {
        top: 0.05rem;
        left: 0.05rem;
      }
      &.dot-2 {
        top: 0.05rem;
        left: calc(25% - 0.05rem);
      }
      &.dot-3 {
        top: 0.05rem;
        left: calc(50% - 0.05rem);
      }
      &.dot-4 {
        top: 0.05rem;
        left: calc(75% - 0.05rem);
      }
      &.dot-5 {
        top: 0.05rem;
        right: 0.05rem;
      }
      &.dot-6 {
        top: calc(25% - 0.05rem);
        right: 0.05rem;
      }
      &.dot-7 {
        top: calc(50% - 0.05rem);
        right: 0.05rem;
      }
      &.dot-8 {
        top: calc(75% - 0.05rem);
        right: 0.05rem;
      }
      &.dot-9 {
        right: 0.05rem;
        bottom: 0.05rem;
      }
      &.dot-10 {
        right: calc(25% - 0.05rem);
        bottom: 0.05rem;
      }
      &.dot-11 {
        right: calc(50% - 0.05rem);
        bottom: 0.05rem;
      }
      &.dot-12 {
        right: calc(75% - 0.05rem);
        bottom: 0.05rem;
      }
      &.dot-13 {
        left: 0.05rem;
        bottom: 0.05rem;
      }
      &.dot-14 {
        left: 0.05rem;
        bottom: calc(25% - 0.05rem);
      }
      &.dot-15 {
        left: 0.05rem;
        bottom: calc(50% - 0.05rem);
      }
      &.dot-16 {
        left: 0.05rem;
        bottom: calc(75% - 0.05rem);
      }

      &.origin {
        background-color: #df7823;
      }
      &.origin-o {
        width: 0.08rem;
        height: 0.08rem;
        background-color: transparent;
        border: 1px solid #df7823;
      }
      &.white {
        background-color: #fff;
      }
      &.white-o {
        width: 0.08rem;
        height: 0.08rem;
        background-color: transparent;
        border: 1px solid #fff;
      }
    }
  }
  .award-record-panel {
    border: 1px solid #ccc;
  }

  .barrage-area {
    height: 2rem;
    // background-color: rgba(0, 0, 0, 0.2);
    overflow: hidden;
    position: absolute;
    top: 0.6rem;
    left: 0;
    right: 0;
  }

  .dialog-body {
    text-align: center;

    img {
      max-width: 50%;
      max-height: 50%;
    }
  }
}
</style>
