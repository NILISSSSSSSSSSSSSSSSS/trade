<template>
  <div class="marqueen-page">
    <ul class="marqueen-header">
      <li class="h-item">{{$t('c2c.merchant')}}</li>
      <li class="h-item">{{$t('c2c.dealAmount')}}</li>
      <li class="h-item">{{$t('common.type')}}</li>
      <li class="h-item">{{$t('common.status')}}</li>
    </ul>
    <div class="marquee-content" id="marquee-content">
      <ul class="con1" id="con1">
        <slot></slot>
      </ul>
    </div>
  </div>

</template>

<script>
export default {
  props: {
    speed: {
      type: Number,
      default: 50
    }
  },
  data() {
    return {
      timmer: null
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.timmer = setInterval(() => {
        this.scrollUp();
      }, this.speed);
    })
  },
  destroyed() {
    clearInterval(this.timmer);
  },
  methods: {
    scrollUp() {
      const box = document.querySelector("#marquee-content");
      const con1 = document.querySelector("#con1");
      if (box.scrollTop >= con1.scrollHeight) {
        box.scrollTop = 0;
      } else {
        box.scrollTop++;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.marqueen-page{
    width: 100%;
    margin: 0;
    overflow: hidden;
    color: #d14a4a;
  border: 1px solid $table-header-color;
}
.marqueen-header {
    // display: flex;
    background-color: $table-header-color;
    font-weight: 600;
    color: $font-color3;
    width: 100%;
    height: 32px;
    .h-item {
        float: left;
        width: 20%;
        text-align: center;
        &:nth-of-type(2) {
          width: 40%;
        }
    }
    li {
      list-style: none!important;
      height: 32px;
      line-height: 32px;
    }
}
.marquee-content {
    height: calc(100% - 32px);
    width: 100%;
    margin: 0;
    overflow: hidden;
    color: #d14a4a;
    ul{
      list-style-type: none;
    }
    li > span{
      list-style: none!important;
      display: inline-block !important;
      text-align: center;
      text-overflow: ellipsis;
      overflow: hidden;
      @include fontsize('small');
      &:nth-of-type(1) {
        width: 20%;
        color: $font-color4;
        text-align: left;
      }
      &:nth-of-type(2) {
        width: 40%;
      }
      &:nth-of-type(3) {
        width: 20%;
        color: $font-color6;
      }
      &:nth-of-type(4) {
        width: 20%;
        color: $font-color4;
      }
    }
    .con1 li {
        padding: 5px 0;
        &:nth-of-type(2n){
          background-color: $table-header-color;
        }
    }
}
</style>
