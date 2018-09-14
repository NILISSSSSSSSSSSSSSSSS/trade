<template>
  <div class="authentication">
    <div v-if="type === 'pre'" class="box1 box">
      <div class="user">
        <div class="avatar">
          <img :src="url">
        </div>
        <div class="name">
          {{ name ? name : '隔壁老王'}}
        </div>
        <div class="grade">
          当前等级
          <img src="~assets/img/_vip.png">
        </div>
        <el-checkbox v-model="agree" class="agree">
          我已阅读并同意 <span class="read">《商家认证申请》</span>
        </el-checkbox>

        <el-button 
          round
          @click="handleAuth">立即认证</el-button>
      </div>
      <div class="content">
        <div class="head">
          <p class="title1">VIP认证商家特权</p>
          <p class="content3">选择特权 >  > 专业对接 > 享受特权服务</p>
        </div>
        <div class="picture">
          <div class="circle">
            <div class="circle-box">
              <img src="~assets/img/crown1.png">
            </div>
            <span>专属标识</span>
          </div>
          <div class="line">
            <hr />
          </div>
          <div class="circle">
            <div class="circle-box">
              <img src="~assets/img/crown2.png">
            </div>
            <span>专属标识</span>
          </div>
          <div class="line">
            <hr />
          </div>
          <div class="circle">
            <div class="circle-box">
              <img src="~assets/img/crown3.png">
            </div>
            <span>专属标识</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="type === 'success'" class="box2 box">
      <div class="user">
        <div class="avatar">
          <img :src="url">
        </div>
        <div class="name">
          {{ name ? name : '隔壁老王'}}
          <i class="iconfont icons icon-renzhengshangjia"></i>
        </div>
        <div class="button">
          <el-button 
            round class="cancel">取消认证</el-button>
          <el-button
            @click="$i18n.push('/finance/trade/merchant')"
            round class="modify">修改认证</el-button>
        </div>
      </div>
      <div class="content">
        <div class="head">
          <p class="title1">商家已认证</p>
          <p class="content3">选择特权 >  > 专业对接 > 享受特权服务</p>
        </div>
        <div class="evaluate">
          <div class="item">
            <div class="value">{{vipInfo.merchantScore}}</div>
            <div class="key">商家评分</div>
          </div>
          <div class="item">
            <div class="value">{{vipInfo.totalTradingVolume}}</div>
            <div class="key">累计交易次数</div>
          </div>
          <div class="item">
            <div class="value">{{vipInfo.averageConsumeTime / 60 + ' Min'}}</div>
            <div class="key">平均交易时间</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    type: String,
    vipInfo: Object,
    userInfo: Object,
    url: String,
    name: String
  },
  data() {
    return {
      agree: false
    };
  },
  watch: {
    agree(val) {
      this.$emit("agreeChange", val);
    }
  },
  methods: {
    handleAuth() {
      this.$emit("handleAuth");
    }
  }
};
</script>

<style lang="scss" scoped>
.box {
  max-width: 980px;
  display: flex;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0px 3px 30px #aaa;
  box-sizing: border-box;
  p {
    padding: 0;
    margin: 0;
  }
  .user {
    box-sizing: border-box;
    padding: 30px 12px;
    width: 240px;
    height: 240px;
    text-align: center;
    /deep/ .el-button {
      box-shadow: 0 2px 4px 0 rgba(104, 48, 24, 0.3);
      background-color: transparent;
      border: none;
    }
    .avatar {
      margin: 0 auto;
      width: 58px;
      height: 58px;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    .name {
      font-size: 18px;
      @include fontsize("title3");
      margin: 8px 0;
    }
  }
  .content {
    flex: 1;
    padding: 10px 20px;
    .head {
      color: #c0a062;
      .title1 {
        @include fontsize("title1");
      }
      .content3 {
        @include fontsize("small");
      }
    }
    .value {
      @include fontsize("content1");
    }
    .key {
      @include fontsize("small");
    }
  }
  @media screen and (max-width: 700px) {
    flex-direction: column;
    .user {
      margin: 0 auto 20px;
    }
  }
  @media screen and (max-width: 400px) {
    padding: 10px 4px;
    .content {
      padding-left: 0;
      padding-right: 0;
    }
  }
}
.box1 {
  // box-sizing: border-box;
  background-color: $auth-color1;
  background-image: url("~assets/img/pre-authentication.png");
  // background-size: cover;
  .user {
    padding: 20px 13px;
    background: linear-gradient(to bottom, #fefbf2 0%, #f3f0e3 100%);
    // background-image: linear-gradient(, );
    //background-color: #fefbf2;
    .agree {
      margin: 20px 0 8px;
    }
    .read {
      color: $font-color8;
      @include fontsize("small");
    }
    /deep/ .el-button {
      width: 100%;
      background-image: linear-gradient(-90deg, #e3caa8 0%, #cda162 100%);
    }
    .grade {
      color: $font-color4;
    }
    .name {
      color: #000000;
    }
  }
  .picture {
    display: flex;
    justify-content: space-between;
    margin-top: 40px;
    .circle {
      width: 63px;
      text-align: center;
      color: $auth-color3;
      @include fontsize("small");
      .circle-box {
        width: 63px;
        height: 63px;
        border: 1px solid $auth-color3;
        border-radius: 50%;
        margin-bottom: 7px;
      }
    }
    .line {
      flex: 1;
      padding: 25px 20px 0;
      hr {
        border-color: $auth-color3;
        border-top: none;
        border-left: none;
        border-right: none;
      }
    }
  }
}
.box2 {
  background-color: $auth-color2;
  background-image: url("~assets/img/authentication.png");
  color: $auth-color3;
  .content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .user {
    background-color: #1f202a;

    .button {
      display: flex;
      justify-content: space-between;
      /deep/ .cancel {
        background: rgba(255, 255, 255, 0.2);
        color: #fff;
        font-weight: normal;
      }
      /deep/ .modify {
        color: #683018;
        background-image: linear-gradient(-90deg, #e3caa8 0%, #cda162 100%);
        font-weight: normal;
      }
    }
    .name {
      margin-top: 17px;
      margin-bottom: 34px;
    }
  }
  .evaluate {
    display: flex;
    justify-content: space-between;
    .item {
      border-left: 1px solid $auth-color3;
      padding-left: 15px;
    }
  }
}
</style>
