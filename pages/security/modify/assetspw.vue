<template>
  <div class="wrapper">
    <div class="remenber" v-if="remenberFlag">
      <!-- 通过原资金密码修改密码 -->
      <section class="first border-bottom" >
        <FinanceTitle :title="$t('finance.security.changeAssetspw.title')" icon="icon-xiugaizijinmima" ></FinanceTitle>
        <span class="tip">
          {{$t('finance.security.changeAssetspw.tip')}}
        </span>
      </section>

      <section class="input-box">
        <div class="item">
          <div class="name">
            {{$t('finance.security.changeAssetspw.oldAssetspw')}}
          </div>
          <div class="val forget-box" >
            <el-input v-model="remenber.prePwd" type="password" class="input" ></el-input>
            <span class="forgetpw" @click="remenberFlag = false">{{$t('finance.security.changeAssetspw.forgetoldAssetspw')}}</span>
          </div>
          <div class="err-tip">{{errCode.rPrePwd}}</div>
        </div>

        <div class="item">
          <div class="name">{{$t('finance.security.changeAssetspw.newAssetspw')}}</div>
          <div class="val">
            <el-input v-model="remenber.newPwd" type="password" class="input">
            </el-input>
          </div>
          <div class="err-tip">{{errCode.rNewPwd}}</div>
        </div>

        <div class="item">
          <div class="name">{{$t('finance.security.changeAssetspw.affirmNewPw')}}</div>
          <div class="val">
            <el-input v-model="remenber.affirmPwd" type="password"  class="input">
            </el-input>
          </div>
          <div class="err-tip">{{errCode.rAffirmPwd}}</div>
        </div>

        <div class="item">
          <div class="btn-box">
            <el-button type="primary" class="next-btn" @click="remenberStepOne">{{$t('finance.security.changeAssetspw.next')}}</el-button>
          </div>
        </div>
      </section>
    </div>
    <!-- 忘记密码修改资金密码第一步 -->
    <div class="forget" v-if="!remenberFlag && !newPwdFlag">
      <section class="first border-bottom" >
        <FinanceTitle :title="$t('finance.security.changeAssetspw.title1')" icon="icon-xiugaizijinmima"></FinanceTitle>
        <span class="tip">
          {{$t('finance.security.changeAssetspw.tip')}}
        </span>
      </section>

      <section class="input-box">
        <!-- <div class="item">
          <div class="name">
            请输入您的 邮箱/手机号
          </div>
          <div class="val">
            <el-input v-model="forget.acount"  class="input" ></el-input>
          </div>
          <div class="err-tip">{{errCode.fAccount}}</div>
        </div> -->

        <div class="item">
          <div class="name">{{$t('finance.security.changeAssetspw.loginPw')}}</div>
          <div class="val">
            <el-input v-model="forget.loginPwd" type="password"  class="input">
            </el-input>
          </div>
          <div class="err-tip">{{errCode.fLoginPwd}}</div>
        </div>

        <div class="item">
          <!-- <el-button type="primary" style="width: 100%;" @click="visible = true">提交</el-button> -->
          <div class="btn-box">
            <el-button type="primary" class="next-btn" @click="forgetStepOne">{{$t('finance.security.changeAssetspw.submit')}}</el-button>
          </div>
        </div>
      </section>
    </div>
    <!-- 忘记密码修改资金密码第三步 -->
    <div class="confirm" v-if="!remenberFlag && newPwdFlag">
      <section class="first border-bottom" >
        <FinanceTitle :title="$t('finance.security.changeAssetspw.title')" icon="icon-xiugaizijinmima"></FinanceTitle>
        <span class="tip">
          {{$t('finance.security.changeAssetspw.tip')}}
        </span>
      </section>

      <section class="input-box">
        <div class="item">
          <div class="name">
            {{$t('finance.security.changeAssetspw.inputNewAssetspw')}}
          </div>
          <div class="val">
            <el-input v-model="forget.newPwd" type="password" class="input"></el-input>
          </div>
          <div class="err-tip">{{errCode.fNewPwd}}</div>
        </div>

        <div class="item">
          <div class="name">{{$t('finance.security.changeAssetspw.inputNewAssetspwAgain')}}</div>
          <div class="val">
            <el-input v-model="forget.affirmPwd" type="password" class="input">
            </el-input>
          </div>
          <div class="err-tip">{{errCode.fAffirmPwd}}</div>
        </div>

        <div class="item">
          <div class="btn-box">
            <el-button type="primary" class="next-btn" @click="forgetStepThree">{{$t('finance.security.changeAssetspw.sure')}}</el-button>
          </div>
        </div>
      </section>
    </div>

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
import FinanceTitle from "@/components/FinanceTitle";
import AlertVertify from "@/components/security/AlertVertify";
import getUserInfo from "@/mixins/security/getUserInfo";
import vertify from "@/mixins/user/verify";
import { updateTxPwdByPreTxPwd, updateTxPwdByPwd } from "@/apis/user";

