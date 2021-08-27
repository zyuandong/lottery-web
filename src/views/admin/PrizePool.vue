<template>
  <div id="prize-pool">
    <div v-if="showMessage">
      <el-alert
        v-if="probabilityTotal === 1"
        type="success"
        title="当前奖池设置符合要求，抽奖功能可以正常使用。"
        :closable="false"
      ></el-alert>

      <el-alert
        v-else
        type="error"
        title="警告：当前奖池设置不符合「注意事项」中的两个要求，抽奖结果将不会被统计。"
        :closable="false"
      ></el-alert>

      <div class="text-error m-t-8" v-if="probabilityTotal != 1">
        当前概率总和为：{{ probabilityTotal }}
      </div>
    </div>

    <div class="lottery-panel">
      <div class="lottery-border">
        <el-row class="p-8">
          <el-col v-for="(item, index) in prizePoolData" :key="index" :span="8">
            <div class="btn-lottery" v-if="index === 4"></div>
            <div class="prize-item" v-else>
              <el-button
                type="text"
                size="mini"
                v-if="!item"
                @click="handleAdd(index)"
              >
                添加
              </el-button>
              <el-button
                type="text"
                size="mini"
                class="text-error"
                v-else
                @click="handleDelete(item)"
              >
                删除
              </el-button>
              <div class="text" v-if="item">{{ item.name }}</div>
              <el-input
                class="m-t-4"
                size="mini"
                placeholder="概率"
                v-model="item.probability"
                v-if="item"
                @change="handleChangeProbability(item)"
              ></el-input>
              <div class="text-error" v-if="item.probability < 0">
                概率不能小于 0
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

    <div class="text-tip">
      <div class="m-b-16">注意事项：</div>
      <div>设置奖池必须满足以下两个要求：</div>
      <ul>
        <li>所有奖品的概率总和为 1</li>
        <li>奖品的概率最小为 0，不能设置为负数</li>
      </ul>
    </div>

    <el-dialog
      v-model="dialogSelectPrize"
      title="选择奖品"
      :close-on-click-modal="false"
    >
      <SelectPrize
        v-if="dialogSelectPrize"
        @selectPrize="handleSetPrizePool"
        @close="dialogSelectPrize = false"
      />
    </el-dialog>
  </div>
</template>

<script>
import { computed, onMounted, reactive, ref, toRefs } from 'vue';
import { getPrizePool, setPrizePool } from '@/apis/prize';
import SelectPrize from './components/SelectPrize.vue';
import { ElMessage, ElMessageBox } from 'element-plus';

export default {
  components: {
    SelectPrize,
  },
  setup() {
    const state = reactive({
      prizePoolData: new Array(9).fill(0),
      dialogSelectPrize: false,
      showMessage: false,
    });

    const placeIndex = ref(0);

    const probabilityTotal = computed(() => {
      let count = 0;
      state.prizePoolData.forEach((item) => {
        if (item && item.probability >= 0) count += Number(item.probability);
      });
      return count;
    });

    const getPrizePoolData = () => {
      getPrizePool()
        .then((res) => {
          res.data.data.forEach((item) => {
            state.prizePoolData[item.place_index] = item;
          });
          state.showMessage = true;
        })
        .catch();
    };

    const handleAdd = (index) => {
      state.dialogSelectPrize = true;
      placeIndex.value = index;
    };

    const handleSetPrizePool = (obj) => {
      setPrizePool({
        ...obj,
        ...{ is_active: 1, place_index: placeIndex.value },
      })
        .then((res) => {
          if (res.data.code === 200) {
            ElMessage.success('设置成功！');
            state.dialogSelectPrize = false;
            getPrizePoolData();
          }
        })
        .catch();
    };

    const handleDelete = (obj) => {
      // console.log(obj);
      ElMessageBox.confirm('请确定是否删除此项设置！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        setPrizePool({
          ...obj,
          ...{ is_active: 0, probability: 0 },
        })
          .then((res) => {
            if (res.data.code === 200) {
              ElMessage.success('删除成功！');
              state.prizePoolData[obj.place_index] = 0;
              getPrizePoolData();
            }
          })
          .catch();
      });
    };

    const handleChangeProbability = (obj) => {
      if (obj.probability < 0) return;
      setPrizePool(obj)
        .then((res) => {
          if (res.data.code === 200) {
            ElMessage.success(`「${obj.name}」的获奖概率修改成功！`);
            getPrizePoolData();
          }
        })
        .catch();
    };

    onMounted(() => {
      getPrizePoolData();
    });

    return {
      ...toRefs(state),
      probabilityTotal,
      handleDelete,
      handleAdd,
      handleSetPrizePool,
      handleChangeProbability,
    };
  },
};
</script>

<style lang="scss">
#prize-pool {
  .lottery-panel {
    width: 50%;
    min-width: 3.7rem;
    text-align: center;
    background-color: #f2c889;
    padding: 0.16rem;
    border-radius: 0.04rem;
    margin: 0.32rem auto 0.16rem;

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

      img {
        max-width: 50%;
        max-height: 0.6rem;
        margin: 18% auto 0.08rem;
      }

      .text {
        color: #df7823;
      }

      .el-input {
        width: 60%;
      }
    }

    .btn-lottery {
      background-color: #fdebd4;

      .text-lottery {
        margin-top: calc(35% - 0.19rem);
      }
    }
  }

  .text-tip {
    width: 50%;
    margin: 0 auto;
  }
}
</style>
