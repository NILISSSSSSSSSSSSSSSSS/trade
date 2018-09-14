<template>
  <div class="adver-title">
    <h3 class="h3-title">
      <i class="iconfont icons" :class="icon"></i>
      {{title}}
    </h3>
    <div class="button">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    icon: String
  }
};
</script>

<style lang="scss" scoped>
.adver-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .button {
    width: 120px;
    text-align: right;
  }
}
.h3-title {
  margin: 0;
}
.icons {
  font-size: 20px;
}
</style>
