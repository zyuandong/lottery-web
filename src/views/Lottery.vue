<template>
  <div id="lottery">
    <el-row>
      <el-col :sm="19">
        <div class="message-box">
          当前金币数量：
          <img class="gold-coin" src="/lottery_service_api/images/gold_coin.svg" alt="" />
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
                  <img
                    v-if="item.type === 1"
                    src="/lottery_service_api/images/gold_coin.svg"
                    alt=""
                  />
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
        </div>
        <div class="text-tip" v-if="showMessage && probabilityTotal != 1">
          注：当前奖池设置有误，抽奖不扣除金币，获奖结果不做记录。待管理员设置正确之后才能正常使用抽奖功能！
        </div>
      </el-col>
      <el-col :sm="5">
        <AwardRecord :latestMessage="latestMessage" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { computed, onBeforeUnmount, onMounted, reactive, ref, toRefs, watch } from 'vue';
import { lottery } from '@/apis/user';
import { getPrizePool } from '@/apis/prize';
import { ElMessage } from 'element-plus';
import AwardRecord from '@/components/AwardRecord.vue';

export default {
  components: {
    AwardRecord,
  },
  setup() {
    const state = reactive({
      user: JSON.parse(sessionStorage.getItem('user')),
      prizePoolData: new Array(9).fill(0),
      showMessage: false,
      latestMessage: null,
    });

    let index = ref(0);
    let prizeItemHeight = ref(0);

    let interval = null;
    let timeout = null;
    let stopWatch = null;
    const socket = io();

    // placeIndex => renderIndex
    const renderIndexArr = [0, 1, 2, 5, 8, 7, 6, 3, 4];

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
        return stopAnimation(placeIndex);
      }
      lottery({ ...state.user })
        .then((res) => {
          const { placeIndex, prize } = res.data.data;

          stopAnimation(placeIndex, prize);
        })
        .catch();
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
                ElMessage.success(`恭喜，「${state.user.name}」获得奖品「${prize.name}」！`);
                if (prize.type === 1 && !state.user.is_admin) {
                  state.user.gold_coin_num += prize.number;
                }

                // 动态更新获奖记录面板
                state.latestMessage = {
                  create_time: new Date(),
                  user_name: state.user.name,
                  prize_name: prize.name,
                };

                // 发送 socket 消息
                socket.emit(
                  'MSG_LOTTERY',
                  `恭喜，「${state.user.name}」获得奖品「${prize.name}」！`
                );
              }
              interval = null;
              // stop watch: index.value
              stopWatch();
            }
          }
        );
      }, 1000);
    };

    const handleLottery = () => {
      if (state.user.gold_coin_num < 100) {
        return ElMessage.warning('抱歉，金币数量不足 100，无法参与抽奖！');
      }
      if (!interval) {
        sendRequest();
        if (probabilityTotal.value === 1 && !state.user.is_admin) state.user.gold_coin_num -= 100;
        interval = setInterval(() => {
          document.querySelector(`.item-${index.value}`).classList.remove('is-active');

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
            state.showMessage = true;
            state.prizePoolData[renderIndexArr[item.place_index]] = item;
          });
        })
        .catch();
    };

    onMounted(() => {
      getPrizePoolData();

      const $el = document.querySelector('.prize-item');
      prizeItemHeight.value = Math.round($el.offsetWidth * 70) / 100;

      window.addEventListener('resize', () => {
        prizeItemHeight.value = Math.round($el.offsetWidth * 70) / 100;
      });

      socket.on('MSG_LOGIN', (res) => {
        ElMessage.info(res);
      });
      socket.on('MSG_LOTTERY', (res) => {
        ElMessage.info(res);
      });
      socket.on('MSG_UPDATE_PRIZE_POOL', (res) => {
        console.log('io', res);
        ElMessage.info(res);
      });
    });

    onBeforeUnmount(() => {
      socket.disconnect();
    })

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
    padding: 0.16rem;
    border-radius: 0.04rem;
    box-shadow: 0 0 0.15rem #000;
    margin: 0 auto;

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

      .text-lottery {
        font-size: 0.2rem;
      }
    }
  }
  .award-record-panel {
    border: 1px solid #ccc;
  }
}
</style>
