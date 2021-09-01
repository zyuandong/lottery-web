<template>
  <div id="page-404">
    <div class="text-404">404 - Page Not Found</div>
    <div class="m-t-24">Back to <router-link to="/lottery">Lottery</router-link></div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
#page-404 {
  text-align: center;
  margin-top: calc(100vh / 5);

  .text-404 {
    font-size: 0.4rem;
  }
}
</style>
