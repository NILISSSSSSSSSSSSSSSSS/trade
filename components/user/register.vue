<template>
<div style="width: 100%">
  <UserCard v-if="register" class="user-page">
    <div slot="content">
    <el-tabs v-model="activeName" >
      <el-tab-pane :label="$t('user.reg.byPhone')" name="phone" >
        <div class="phone">
          <div class="myrow">
            <el-select v-model="phone_area" @change="phoneVerify(phone_area + phone.phoneOrEmail)">
              <el-option value="+86">+86</el-option>
            </el-select>
            <el-input v-model="phone.phoneOrEmail" :placeholder="$t('common.phoneNumber')" ref="focus_phone" @blur="phoneVerify(phone_area + phone.phoneOrEmail)"></el-input>
          </div>
          <div class="errorBox"><div class="error" v-show="focus_phone">{{$t('common.errMsg.phone')}}</div></div>
          
        </div>
      </el-tab-pane>
      <el-tab-pane :label="$t('user.reg.byEmail')" name="email">
        <div class="phone">
          <div class="">
            <el-input :placeholder="$t('common.email')" v-model="email.phoneOrEmail" ref="focus_email" @blur="emailVerify(email.phoneOrEmail)"></el-input>
          </div>
          <div class="errorBox"><div class="error" v-show="focus_email">{{$t('common.errMsg.email')}}</div></div>
          <!-- <div class=""><el-input placeholder="设置登录密码" v-model="email.password"></el-input></div>
          <div class="errorBox"><div class="error">6-18位，且为数字、字母的任意组合！</div></div> 
          <div class=""><el-input placeholder="再次确认登录密码" v-model="email_pwConfirm1"></el-input></div>
          <div class="errorBox"><div class="error">两次密码设置不一致</div></div>
          <div class=""><el-input placeholder="设置资金密码" v-model="email.txPassword"></el-input ><a href="javascript:void(0)" class="notice">用于提现，请牢记，不可与登录密码相同</a></div>
          <div class="errorBox"><div class="error">资金密码必须是6位数字</div></div>
          <div class=""><el-input placeholder="再次设置资金密码" v-model="email_txpwConfirm1"></el-input></div>
          <div class="errorBox"><div class="error">两次资金密码不一致</div></div>
          <el-checkbox v-model="agreen"><span class="checkText">我已阅读并同意</span><span class="text">《用户使用协议》</span></el-checkbox>
          <MyButton text="注册" class="marginBot" style="margin-top: 10px;" @click.native="goVerify('email')"></MyButton>
          <div class="goLogin"><span class="hasAcc">已有平台账号？</span><nuxt-link :to="$i18n.path('/user/login')">立即登录</nuxt-link></div> -->
        </div>
      </el-tab-pane>
    </el-tabs>
    <div class="">
            <el-input :placeholder="$t('user.reg.loginPw')" type="password" v-model="password" ref="focus_password" @blur="passwordVerify(password)"></el-input>
            <!-- <div class="pwSecury">
              <div class="cur">弱</div>
              <div>中</div>
              <div>强</div>
            </div>-->
            <div class="errorBox"><div class="error" v-show="focus_password">{{$t('common.errMsg.password')}}</div></div> 
          </div>
          <div class=""><el-input :placeholder="$t('user.reg.loginPw2')" type="password" v-model="phone_pwConfirm1" ref="focus_password2" @blur="password2Verify(password, phone_pwConfirm1)"></el-input></div>
          <div class="errorBox"><div class="error" v-show="focus_password2">{{$t('common.errMsg.password2')}}</div></div> 
          <div class=""><el-input :placeholder="$t('user.reg.txPw')" type="password" maxlength="6" v-model="txPassword" ref="focus_txPassword" @keyup.native="limitTxpw" @blur="txPasswordVerify(txPassword)"></el-input><a href="javascript:void(0)" class="notice">{{$t('user.reg.txPwNotice')}}</a></div>
          <div class="errorBox"><div class="error" v-show="focus_txPassword">{{$t('common.errMsg.txPw')}}</div></div> 
          <div class=""><el-input :placeholder="$t('user.reg.txPw2')" type="password" maxlength="6" v-model="phone_txpwConfirm1" ref="focus_txPassword2" @keyup.native="limitTxpw1" @blur="txPassword2Verify(txPassword, phone_txpwConfirm1)"></el-input></div>
          <div class="errorBox"><div class="error" v-show="focus_txPassword2">{{$t('common.errMsg.txPw2')}}</div></div>
          <el-checkbox v-model="agree"><span class="checkText">{{$t('user.reg.readAndAgree')}}</span><span class="text">{{$t('user.reg.protocol')}}</span></el-checkbox>
          <MyButton :text="$t('user.reg.title')" class="marginBot" style="margin-top: 10px;" @click.native="goVerify" ></MyButton>
          <div class="goLogin"><span class="hasAcc">{{$t('user.reg.hasAcc')}}</span><nuxt-link :to="$i18n.path('/user/login')">{{$t('user.reg.loginNow')}}</nuxt-link></div>
    </div>
    
  </UserCard>
  <UserCard v-else class="user-page">
    <div class="verify_email verify" slot="content" v-if="verify_email">
      <div class="title">{{$t('common.inputCode')}}</div>
      <div>{{$t('user.reg.plzInputEmail')}} <span class="account">{{email.phoneOrEmail}}</span> {{$t('user.reg.receiveCode')}}</div>
      <div>
        <send-code @transCode="getCode" :placeholder="$t('common.emailCode')" :sendHandle="verify"></send-code>
      </div>
      <MyButton :text="$t('user.reg.complete')" @click.native="registerHandle('email')"></MyButton>
    </div>

    <div class="verify_phone verify" slot="content" v-if="verify_phone">
      <div class="title">{{$t('common.inputCode')}}</div>
      <div>{{$t('user.reg.plzInputPhone')}} <span class="account">{{phone.phoneOrEmail}}</span> {{$t('user.reg.receiveCode')}}</div>
      <div>
        <send-code  @transCode="getCode" :placeholder="$t('common.phoneCode')" :sendHandle="verify"></send-code>
      </div>
      <MyButton :text="$t('user.reg.complete')" @click.native="registerHandle('phone')"></MyButton>
    </div>
  </UserCard>
