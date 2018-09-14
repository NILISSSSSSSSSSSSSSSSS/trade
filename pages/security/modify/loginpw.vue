<template>
  <div class="wrapper">
    <!-- 忘记原登录密码修改密码 -->
    <div class="forget" v-if="!remenberFlag && !newPwdFlag">
      <section class="first border-bottom" >
        <FinanceTitle :title="$t('finance.security.changeLoginPw.title1')" icon="icon-xiugaidenglumima"></FinanceTitle>
        <span class="tip">
          {{$t('finance.security.changeLoginPw.tip')}}
        </span>
      </section>

      <section class="input-box">
        <!-- <div class="item">
          <div class="name">
            请输入您的 邮箱/手机号
          </div>
          <div class="val">
            <el-input v-model="forget.acount" class="input" ></el-input>
          </div>
          <div class="err-tip">{{errCode.fAccount}}</div>
        </div> -->

        <div class="item">
          <div class="name">{{$t('finance.security.changeLoginPw.assetsPw')}}</div>
          <div class="val">
            <el-input v-model="forget.assetPwd" type="password" class="input">
            </el-input>
          </div>
          <div class="err-tip">{{errCode.fAssetPwd}}</div>
        </div>

        <div class="item">
          <div class="btn-box">
            <el-button type="primary" class="next-btn" @click="forgetStepOne">{{$t('finance.security.changeLoginPw.submit')}}</el-button>
          </div>
          <!-- <el-button type="primary" style="width: 100%;" @click="visible = true">提交</el-button> -->
        </div>
      </section>
    </div>

    <!-- 忘记原登录密码修改密码 -->
    <div class="forget" v-if="!remenberFlag && newPwdFlag">
      <section class="first border-bottom" >
        <FinanceTitle :title="$t('finance.security.changeLoginPw.title1')" icon="icon-xiugaidenglumima"></FinanceTitle>
        <span class="tip">
          {{$t('finance.security.changeLoginPw.tip')}}
        </span>
      </section>

      <section class="input-box">
        <div class="item">
          <div class="name">
            {{$t('finance.security.changeLoginPw.newLoginPw')}}
          </div>
          <div class="val">
            <el-input v-model="forget.newPwd" type="password" class="input" ></el-input>
          </div>
          <div class="err-tip">{{errCode.fNewPwd}}</div>
        </div>

        <div class="item">
          <div class="name">{{$t('finance.security.changeLoginPw.affirmNewPw')}}</div>
          <div class="val">
            <el-input v-model="forget.affirmPwd" type="password"  class="input">
            </el-input>
          </div>
          <div class="err-tip">{{errCode.fAffirmPwd}}</div>
        </div>

        <div class="item">
          <div class="btn-box">
            <el-button type="primary" class="next-btn" @click="forgetStepThree">{{$t('finance.security.changeLoginPw.submit')}}</el-button>
          </div>
        </div>
      </section>
    </div>

    <!-- 记得原登录密码修改密码 -->
    <div class="remenber" v-if="remenberFlag">
      <section class="first border-bottom" >
        <FinanceTitle :title="$t('finance.security.changeLoginPw.title')" icon="icon-xiugaidenglumima"></FinanceTitle>
        <span class="tip">
          {{$t('finance.security.changeLoginPw.tip')}}
        </span>
      </section>

      <section class="input-box">
        <div class="item">
          <div class="name">{{$t('finance.security.changeLoginPw.oldLoginPw')}}</div>
          <div class="val forget-box">
            <el-input v-model="remenber.prePwd" type="password" class="input"></el-input>
            <span class="forgetpw" @click="remenberFlag = false">{{$t('finance.security.changeLoginPw.forgetOldPw')}}</span>
          </div>
          <div class="err-tip">{{errCode.rPrePwd}}</div>
        </div>

        <div class="item">
          <div class="name">{{$t('finance.security.changeLoginPw.newLoginPw')}}</div>
          <div class="val">
            <el-input v-model="remenber.newPwd" type="password" class="input">
            </el-input>
          </div>
          <div class="err-tip">{{errCode.rNewPwd}}</div>
        </div>

        <div class="item">
          <div class="name">{{$t('finance.security.changeLoginPw.newLoginPwAgain')}}</div>
          <div class="val">
            <el-input v-model="remenber.affirmPwd" type="password" class="input">
            </el-input>
          </div>
          <div class="err-tip">{{errCode.rAffirmPwd}}</div>
        </div>

        <div class="item">
          <div class="btn-box">
            <el-button type="primary" class="next-btn" @click="remenberStepOne">{{$t('finance.security.changeLoginPw.submit')}}</el-button>
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
import {updatePwdByPrePwd, updatePwdByTxPwd} from "@/apis/user";

