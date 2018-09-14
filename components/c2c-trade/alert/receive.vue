<template>
  <el-dialog
    :visible.sync="data.bool"
    center
    class="c2c-alert"
    :show-close="false"
  >
    <section class="content">
      <div class="header">
        <em>确认收款</em>
      </div>
      <div class="body">
        <div class="item">
          <span class="name">输入资金密码:</span>
          <span class="val">
            <el-input placeholder="请输入资金密码" v-model="password"></el-input>
            <span class="tips">忘记资金密码?</span>
          </span>
        </div>
        

        <div class="line border-bottom"></div>
      </div>

      <div class="footer">
        <el-button class="btn" @click="data.bool = false">取消</el-button>
        <el-button type="primary" class="btn" @click="confirm">确认</el-button>
      </div>
    </section>
  </el-dialog>
</template>
<script>
import { orderReceiverPay } from "@/apis/order";

export default {
  props: {
    data: Object
  },
  data() {
    return {
      password: ''
      // centerDialogVisible: false
    };
  },
  methods: {
    confirm() {
      orderReceiverPay({id: this.data.orderId, assestsPass: this.password}).then(res => {
        if (res.success) {
          this.$message.success('确认收款成功！')
        }
        this.password = ''
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
      // align-items: center;
      margin-bottom: 20px;
      .name {
        // min-width: 80px;
        // max-width: 110px;
        width: 100px;
        margin-right: 10px;
        word-break: break-all;
        line-height: 40px;
      }
      .val {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        .tips{
          margin-top: 10px;
          color: $font-color6;
        }
      }
    }
    .line {
      height: 1px;
      margin-bottom: 20px;
    }
  }
}
</style>



