<template>
  <el-dialog
    :visible.sync="data.bool"
    center
    class="c2c-alert"
    :show-close="false"
  >
    <section class="content">
      <div class="header">
        <em>请输入资金密码</em>
      </div>
      <div class="body">
        <div class="item">
          <span class="name">输入资金密码:</span>
          <span class="val">
            <el-input placeholder="请输入资金密码" type="password" v-model="assestsPass"></el-input>
          </span>
        </div>
        <div class="info-box">
          <span>有效期限：2小时</span>
          <span class="tips">（如有IP变化仍需要输入密码)</span>
        </div>
        

        <div class="line border-bottom"></div>
      </div>

      <div class="footer">
        <el-button type="primary" class="btn" @click="confirm">确定</el-button>
        <el-button class="btn" @click="data.bool = false">取消</el-button>
      </div>
    </section>
  </el-dialog>
</template>
<script>
import { orderPay, orderReceiverPay } from "@/apis/order";

export default {
  props: {
    data: Object
  },
  data() {
    return {
      assestsPass: ''
    };
  },
  methods: {
    confirm() {
      console.log(this.data)
      if (this.data.isC2C) {
        orderReceiverPay({id: this.data.orderId, assestsPass: this.assestsPass}).then(res => {
          if (res.success) {
            this.$message.success('确认付款成功！')
            this.data.bool = false
          }
          this.assestsPass = ''
        })
      } else {
        orderPay({id: this.data.orderId, assestsPass: this.assestsPass}).then(res => {
          if (res.success) {
            this.$message.success('确认付款成功！')
            this.data.bool = false
          }
          this.assestsPass = ''
        })
      }
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
        width: 100px;
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
    .info-box{
      margin-bottom: 20px;
      .tips{
        color: $font-color6;
      }
    }
  }
}
</style>



