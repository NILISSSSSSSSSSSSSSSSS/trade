<template>
<div class="feedback-detail" v-if="detail!=null">
  <div class="title" v-html="$t('finance.feedback.detail.header',{ order:`<span class='order font-color6'>${$route.query.order}</span>` })">
  </div>
  <div class="line_1 bg-line-color"></div>
  <div class="tip_0 font-color3">{{$t('finance.feedback.detail.reason')}}{{ $t(`enum.appealType.${detail.appealType}`) }}
  </div>
  <div v-if="detail.addonPic.length>0" class="tip_1 font-color6">{{$t('finance.feedback.detail.notice1')}}
  </div>
  <div class="pics" v-if="detail.addonPic.length>0">
    <el-row :gutter="24">
      <el-col :lg="6" :md="8" :sm="12" v-for="(pic,index) in detail.addonPic" :key="index">
        <img :src="pic | imgConvert" alt="">
      </el-col>
    </el-row>
  </div>
  <div class="tip_3 font-color3">{{$t('finance.feedback.detail.notice2')}}
  </div>
  <div class="info">
    <el-input type="textarea" disabled autosize :value="detail.appealMsg"></el-input>
  </div>
</div>
</template>

<script>
import {
  getAppealById,
  getAppealTypes
} from "@/apis/finance/feedback";
export default {
  data() {
    return {
      detail: null
    };
  },
  created() {
    getAppealById(this.$route.query.order).then(res => {
      if (res.success) {
        this.detail = res.data;
      }
    });
  }
};
</script>

<style lang="scss" scoped>
.feedback-detail {
  .title {
    @include fontsize("title2");
  }
  .line_1 {
    margin-top: $space;
    // background-color: $line-color;
    height: 1px;
  }
  .tip_0 {
    margin-top: $space;
    // color: $font-color3;
    @include fontsize("content3");
  }
  .tip_1 {
    margin-top: $space;
    // color: $font-color6;
    @include fontsize("content3");
  }
  .pics {
    width: 100%;
    overflow: hidden;
    img {
      width: 100%;
      margin-top: 10px;
    }
  }
  .tip_2 {
    margin-top: $space;
    // color: $font-color3;
    @include fontsize("content3");
  }
  .tip_3 {
    margin-top: $space;
    // color: $font-color3;
    @include fontsize("content2");
    font-weight: bold;
  }
  .info {
    margin-top: $space;
    /deep/ {
      textarea {
        min-height: 150px !important;
      }
    }
  }
}
</style>
