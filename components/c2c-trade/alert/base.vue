<template>
  <el-dialog
    :visible.sync="centerDialogVisible"
    center
    class="c2c-alert"
    :show-close="false"
  >
    <section class="content">
      <div class="header">
        <span>买入</span><em>请确认</em>
      </div>
      <div class="body">
        <div class="item">
          <span class="name">买入数量:</span>
          <span class="val">
            <em class="amount">100.00</em>
            <em class="currency">BTC</em>
          </span>
        </div>
        <div class="item">
          <span class="name">买入金额1234567811256459:</span>
          <span class="val">
            <em class="amount">663.00</em>
            <em class="currency">CNY</em>
          </span>
        </div>
        <div class="item">
          <span class="name">买入金额:</span>
          <span class="val">
            <em class="amount">663.00</em>
            <em class="currency">CNY</em>
            <em>(以实际订单为准)</em>
          </span>
        </div>
        <div class="item">
          <span class="name">交易方式:</span>
          <span class="val">
            <em>银行转账 / 支付宝 / 微信</em>
          </span>
        </div>

        <div class="line border-bottom"></div>
      </div>

      <div class="footer">
        <el-button type="primary" class="btn" @click="centerDialogVisible = false">确定下单</el-button>
        <el-button class="btn" @click="centerDialogVisible = false">取消</el-button>
      </div>
    </section>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      centerDialogVisible: true
    };
  }
};
</script>

<style lang="scss" scoped>
.content {
  .header {
    padding: 0 20px;
    height: 50px;
    line-height: 50px;
    background-color: $line-color;
    @include fontsize("title3");
    margin-bottom: 20px;
    color: $font-color2;
    span {
      color: $font-color6;
    }
  }
  .body {
    padding: 0 20px;
    .item {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      .name {
        // min-width: 80px;
        // max-width: 110px;
        width: 80px;
        margin-right: 10px;
        word-break: break-all;
      }
      .val {
        flex: 1;
      }
    }
    .line {
      height: 1px;
      margin-bottom: 20px;
    }
  }
  .footer {
    padding: 0 20px;
    display: flex;
    justify-content: space-between;
    .btn {
      width: 150px;
    }
  }
}
</style>



