<template>
  <div>
    <div class="sendCode" :class="{disabled: disabled}">
      <!-- <el-input :placeholder="placeholder"></el-input> -->
      <input :placeholder="placeholder" v-model="code" @input="emit()" :disabled="disabledInput"/>
      <div class="notice" @click="sendcodeHandle" :class="{notAllow: disabled}">{{notice}}</div>
    </div>
    <!-- <div class="error" v-show="focus_verifyCode && !noError">验证码格式错误</div> -->
  </div>
</template>
<script>
export default {
  props: {
    disabledInput: {
      type: Boolean,
      default: false
    },
    placeholder: String,
    sendFlag: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      code: '',
      notice: '获取验证码',
      disabled: false
    }
  },
  methods: {
    emit () {
      this.$emit('transCode', this.code)
    },
    sendcodeHandle() {
      if (!this.disabled) {
        this.$emit('sendCode')
      }
    },
    countDown () {
      var time = 60
      this.disabled = true
      this.timer = setInterval(() => {
        time--
        if (time > 0) {
          this.notice = time + '秒后重发'
          this.disabled = true
        } else {
          this.notice = '获取验证码'
          this.disabled = false
          clearTimeout(this.timer)
        }
      }, 1000)
    }
  },
  watch: {
    sendFlag(newVal, old) {
      if (newVal > old) {
        this.countDown()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.notAllow{
  cursor: not-allowed!important;
}
.error{
  color: $font-color6;
  @include fontsize("small");
  margin-top: 5px;
  height: 24px;
}
.sendCode{
  display: flex;
  align-items: center;
  width: 100%;
  box-sizing: border-box;
  justify-content: space-between;
  input{
    height: 40px;
    line-height: 40px;
    box-sizing: border-box;
    border: 1px solid #dcdfe6;
    @include fontsize('content2');
    outline:none;
    padding: 0 13px;
    padding-right: 100px;
    width: 100%;
    &:focus{
      border: 1px solid #409EFF;
    }
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
  }
  .notice{
    margin-left: -100px;
    @include fontsize('content3');
    color: $primary;
    padding: 0 13px;
    border-left: 1px solid $primary;
    word-break: keep-all;
    cursor: pointer;
  }
  input:not([type]):disabled{
    background-color: $line-color;
  }
}
</style>