</div>
</template>
<script>
import MyButton from "@/components/Button";
import UserCard from "@/components/user/card";
import SendCode from "@/components/sendCode";
import { mapState, mapActions } from "vuex";
import verify from "@/mixins/user/verify";
export default {
  mixins: [verify],
  components: {
    MyButton,
    UserCard,
    SendCode
  },
  data() {
    return {
      activeName: "phone",
      phone: {
        phoneOrEmail: ""
      },
      email: {
        phoneOrEmail: ""
      },
      password: "",
      txPassword: "",
      phone_area: "+86",
      phone_pwConfirm1: "",
      phone_txpwConfirm1: "",
      regData: {},
      agree: false,
      register: true,
      verify_email: false,
      verify_phone: false
    };
  },
  methods: {
    ...mapActions("user", ["CHECK_EXIST", "SEND_CODE", "REGISTER"]),
    limitTxpw1() {
      this.phone_txpwConfirm1 = this.phone_txpwConfirm1.replace(/[\D]/g, "");
    },
    limitTxpw() {
      this.txPassword = this.txPassword.replace(/[\D]/g, "");
    },
    getCode(code) {
      this.regData.verifyCode = code;
    },
    async goVerify() {
      let type = this.activeName;
      this.regData = Object.assign(this.regData, this[type]);
      this.regData.password = this.password;
      this.regData.txPassword = this.txPassword
      if (type === "phone" && this.hasNoError("phone")) {
        if (!this.agree) {
          this.$message.error('请同意《用户使用协议》')
          return
        }
        this.regData.phoneOrEmail = this.phone_area + this.regData.phoneOrEmail
        let result = await this.REGISTER({...this.regData, stepId: 0});
        if (!result) {
          return;
        }
        this.verify_phone = true;
        this.register = false;
      }
      if (type === "email" && this.hasNoError("email")) {
        if (!this.agree) {
          this.$message.error('请同意《用户使用协议》')
          return
        }
        let result = await this.REGISTER({...this.regData, stepId: 0});
        if (!result) {
          return;
        }
        this.verify_email = true;
        this.register = false;
      }
    },
    async verify () {
      let phoneOrEmail = this.regData.phoneOrEmail
      let serviceName = "signUp"
      let result = await this.SEND_CODE({phoneOrEmail: phoneOrEmail, serviceName: serviceName})
      return result
    },
    async registerHandle() {
      console.log(this.codeVerify(this.regData.verifyCode))
      if (!this.codeVerify(this.regData.verifyCode)) {
        return
      }
      let result = await this.REGISTER({...this.regData, stepId: 1});
      if (result) {
        this.$message({
          message: '注册成功',
          type: 'success'
        })
        this.$i18n.push("/user/login")
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.myrow {
  & > .el-select {
    width: 40%;
    /deep/ .el-input__inner {
      border-right: 0;
      border-bottom-right-radius: 0;
      border-top-right-radius: 0;
    }
  }
  & > .el-input {
    /deep/ .el-input__inner {
      border-bottom-left-radius: 0;
      border-top-left-radius: 0;
    }
  }
}
.errorBox {
  color: $font-color6;
  @include fontsize("small");
  margin-top: 5px;
  height: 24px;
}
.pwSecury {
  display: flex;
  width: 100%;
  & > div {
    flex: 1;
    text-align: center;
    @include fontsize("small");
    margin-top: 5px;
    color: $font-color2;
  }
  .cur {
    background-color: $font-color6;
    color: $font-color1;
  }
}

.notice {
  @include fontsize("small");
}
.el-checkbox {
  .checkText {
    color: $font-color8;
    @include fontsize("content3");
  }
  .text {
    color: $font-color2;
    @include fontsize("content3");
  }
}
.goLogin {
  @include fontsize("content3");
  text-align: center;
  .hasAcc {
    color: $font-color2;
  }
}
.verify > div {
  @include pc {
    margin-bottom: 30px;
  }
  @include pad {
    margin-bottom: 30px;
  }
  @include phone {
    margin-bottom: 15px;
  }
  &:nth-child(2) {
    @include fontsize("content2");
  }
  .account {
    color: $primary;
  }
}
</style>