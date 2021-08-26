<template>
  <div id="set-prize-pools">
    <div class="lottery-panel">
      <div class="lottery-border">
        <el-row class="p-8">
          <el-col v-for="(item, index) in prizePools" :key="index" :span="8">
            <div class="btn-lottery" v-if="index === 4"></div>
            <div class="prize-item" v-else>
              <el-button type="text" size="mini" v-if="!item">添加</el-button>
              <el-button
                type="text"
                size="mini"
                class="text-error"
                v-else
                @click="handleDelete(item)"
              >
                删除
              </el-button>
              <div class="text" v-if="!item">再接再厉</div>
              <div class="text" v-else>{{ item.name }}</div>
              <el-input size="mini" placeholder="概率"></el-input>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>

    <!-- <pre>{{ prizePools }}</pre> -->

  </div>
</template>

<script>
import { onMounted, reactive, toRefs } from 'vue';
import { getPrizePools } from '@/apis/prize';

export default {
  setup() {
    const state = reactive({
      prizePools: new Array(9).fill(0),
    });

    const getPrizesPoolsData = () => {
      getPrizePools()
        .then((res) => {
          // console.log(res.data);
          res.data.data.forEach((item) => {
            state.prizePools[item.place_index] = item;
          });
        })
        .catch();
    };

    const handleDelete = (obj) => {
      console.log(obj);
    };

    onMounted(() => {
      getPrizesPoolsData();
    });

    return {
      ...toRefs(state),
      handleDelete,
    };
  },
};
</script>

<style></style>

<style lang="scss">
#set-prize-pools {
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
