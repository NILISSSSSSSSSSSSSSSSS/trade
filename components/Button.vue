<template>
  <div class="mybutton">
    <el-button 
      @click="handleClick" 
      :type="type" 
      :disabled="disabled">{{text}}</el-button>
  </div>
</template>

<script>
export default {
  props: {
    text: String,
    type: {
      type: String,
      default: "primary"
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleClick() {
      this.$emit("click");
    }
  }
};
</script>

<style lang="scss" scoped>
.mybutton {
  button {
    width: 100%;
    background-color: $primary;
    color: $font-color1;
    border-radius: 2px;
    @include fontsize("content2");
  }
  /deep/ .el-button {
    height: 40px;
  }
  /deep/ .el-input__inner {
    padding-top: 0;
    padding-bottom: 0;
  }
}
</style>
