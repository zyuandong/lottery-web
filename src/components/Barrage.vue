<template>
  <div id="barrage">
    <!-- <span class="barrage-item lottery"> xx「xxx」xx 「xxx」 </span> -->
  </div>
</template>

<script>
import { onMounted, watch } from 'vue';

export default {
  props: {
    message: Object,
  },
  setup(props) {
    let $barrage = null;

    onMounted(() => {
      $barrage = document.querySelector('#barrage');
    });

    watch(
      () => props.message,
      (val) => {
        // 创建弹幕并生成随机高度
        const R = Math.floor(Math.random() * 170);
        const $el = document.createElement('span');
        $el.setAttribute('style', `top: ${R}px`);

        // 用户头像
        const { avatar } = val.data;
        const $avatar = document.createElement('img');
        $avatar.classList.add('avatar');
        $avatar.src = `/lottery_service_api/${avatar}`;

        // 文字内容
        const $text = document.createElement('span');

        if (val.type === 'MSG_LOGIN') {
          const { name } = val.data;

          $el.classList.add('barrage-item', 'login');
          $el.append($avatar);

          $text.innerText = `「${name}」上线了！`;
          $el.append($text);
        } else {
          const { user_name, prize_name } = val.data;

          $el.classList.add('barrage-item', 'lottery');
          $el.append($avatar);

          $text.innerText = `恭喜「${user_name}」获得奖品：「${prize_name}」！`;
          $el.append($text);
        }
        $barrage.append($el);
      }
    );

    return {};
  },
};
</script>

<style lang="scss">
#barrage {
  width: 200vw;
  height: 2rem;
  position: absolute;
  right: -50vw;

  .barrage-item {
    display: flex;
    align-items: center;
    color: rgba(255, 255, 255, 0.7);
    background-color: rgba(0, 0, 0, 0.3);
    padding: 0.04rem;
    border-radius: 0.5rem;
    position: absolute;
    z-index: 1;

    animation: bullet 1 20s ease-out;
    -webkit-animation: bullet 1 20s ease-out;

    &.lottery {
      background-color: rgba(223, 120, 35, 0.7);
    }

    .avatar {
      width: 0.28rem;
      height: 0.28rem;
      border-radius: 50%;
      margin-right: 0.08rem;
    }
  }
}

@keyframes bullet {
  0% {
    right: 0;
  }
  100% {
    right: 100%;
    display: none;
  }
}

@-webkit-keyframes bullet {
  0% {
    right: 0;
  }
  100% {
    right: 100%;
    display: none;
  }
}
</style>
