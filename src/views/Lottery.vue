<template>
  <div id="lottery">
    <el-row>
      <el-col :sm="20">
        <div class="lottery-panel">
          <div class="lottery-border">
            <el-row class="p-8">
              <el-col :span="8">
                <div class="prize-item item-1 is-active">
                  <img src="../assets/260.jpg" alt="" />
                  <div class="text">Switch</div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="prize-item item-2">
                  <img src="../assets/260.jpg" alt="" />
                  <div class="text">Vue</div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="prize-item item-3">
                  <img src="../assets/260.jpg" alt="" />
                  <!-- <img
                    src="https://i.loli.net/2021/06/03/YNIqRlXbKo6ZEhp.png"
                    alt=""
                  /> -->
                  <div class="text">苹果</div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="prize-item item-4">4</div>
              </el-col>
              <el-col :span="8">
                <div class="btn-lottery" @click="runAnimation()">
                  <div class="text-lottery">抽奖</div>
                  <div class="text">100 金币 / 次</div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="prize-item item-6">6</div>
              </el-col>
              <el-col :span="8">
                <div class="prize-item item-7">7</div>
              </el-col>
              <el-col :span="8">
                <div class="prize-item item-8">8</div>
              </el-col>
              <el-col :span="8">
                <div class="prize-item item-9">9</div>
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
import { ref } from 'vue';
export default {
  setup() {
    const arr = [1, 2, 3, 6, 9, 8, 7, 4];
    let index = 0;
    let timer = null;

    const sendRequest = () => {
      let closeTimer = null;
      setTimeout(() => {
        closeTimer = setInterval(() => {
          if (index = 5) {
            clearInterval(timer);
            timer = null;
          }
        }, 100)
        if (!timer) {
          clearInterval(closeTimer);
        }
      }, 5000)
    };

    const runAnimation = () => {
      console.log(index);
      if (!timer) {
        // sendRequest();
        timer = setInterval(() => {
          document
            .querySelector(`.item-${arr[index]}`)
            .classList.remove('is-active');

          document
            .querySelector(`.item-${arr[index === 7 ? 0 : index + 1]}`)
            .classList.add('is-active');
          index = index === 7 ? 0 : index + 1;
          // console.log(index);
        }, 100);
      } else {
        clearInterval(timer);
        timer = null;
      }
    };

    // setInterval()

    return {
      runAnimation,
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
