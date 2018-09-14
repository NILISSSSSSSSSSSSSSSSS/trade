<template>
  <div class="header">
    <i class="iconfont icons" :class="icon"></i>
    <span class="title" :title="title">{{title}}</span>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    icon: {
      type: String
      // required: true
    }
  }
}
</script>

<style lang="scss" scoped>
  .header{
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    .icons{
      @include fontsize("title1");
      margin-right: 5px;
      @include phone {
        display: none;
      }
    }
    .title{
      @include phone {
        display: none;
      }
      @include fontsize("title2");
      color: $font-color2;
      letter-spacing: 0;
      padding-left: 0;
      line-height: 1;
      font-family: $font-medium;
      // font-weight: normal;
    }
  }
</style>
