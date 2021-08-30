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
        const R = Math.floor(Math.random() * 170);
        const $el = document.createElement('span');
        $el.innerText = val.message;
        $el.setAttribute('style', `top: ${R}px`);
        val.type === 'MSG_LOGIN'
          ? $el.classList.add('barrage-item', 'login')
          : $el.classList.add('barrage-item', 'lottery');
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
    color: rgba(255, 255, 255, 0.7);
    display: inline-block;
    padding: 0.04rem 0.08rem;
    background-color: rgba(0, 0, 0, 0.3);
    border-radius: 0.5rem;
    position: absolute;
    z-index: 1;

    animation: bullet infinite 15s ease-out;
    -webkit-animation: bullet infinite 15s ease-out;

    &.lottery {
      background-color: rgba(223, 120, 35, 0.7);
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
