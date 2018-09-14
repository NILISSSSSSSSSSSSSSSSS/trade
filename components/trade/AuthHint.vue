<template>
  <div class="auth-hint">
    <p class="title">认证须知：</p>
    <p class="p1">1.卡内必须有足够的USDT</p>
    <p class="p1">2.实名认证</p>
    <p class="p1">3.支付方式绑定</p>
    <p class="p1">4.绑定手机号</p>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.title {
  @include fontsize("content3");
  color: $font-color2;
}
.p1 {
  @include fontsize("small");
  color: $font-color3;
  margin: 6px 0;
}
</style>
