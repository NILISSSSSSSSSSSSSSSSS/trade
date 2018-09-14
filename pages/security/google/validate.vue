<template>
  <div class="wraper">
    <!-- {{未绑定google时}} -->
    <section class="no-binding" v-if="!vertifyData.google">
      <div class="top">
        <FinanceTitle :title="$t('finance.security.google.unbind.title')" icon="icon-gugebangding"></FinanceTitle>
        <div class="explanation">
          {{$t('finance.security.google.unbind.tip')}}
          <!-- 谷歌验证器是一款动态口令工具，工作原理类似短信动态验证。绑定后每30s生成一个动态验证码，验证码可用于登录、提现、修改安全设置等操作的安全验证。 -->
        </div>
      </div>

      <section class="step">
        <div class="step-one">
          <p class="title">① {{$t('finance.security.google.unbind.first.subTitle')}}</p>
          <div class="content">
            <p>{{$t('finance.security.google.unbind.first.cont1')}}</p>
            <p>{{$t('finance.security.google.unbind.first.cont2')}}</p>
          </div>
          <div class="btn-box">
            <el-button type="primary" class="btn">
              <i class="iconfont icon-AppStorelogo"></i>
              App Store
            </el-button>
            <el-button type="primary"  class="btn">
              <i class="iconfont icon-GooglePlaylogo"></i>
              Google Play
            </el-button>
          </div>
        </div>

        <div class="step-two">
          <p class="title">② {{$t('finance.security.google.unbind.second.subTitle')}}</p>
          <div class="content">
            <p>{{$t('finance.security.google.unbind.second.cont1')}}</p>
            <p class="warning">{{$t('finance.security.google.unbind.second.cont2')}}</p>
          </div>
          <div class="qrcode-box">
            <div class="qrcode">
              <qrcode-vue :value="qrImgStr" :size="size" level="H" class="qrcode"></qrcode-vue>
            </div>
            <div class="text-box" v-show="keyPass">
              <div></div>
              <div>
                <div class="name">{{$t('finance.security.google.unbind.second.secret')}}</div>
                <span class="val">
                  <em>{{keyPass}}</em>
                  <i 
                    v-clipboard:copy="keyPass"
                    v-clipboard:success="copySuccess"
                    v-clipboard:error="copyFail"
                    class="clip-copy"
                  >
                    {{$t('finance.security.google.unbind.second.copy')}}
                  </i>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div class="step-three">
          <p class="title">③ {{$t('finance.security.google.unbind.third.subTitle')}}</p>
          <div class="input-box">
            <p>{{$t('finance.security.google.googleCode')}}</p>
            <el-input  class="code" style="display:block;" v-model="unbind.code" ></el-input>
            <div class="err-tip">{{errCode.unbind}}</div>
            <el-button class="binding" type="primary"  @click="bindVertify(false)" >{{$t('finance.security.google.unbind.third.btn')}}</el-button>
          </div>
        </div>
      </section>
    </section>

    <!-- 绑定之后取消google验证 -->
    <section class="cancel-binding" v-if="vertifyData.google && bindFlag">
      <div class="top">
        <FinanceTitle :title="$t('finance.security.google.cancel.title')" icon="icon-gugebangding"></FinanceTitle>
        <div class="explanation">
          {{$t('finance.security.google.cancel.tip')}}
        </div>

        <div class="code-box">
          <div class="name">{{$t('finance.security.google.googleCode')}}</div>
          <el-input  class="cancel-code" v-model="bind.code"></el-input>
          <div class="err-tip">{{errCode.bind}}</div>
          <el-button type="danger" class="cancel-btn" @click="bindVertify(true)">{{$t('finance.security.google.cancelGoogle')}}</el-button>
        </div>
      </div>
    </section>
    <!-- 绑定之后取消google验证 -->
    <section class="binded" v-if="vertifyData.google && !bindFlag">
      <div class="top">
        <FinanceTitle :title="$t('finance.security.google.unbind.title')" icon="icon-gugebangding"></FinanceTitle>
        <div class="explanation">
          {{$t('finance.security.google.unbind.tip')}}
        </div>
      </div>

        <div class="binded-box">
          <div class="border border-bottom">
            <span class="name">{{$t('finance.security.google.bind.title')}}</span>
            <el-button type="danger" class="cancel-btn" @click="bindFlag = true">{{$t('finance.security.google.cancelGoogle')}}</el-button>
          </div>

          <div class="warning">
            <div>{{$t('finance.security.google.bind.warning.name')}}</div>
            <p>1. {{$t('finance.security.google.bind.warning.cont1')}}</p>
            <p>2. {{$t('finance.security.google.bind.warning.cont2')}}</p>
            <p>3. {{$t('finance.security.google.bind.warning.cont3')}}</p>
            <p>4. {{$t('finance.security.google.bind.warning.cont4')}}</p>
          </div>
        </div>
    </section>

    <!-- <el-dialog
      center
      :visible="visible"
      :show-close="false"
      class="dialog my-dialog"
      >
      <div class="content">
        <div class="close-tag" @click="visible=false">
          <i class="el-icon-close"></i>
        </div>
        <header class="head">安全验证</header>
        <div class="item" v-if="email">
          <el-input disabled class="valicode-input" v-model="emailText">
            <template slot="append">
              <i class="line" :class="visible ? 'click-before' : 'click-after'"></i>
              <em v-if="visible">获取验证码</em>
              <span v-else>重发({{90}})s</span>
            </template>
          </el-input>
        </div>

        <div class="item" v-if="email">
          <el-input placeholder="邮箱验证码">
          </el-input>
        </div>

        <div class="item" v-if="phone">
          <el-input disabled class="valicode-input" v-model="phoneText">
            <template slot="append">
              <i class="line" :class="visible ? 'click-before' : 'click-after'"></i>
              <em v-if="visible">获取验证码</em>
              <span v-else>重发({{90}})s</span>
            </template>
          </el-input>
        </div>

        <div class="item" v-if="phone">
          <el-input placeholder="短信验证码">
          </el-input>
        </div>

        <div class="item">
          <el-button class="btn" type="primary">确认绑定</el-button>
        </div>

        <div class="msg-tip">
          <span>
            绑定成功
          </span>
        </div>

      </div>
    </el-dialog> -->

    <AlertVertify 
      :googleFlag="false"
      :vertifyData = vertifyData
      :visible = visible
      :resultInfo = "resultInfo"
      :serviceName = "serviceName"
      @sure="alertSure"
      @close="alertClose"
    />
  </div>
