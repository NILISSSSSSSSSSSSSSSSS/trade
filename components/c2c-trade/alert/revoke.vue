<template>
  <el-dialog
    :visible.sync="data.bool"
    center
    class="c2c-alert"
    :show-close="false"
  >
    <section class="content">
      <div class="header">
        <em>确定撤单</em>
      </div>
      <div class="body">
        <div class="item">
          <span class="name">单号:</span>
          <span class="val">
            <em class="amount">{{ data.orderId }}</em>
          </span>
        </div>
        <div class="item">
          <span class="name">交易对:</span>
          <span class="val">
            <em class="amount">{{ data.currency }} / {{ data.fiatCurrency }}</em>
          </span>
        </div>
        <div class="item">
          <span class="name">总额:</span>
          <span class="val">
            <em class="amount">{{ data.legalCurrencyAmount | fiatCurrency }}</em>
            <em class="currency">{{ data.fiatCurrency }}</em>
            <em>(以实际订单为准)</em>
          </span>
        </div>
        <div class="item">
          <span class="name">操作:</span>
          <span class="val">
            <em>撤销卖单</em>
          </span>
        </div>

        <div class="line border-bottom"></div>
      </div>

      <div class="footer">
        <el-button type="primary" class="btn" @click="confirm">确定撤单</el-button>
        <el-button class="btn" @click="data.bool = false">取消</el-button>
      </div>
    </section>
  </el-dialog>
</template>
<script>
import { orderCancle } from "@/apis/order";

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
    confirm() {
      orderCancle({id: this.data.orderId}).then(res => {
        if (res.success) {
          this.$message.success('撤单成功！')
          this.data.bool = false
        }
      })
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
}
</style>



