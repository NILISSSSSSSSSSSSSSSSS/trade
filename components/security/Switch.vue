<template>
  <div class="switch">
    <el-switch
      v-model="tmpValue"
      active-color="#4A90E2"
      inactive-color="#ccc"
      @change="change"
    >
      <!-- v-model="item.enable" -->
      <!-- active-value='true'
      inactive-value='false' -->
      <!-- @change="changePayway" -->
    </el-switch>
    <span class="switch-text">{{tmpValue ? '关闭' : '开启'}}</span>
  </div>
</template>
<script>
export default {
  props: {
    index: {
      type: Number
    },
    value: {
      type: Boolean,
      default: false
    }
    // payType: {
    //   type: String,
    //   default: ''
    // }
  },
  data() {
    return {
      tmpValue: false
    }
  },
  methods: {
    change(val) {
      this.$emit('changePayway', val, this.index)
    }
  },
  watch: {
    value(newVal) {
      this.tmpValue = newVal
    }
  }
}
</script>
<style lang="scss" scoped>
.switch-text {
  color: $font-color2;
  margin-left: 12px;
  line-height: 20px;
}
</style>