</template>
<script>
import FinanceTitle from "@/components/FinanceTitle";
import QrcodeVue from 'qrcode.vue';
import AlertVertify from "@/components/security/AlertVertify";
import {mapActions, mapState, mapMutations} from "vuex";
import getUserInfo from "@/mixins/security/getUserInfo";
import vertify from "@/mixins/user/verify";
import { googleGenerate, googleVertify, bindGoogleCode, unbindGoogleCode } from "@/apis/user";

export default {
  mixins: [getUserInfo, vertify],
  components: {
    FinanceTitle,
    QrcodeVue,
    AlertVertify
  },
  data() {
    return {
      visible: false,
      qrImgStr: "",
      keyPass: "",
      size: 144,
      unbind: {
        code: ""
      },
      bind: {
        code: ""
      },
      errCode: {
        unbind: '',
        bind: ''
      },
      bindFlag: false
    };
  },
  created() {
    console.log(this.vertifyData)
    if (this.vertifyData.google !== undefined && !this.vertifyData.google) {
      this._googleGenerate()
    }
  },
  watch: {
    // vertifyData(newVal) {
    //   console.log(newVal)
    //   if (!newVal.google) {
    //     this._googleGenerate()
    //   }
    // }
  },
  methods: {
    copySuccess(e) {
      this.$message.success(this.$t('finance.security.google.tips.copySuccess'))
    },
    copyFail(e) {
      this.$message.error(this.$t('finance.security.google.tips.copyFail'))
    },
    bindVertify(flag) {
      let postObj = {
        code: ""
      }
      if (flag) {
        postObj.code = this.bind.code
        let codeFlag = this.codeVertify(postObj.code)
        if (!codeFlag) {
          this.errCode.bind = this.$t('finance.security.google.tips.googleCode')
          return
        } else {
          this.errCode.bind = ''
        }
      } else {
        postObj.code = this.unbind.code
        let codeFlag = this.codeVertify(postObj.code)
        if (!codeFlag) {
          this.errCode.bind = this.$t('finance.security.google.tips.googleCode')
          return
        } else {
          this.errCode.bind = ''
        }
      }
      googleVertify(postObj).then((res) => {
        if (res.success && res.data) {
          this.visible = true
        } else {
          this.$message.error(res.message)
        }
      })
    },
    // vertifyGooleCode(code) {
    //   code = code.trim()
    //   if (/[0-9]{6}/.test(code)) {
    //     return true
    //   } else {
    //     return false
    //   }
    // },
    alertSure(codeObj) {
      let postObj = {
        serviceName: this.serviceName,
        phoneVerifyCode: codeObj.phone,
        emailVerifyCode: codeObj.email
      }
      console.log(postObj)
      if (this.vertifyData.google) {
        unbindGoogleCode(postObj).then((res) => {
          if (res.success) {
            // this.visible = false
            this.resultInfo = this.$t('finance.security.google.tips.unbind')
            location.reload()
          } else {
            // this.$message.error(res.message)
            this.resultInfo = res.message
          }
        })
      } else {
        bindGoogleCode(postObj).then((res) => {
          if (res.success) {
            // this.visible = false
            this.resultInfo = this.$t('finance.security.google.tips.bind')
            location.reload()
          } else {
            // this.$message.error(res.message)
            this.resultInfo = res.message
          }
        })
      }
    },
    alertClose() {
      this.visible = false
    },
    _googleGenerate() {
      googleGenerate().then((res) => {
        if (res.success) {
          this.qrImgStr = res.data.qrStr || ""
          this.keyPass = res.data.secret || ""
        }
      })
    }
  }
};
</script>
<style lang="scss" scoped>
.wraper {
  .top {
    padding-bottom: 30px;
    border-bottom: 1px solid $line-color;
    margin-bottom: 30px;
    .explanation {
      @include fontsize("content3");
      color: $font-color4;
      line-height: 30px;
      padding-top: 10px;
      font-family: $font-light;
    }
  }
  .step {
    .title {
      @include fontsize("content3");
      // height: 30px;
      line-height: 30px;
      color: $font-color4;
      margin-bottom: 25px;
      font-family: $font-medium;
    }
    .content {
      p {
        color: $font-color4;
        @include fontsize("content3");
        line-height: 16px;
        font-family: $font-regular;
      }
    }
    .step-one {
      border-bottom: 1px solid $line-color;
      margin-bottom: 25px;
      .btn-box {
        padding: 25px 0 45px 0;
        .btn {
          margin-right: 40px;
          margin-bottom: 10px;
          margin-left: 0;
        }
      }
    }
    .step-two {
      border-bottom: 1px solid $line-color;
      margin-bottom: 25px;
      .content {
        .warning {
          color: $font-color6;
        }
      }
      .qrcode-box {
        display: flex;
        padding: 35px 0 30px 0;
        .qrcode {
          width: 144px;
          height: 144px;
          background-color: $font-color5;
          margin-right: 30px;
        }
        .text-box {
          min-width: 90px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          color: $font-color4;
          @include fontsize("content3");
          .val {
            display: block;
            text-align: right;
            i {
              margin-left: 15px;
              color: $primary;
            }
            .clip-copy{
              cursor: pointer;
            }
          }
        }
      }
    }
    .step-three {
      @include fontsize("content3");
      color: $font-color4;
      .input-box {
        width: 480px;
        @include phone{
          width: 100%;
        }
        .binding {
          width: 100%;
        }
      }
    }
  }

  .cancel-binding {
    .top {
      .explanation {
        margin-bottom: 10px;
      }
    }
    .code-box {
      width: 480px;
      @include fontsize("small");
      color: $font-color2;
      @include phone{
        width: 100%;
      }
      .name {
        margin-bottom: 5px;
      }
      .cancel-btn {
        width: 100%;
      }
    }
  }

  .binded-box {
    .border {
      margin-bottom: 30px;
    }
    .name {
      @include fontsize("content3");
      margin-bottom: 5px;
      display: block;
    }
    .cancel-btn {
      width: 153px;
      margin-bottom: 50px;
    }
    .warning {
      @include fontsize("content3");
      color: $font-color2;
      p {
        margin-bottom: 20px;
      }
    }
  }
  .dialog {
    .content {
      .head {
        height: 36px;
        line-height: 36px;
        margin-bottom: 20px;
      }
      .item {
        margin-bottom: 25px;
        .valicode-input{
          @include fontsize("content2");
          cursor: pointer;
        }
        .btn {
          background-color: $primary;
          width: 100%;
        }
      }
    }
  }
  
}
</style>



