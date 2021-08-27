<template>
  <div id="prize-pool">
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
              ></el-input>
            </div>
          </el-col>
        </el-row>
      </div>
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
import { onMounted, reactive, ref, toRefs } from 'vue';
import { getPrizePool, setPrizePool } from '@/apis/prize';
import SelectPrize from './components/SelectPrize.vue';
import { ElMessage } from 'element-plus';

export default {
  components: {
    SelectPrize,
  },
  setup() {
    const state = reactive({
      prizePoolData: new Array(9).fill(0),
      dialogSelectPrize: false,
    });

    const placeIndex = ref(0);

    const getPrizePoolData = () => {
      getPrizePool()
        .then((res) => {
          // console.log(res.data);
          res.data.data.forEach((item) => {
            state.prizePoolData[item.place_index] = item;
          });
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
      setPrizePool({
        ...obj,
        ...{ is_active: 0, probability: 0 },
      })
        .then((res) => {
          if (res.data.code === 200) {
            ElMessage.success('删除成功，请添加其他奖品！');
            state.prizePoolData[obj.place_index] = 0;
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
      handleDelete,
      handleAdd,
      handleSetPrizePool,
    };
  },
};
</script>

<style></style>

<style lang="scss">
#prize-pool {
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
}
</style>