export default {
  mixins: [getUserInfo, vertify],
  components: {
    FinanceTitle,
    AlertVertify
  },
  data() {
    return {
      input: "",
      visible: false,
      remenberFlag: true,
      newPwdFlag: false,
      remenber: {
        prePwd: "",
        newPwd: "",
        affirmPwd: ""
      },
      forget: {
        acount: "",
        assetPwd: "",
        newPwd: "",
        affirmPwd: ""
      },
      errCode: {
        rPrePwd: '',
        rNewPwd: '',
        rAffirmPwd: '',
        fAccount: '',
        fAssetPwd: '',
        fNewPwd: '',
        fAffirmPwd: ''
      },
      serviceName: 'updatePwd'
    };
  },
  methods: {
    remenberStepOne() { // 记住原密码
      // 验证原密码
      let prePwdFlag = this.passwordVerify(this.remenber.prePwd)
      if (prePwdFlag) {
        this.errCode.rPrePwd = ''
      } else {
        this.errCode.rPrePwd = this.$t('finance.security.changeLoginPw.tips.loginPw')
        return
      }
      // 验证新密码
      let newPwdFlag = this.passwordVerify(this.remenber.newPwd)
      if (newPwdFlag) {
        this.errCode.rNewPwd = ''
      } else {
        this.errCode.rNewPwd = this.$t('finance.security.changeLoginPw.tips.loginPw')
        return
      }
      // 验证再次输入新密码
      let affirmPwdFlag = this.password2Verify(this.remenber.newPwd, this.remenber.affirmPwd)
      if (affirmPwdFlag) {
        this.errCode.rAffirmPwd = ''
      } else {
        this.errCode.rAffirmPwd = this.$t('finance.security.changeLoginPw.tips.differ')
        return
      }

      let postData = {
        serviceName: this.serviceName,
        prePwd: this.remenber.prePwd,
        newPwd: this.remenber.newPwd,
        // phoneVerifyCode: "",
        // emailVerifyCode: "",
        // googleCode: "",
        stepId: 0
      }
      updatePwdByPrePwd(postData).then((res) => {
        if (res.success) {
          this.visible = true
        } else {
          this.$message.error(res.message)
        }
      })
    },
    forgetStepOne() {
      // let accountFlag =
      // 验证资金密码
      let assetPwdFlag = this.txPasswordVerify(this.forget.assetPwd)
      if (assetPwdFlag) {
        this.errCode.fAssetPwd = ''
      } else {
        this.errCode.fAssetPwd = this.$t('finance.security.changeLoginPw.tips.assetsPw')
        return
      }

      // 应该要调用一个接口,验证登录密码是否正确
      let postData = {
        txPwd: this.forget.assetPwd,
        stepId: 0,
        serviceName: this.serviceName
        // phoneVerifyCode: "",
        // emailVerifyCode: "",
        // googleCode: "",
        // newPwd: ""
      }
      updatePwdByTxPwd(postData).then((res) => {
        if (res.success) {
          this.visible = true
        } else {
          this.$message.error(res.message)
        }
      })
    },
    alertSure(codeObj) {
      console.log(codeObj)
      if (this.remenberFlag) {
        let postData = {
          serviceName: this.serviceName,
          phoneVerifyCode: codeObj.phone,
          emailVerifyCode: codeObj.email,
          googleCode: codeObj.google,
          prePwd: this.remenber.prePwd,
          newPwd: this.remenber.newPwd,
          stepId: 1
        };
        updatePwdByPrePwd(postData).then(res => {
          if (res.success) {
            // this.$message.success('绑定成功')
            this.resultInfo = this.$t('finance.security.changeLoginPw.tips.success')
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
          txPwd: this.forget.assetPwd, // 资金密码
          // newPwd: "",
          stepId: 1
        }
        updatePwdByTxPwd(postData).then((res) => {
          if (res.success) {
            this.newPwdFlag = true
            this.alertClose();
          } else {
            // this.$message.error(res.message)
            this.resultInfo = res.message
          }
        })
      }
      // else if (!this.remenberFlag && this.newPwdFlag) {}
    },
    forgetStepThree() {
      // 验证新密码
      let newPwdFlag = this.passwordVerify(this.forget.newPwd)
      if (newPwdFlag) {
        this.errCode.fNewPwd = ''
      } else {
        this.errCode.fNewPwd = this.$t('finance.security.changeLoginPw.tips.loginPw')
        return
      }
      // 验证再次输入新密码
      let affirmPwdFlag = this.password2Verify(this.forget.newPwd, this.forget.affirmPwd)
      if (affirmPwdFlag) {
        this.errCode.fAffirmPwd = ''
      } else {
        this.errCode.fAffirmPwd = this.$t('finance.security.changeLoginPw.tips.differ')
        return
      }
      let postData = {
          // serviceName: this.serviceName,
          // phoneVerifyCode: "",
          // emailVerifyCode: "",
          // googleCode: "",
          txPwd: this.forget.assetPwd, // 资金密码
          newPwd: this.forget.newPwd,
          stepId: 2
        }
        updatePwdByTxPwd(postData).then((res) => {
          if (res.success) {
            // this.$message.success("修改成功")
            this.resultInfo = this.$t('finance.security.changeLoginPw.tips.success')
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
};
</script>
<style lang="scss" scoped>
.wrapper {
  // max-width: 460px;
  // padding-left: 10px;
  .first {
    .tip {
      @include fontsize("content3");
      color: $primary;
      margin-bottom: 30px;
      display: block;
      // height: 30px;
      line-height: 30px;
    }
    // border-bottom: 1px solid $line-color;
  }

  .input-box {
    padding-top: 40px;
    .item {
      // max-width: 476px;
      width: 100%;
      position: relative;
      display: flex;
      flex-direction: column;
      .name {
        @include fontsize("content3");
        color: $font-color4;
        margin-bottom: 10px;
      }
      .val {
        // margin-bottom: 30px;
        display: flex;
        .input {
          max-width: 476px;
          width: 100%;
          display: block;
          margin-right: 20px;
        }
        .forgetpw {
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
        @include phone {
          .input {
            margin-right: 0;
          }
        }
      }
      .forget-box {
        @include phone {
          flex-direction: column;
          // margin-bottom: 10px;
        }
      }
      .btn-box {
        max-width: 476px;
        .next-btn {
          width: 100%;
        }
      }
    }
  }
}
</style>
<style lang="scss">
.security .el-input-group__append {
  background-color: transparent;
  color: $primary;
}
</style>