export default {
  mixins: [getUserInfo, vertify],
  components: {
    FinanceTitle,
    AlertVertify
  },
  data() {
    return {
      select: "中国",
      visible: false,
      input: "",
      status: "1",
      remenberFlag: true,
      newPwdFlag: false,
      remenber: {
        prePwd: "",
        newPwd: "",
        affirmPwd: ""
      },
      forget: {
        acount: "",
        loginPwd: "",
        newPwd: "",
        affirmPwd: ""
      },
      errCode: {
        rPrePwd: '',
        rNewPwd: '',
        rAffirmPwd: '',
        fAccount: '',
        fLoginPwd: '',
        fNewPwd: '',
        fAffirmPwd: ''
      },
      serviceName: 'updatePwd'
    }
  },
  methods: {
    remenberStepOne() {
      // 验证原密码
      let prePwdFlag = this.txPasswordVerify(this.remenber.prePwd)
      if (prePwdFlag) {
        this.errCode.rPrePwd = ''
      } else {
        this.errCode.rPrePwd = this.$t('finance.security.changeAssetspw.tips.assetsPw')
        return
      }
      // 验证新密码
      let newPwdFlag = this.txPasswordVerify(this.remenber.newPwd)
      if (newPwdFlag) {
        this.errCode.rNewPwd = ''
      } else {
        this.errCode.rNewPwd = this.$t('finance.security.changeAssetspw.tips.assetsPw')
        return
      }
      // 验证再次输入新密码
      let affirmPwdFlag = this.password2Verify(this.remenber.newPwd, this.remenber.affirmPwd)
      if (affirmPwdFlag) {
        this.errCode.rAffirmPwd = ''
      } else {
        this.errCode.rAffirmPwd = this.$t('finance.security.changeAssetspw.tips.differ')
        return
      }

      let postData = {
        serviceName: this.serviceName,
        preTxPwd: this.remenber.prePwd,
        newTxPwd: this.remenber.newPwd,
        // phoneVerifyCode: "",
        // emailVerifyCode: "",
        // googleCode: "",
        stepId: 0
      }
      updateTxPwdByPreTxPwd(postData).then((res) => {
        if (res.success) {
          this.visible = true
        } else {
          this.$message.error(res.message)
        }
      })
    },
    forgetStepOne() {
      // 验证登录密码
      let assetPwdFlag = this.passwordVerify(this.forget.loginPwd)
      if (assetPwdFlag) {
        this.errCode.fLoginPwd = ''
      } else {
        this.errCode.fLoginPwd = this.$t('finance.security.changeAssetspw.tips.loginPw')
        return
      }
      // 应该要调用一个接口,验证登录密码是否正确
      let postData = {
        serviceName: this.serviceName,
        pwd: this.forget.loginPwd,
        stepId: 0
      }
      updateTxPwdByPwd(postData).then((res) => {
        if (res.success) {
          this.visible = true
        } else {
          this.$message.error(res.message)
        }
      })
    },
    alertSure(codeObj) {
      // console.log(codeObj)
      if (this.remenberFlag) {
        let postData = {
          serviceName: this.serviceName,
          phoneVerifyCode: codeObj.phone,
          emailVerifyCode: codeObj.email,
          googleCode: codeObj.google,
          preTxPwd: this.remenber.prePwd,
          newTxPwd: this.remenber.newPwd,
          stepId: 1
        };
        updateTxPwdByPreTxPwd(postData).then(res => {
          if (res.success) {
            // this.$message.success('绑定成功')
            this.resultInfo = this.$t('finance.security.changeAssetspw.tips.success')
            location.reload()
          } else {
            // this.$message.error(res.message)
            this.resultInfo = res.message
          }
        });
      } else if (!this.remenberFlag && !this.newPwdFlag) { // 验证第二步,不用传新密码
        let postData = {
          serviceName: this.serviceName,
          phoneVerifyCode: codeObj.phone,
          emailVerifyCode: codeObj.email,
          googleCode: codeObj.google,
          // pwd: this.forget.loginPwd, // 登录密码
          stepId: 1
        }
        updateTxPwdByPwd(postData).then((res) => {
          if (res.success) {
            this.newPwdFlag = true
            this.alertClose()
          } else {
            // this.$message.error(res.message)
            this.resultInfo = res.message
          }
        })
      }
    },
    forgetStepThree() {
      // 验证新密码
      let newPwdFlag = this.txPasswordVerify(this.forget.newPwd)
      if (newPwdFlag) {
        this.errCode.fNewPwd = ''
      } else {
        this.errCode.fNewPwd = this.$t('finance.security.changeAssetspw.tips.assetsPw')
        return
      }
      // 验证再次输入新密码
      let affirmPwdFlag = this.password2Verify(this.forget.newPwd, this.forget.affirmPwd)
      if (affirmPwdFlag) {
        this.errCode.fAffirmPwd = ''
      } else {
        this.errCode.fAffirmPwd = this.$t('finance.security.changeAssetspw.tips.differ')
        return
      }
      let postData = {
          serviceName: this.serviceName,
          // phoneVerifyCode: codeObj.phone,
          // emailVerifyCode: codeObj.email,
          // googleCode: codeObj.google,
          newTxPwd: this.forget.newPwd,
          pwd: this.forget.loginPwd,
          stepId: 2
        }
        updateTxPwdByPwd(postData).then((res) => {
          if (res.success) {
            this.$message.success(this.$t('finance.security.changeAssetspw.tips.success'))
            location.reload()
          } else {
            this.$message.error(res.message)
          }
        })
    },
    alertClose() {
      this.visible = false;
    }
  }
}
</script>
<style lang="scss" scoped>
.wrapper{
  // max-width: 460px;
  // padding-left: 10px;
  .first{
    .tip{
      @include fontsize("content3");
      color: $primary;
      margin-bottom: 30px;
      display: block;
      height: 30px;
      line-height: 30px;
    }
    // border-bottom: 1px solid $line-color;
  }

  .input-box{
    padding-top: 40px;
    .item{
      // max-width: 476px;
      width: 100%;
      position: relative;
      display: flex;
      flex-direction: column;
      .name{
        @include fontsize("content3");
        color: $font-color4;
        margin-bottom: 10px;
      }
      .val{
        // margin-bottom: 30px;
        display: flex;
        .input{
          max-width: 476px;
          width: 100%;
          display: block;
          margin-right: 20px;
          @include phone{
            margin-right: 0;
          }
        }
        .forgetpw{
          cursor: pointer;
          color: $primary;
          // height: 40px;
          line-height: 40px;
          @include fontsize("content3");
          @include phone{
            height: 20px;
            line-height: 20px;
          }
        }
      }
      .forget-box{
        @include phone{
          flex-direction: column;
          // margin-bottom: 10px;
        }
      }
      .btn-box{
        max-width: 476px;
        .next-btn{
          width: 100%;
        }
      }
    }
  }
}
</style>
<style lang="scss">
  // .security .el-input-group__append{
  //   background-color: transparent;
  //   color: $primary;
  // }
</style>


