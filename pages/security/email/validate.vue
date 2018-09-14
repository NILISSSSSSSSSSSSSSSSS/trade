<template>
  <div class="wrapper">
    <section class="first border-bottom">
      <!-- 未绑定邮箱 -->
      <FinanceTitle :title="$t('finance.security.email.unbind.title')" icon="icon-bangdingyouxiang"></FinanceTitle>
      <span class="tip primary" v-if="!vertifyData.email">
        {{$t('finance.security.email.unbind.tip')}}
      </span>
      <!-- 已绑定邮箱 -->
      <span class="binded-tip tip font-color2" v-if="vertifyData.email">
        {{$t('finance.security.email.bind.title')}}<em>{{emailByStar}}</em>。{{$t('finance.security.email.bind.tip')}}
      </span>
    </section>

    <section class="input-box" v-if="!vertifyData.email">
      <div class="item">
        <div class="name font-color4">
          {{$t('finance.security.email.yourEmail')}}
        </div>
        <div class="val">
          <el-input v-model="post.email" >
          </el-input>
          <div class="err-tip">{{errCode.email}}</div>
        </div>
      </div>

      <div class="item">
        <div class="name font-color4">{{$t('finance.security.email.emailCode')}}</div>
        <div class="val">
          <!-- <el-input v-model="input" class="security">
            <template slot="append">获取验证码</template>
          </el-input> -->
          <send-code @transCode="getCode" @sendCode="sendHandle" :sendFlag="sendFlag" :disabledInput="false"></send-code>
          <div class="err-tip">{{errCode.emailCode}}</div>
        </div>
      </div>

      <div class="item">
        <el-button type="primary" style="width: 100%;" @click="bindEmail">{{$t('finance.security.email.bindBtn')}}</el-button>
      </div>
    </section>

    <!-- 弹出框验证码 -->
    <AlertVertify 
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
import SendCode from "@/components/security/SendCode";
import FinanceTitle from "@/components/FinanceTitle";
import AlertVertify from "@/components/security/AlertVertify";
import {mapActions, mapState} from 'vuex';
import getUserInfo from "@/mixins/security/getUserInfo";
import vertify from "@/mixins/user/verify";
import {getVertifyCode} from "@/apis/default";
import {bindPhoneOrEmail} from "@/apis/user";

export default {
  mixins: [getUserInfo, vertify],
  components: {
    FinanceTitle,
    SendCode,
    AlertVertify
  },
  data() {
    return {
      input: "",
      visible: false,
      post: {
        email: "",
        emailCode: ""
      },
      errCode: {
        email: '',
        emailCode: ''
      },
      sendFlag: 0
    }
  },
  created() {
  },
  methods: {
    bindEmail() {
      let emailFlag = this.emailVerify(this.post.email)
      if (!emailFlag) {
        this.errCode.email = this.$t('finance.security.email.tips.email')
        return
      } else {
        this.errCode.email = ""
      }
      let emailCodeFlag = this.codeVertify(this.post.emailCode)
      if (!emailCodeFlag) {
        this.errCode.emailCode = this.$t('finance.security.email.tips.emailCode')
        return
      } else {
        this.errCode.emailCode = ""
      }
      let postData = {
        stepId: 0,
        emailOrPhone: this.post.email,
        serviceName: this.serviceName,
        emailVerifyCode: this.post.emailCode,
        phoneVerifyCode: '',
        googleCode: ''
      };
      bindPhoneOrEmail(postData).then(res => {
        if (res.success) {
          this.visible = true;
        } else {
          this.$message.error(res.message)
        }
      });
    },
    alertSure(codeObj) {
      let postData = {
        stepId: 1,
        emailOrPhone: this.post.email,
        serviceName: this.serviceName,
        emailVerifyCode: this.post.emailCode,
        phoneVerifyCode: codeObj.phone, //
        googleCode: codeObj.google
      };
      bindPhoneOrEmail(postData).then(res => {
        if (res.success) {
          this.resultInfo = this.$t('finance.security.email.tips.success')
          location.reload()
        } else {
          this.resultInfo = res.message
        }
      });
    },
    alertClose() {
      this.visible = false;
    },
    getCode(val) {
      this.post.emailCode = val
    },
    sendHandle() {
      let emailFlag = this.emailVerify(this.post.email)
      if (!emailFlag) {
        this.errCode.email = this.$t('finance.security.email.tips.email')
        return
      } else {
        this.errCode.email = ""
      }
      let postData = {
        serviceName: this.serviceName,
        phoneOrEmail: this.post.email
      }
      getVertifyCode(postData).then((res) => {
        if (res.success) {
          this.sendFlag++
          this.$message.success(this.$t('finance.security.email.tips.codeSuccess'))
        } else {
          this.$message.error(res.message)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.wrapper{
  .first{
    .tip{
      @include fontsize("content3");
      color: $primary;
      margin-bottom: 30px;
      display: block;
      height: 30px;
      line-height: 30px;
    }
    .binded-tip{
      color: $font-color2;
    }
  }

  .input-box{
    padding-top: 40px;
    .item{
      max-width: 476px;
      .name{
        @include fontsize("content3");
        color: $font-color4;
        margin-bottom: 10px;
      }
      .val{
      }
    }
  }
}
</style>
<style lang="scss">
  .security .el-input-group__append{
    background-color: transparent;
    color: $primary;
    cursor: pointer;
  }
</style>


