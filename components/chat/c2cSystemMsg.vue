<template>
  <div class="c2c-chat-systemMsg clearfix" v-if="item!=null">
    <i class="font-color6">机器人:</i>对方已支付,请确认收款<br/>
    <a class="btn" href="javascript:;" @click="receiptOrder">确认收款</a>
  </div>
</template>

<script>
export default {
  name: 'c2c-systeminfo',
  props: {
    info: {
      type: Object
    }
  },
  mounted() {},
  methods: {
    receiptOrder() {
      this.$root.$emit('receipt_order', info.orderId)
    }
  }
}
</script>

<style lang="scss" scoped>
.c2c-chat-systemMsg {
  position: relative;
  width: 100%;
  padding: 10px;
  line-height: 25px;
  letter-spacing: 0.05em;
  @include fontsize('content2');
  color: $font-color5;
  box-sizing: border-box;
  letter-spacing: 0.1em;
  clear: both;
  /deep/ .btn {
    float: right;
    text-decoration: underline;
  }
}
</style>
