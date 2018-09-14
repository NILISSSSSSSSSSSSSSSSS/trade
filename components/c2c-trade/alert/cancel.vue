<template>
  <el-dialog
    :visible.sync="data.bool"
    center
    class="c2c-alert"
    :show-close="false"
  >
    <section class="content">
      <div class="header">
        <em>订单已取消</em>
        <em class="close-tag">
          ×
        </em>
      </div>
      <div class="body">
        <div class="item">
          <span>订单号：</span>
          <span>2321985</span>
        </div>
        
        <div class="item">
          <span>取消时间：</span>
          <span>2018.07.17   15:34:45</span>
        </div>

        <!-- <div class="line border-bottom"></div> -->
      </div>

      <!-- <div class="footer">
        <el-button class="btn" @click="centerDialogVisible = false">取消</el-button>
        <el-button type="primary" class="btn" @click="centerDialogVisible = false">确认</el-button>
      </div> -->
    </section>
  </el-dialog>
</template>
<script>
export default {
  props: {
    data: Object
  },
  data() {
    return {
    };
  }
};
</script>

<style lang="scss" scoped>
@import "./base.scss";

.content {
  position: relative;
  .header{
    .close-tag{
      position: absolute;
      right: 12px;
      top: 26px;
      font-size: 30px;
      line-height: 0;
    }
  }
  .body {
    padding: 0 20px;
    .item {
      display: flex;
      margin-bottom: 10px;
      align-items: center;
      @include fontsize("content2");
      color: $font-color3;
    }
    .line {
      height: 1px;
      margin-bottom: 20px;
    }
  }
  
}
</style>



