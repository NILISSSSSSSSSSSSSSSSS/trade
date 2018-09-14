<template>
  <el-dialog
    :visible.sync="data.bool"
    center
    class="c2c-alert"
    :show-close="false"
  >
    <section class="content">
      <div class="header">
        <span>卖出</span><em>请确认</em>
      </div>
      <div class="body">
        <div class="item">
          <span class="name">卖出数量:</span>
          <span class="val">
            <em class="amount">{{data.data.count}}</em>
            <em class="currency">{{data.data.currency}}</em>
          </span>
        </div>
        <div class="item">
          <span class="name">卖出金额:</span>
          <span class="val">
            <em class="amount">{{data.data.countAll | fiatCurrency}}</em>
            <em class="currency">{{data.data.fiatCurrency}}</em>
          </span>
        </div>
        <div class="item">
          <span class="name">单价估计:</span>
          <span class="val">
            <em class="amount">{{data.data.unitPrice | fiatCurrency}}</em>
            <em class="currency">{{data.data.fiatCurrency}}</em>
            <em>(以实际订单为准)</em>
          </span>
        </div>
        <div class="item">
          <span class="name">交易方式:</span>
          <span class="val">
            <em v-for="(payway, index) in data.data.allowPay" :key="payway">{{payway}}<span v-if="index < data.data.allowPay.length - 1"> / </span></em>
          </span>
        </div>

        <div class="line border-bottom"></div>
      </div>

      <div class="footer">
        <el-button type="primary" class="btn" @click="createOrder">确定下单</el-button>
        <el-button class="btn" @click="data.bool = false">取消</el-button>
      </div>
    </section>
  </el-dialog>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  props: {
    data: Object
  },
  data() {
    return {
      // centerDialogVisible: false
    };
  },
  methods: {
    ...mapActions('c2c_trade', ['CREATE_ORDER']),
    async createOrder () {
      let data = {
        adId: this.data.data.id,
        isC2C: true,
        tradeCurrencyAmount: this.data.data.count,
        payWay: new Array(this.data.data.payWay)
      }
      let result = await this.CREATE_ORDER(data)
      result && (this.data.bool = false)
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./base.scss";

.content {
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
  .footer{
    .el-button--default{
      background-color: $line-color;
    }
  }
}
</style>



