<template>
<div style="width: 100%">
  <UserCard v-if="register" class="user-page">
    <div slot="content">
    <el-tabs v-model="activeName" >
      <el-tab-pane label="手机注册" name="phone" >
        <div class="phone">
          <div class="myrow">
            <el-select v-model="phone_area">
              <el-option value="+86">+86</el-option>
            </el-select>
            <el-input v-model="phone.phoneOrEmail" placeholder="手机号" @input="phoneVerify(phone_area + phone.phoneOrEmail)"></el-input>
          </div>
          <div class="errorBox"><div class="error" v-show="focus_phone">手机格式错误</div></div>
          
        </div>
      </el-tab-pane>
      <el-tab-pane label="邮箱注册" name="email">
        <div class="phone">
          <div class="">
            <el-input placeholder="邮箱号" v-model="email.phoneOrEmail" @input="emailVerify(email.phoneOrEmail)"></el-input>
          </div>
          <div class="errorBox"><div class="error" v-show="focus_email">邮箱格式错误</div></div>
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
            <el-input placeholder="设置登录密码" type="password" v-model="password" @input="passwordVerify(password)"></el-input>
            <!-- <div class="pwSecury">
              <div class="cur">弱</div>
              <div>中</div>
              <div>强</div>
            </div>-->
            <div class="errorBox"><div class="error" v-show="focus_password">以字母开头，6-18位字符、数字和下划线组成</div></div> 
          </div>
          <div class=""><el-input placeholder="再次确认登录密码" type="password" v-model="phone_pwConfirm1" @input="password2Verify(password, phone_pwConfirm1)"></el-input></div>
          <div class="errorBox"><div class="error" v-show="focus_password2">两次密码设置不一致</div></div> 
          <div class=""><el-input placeholder="设置资金密码" type="password" v-model="txPassword" @keyup.native="limitTxpw" @input="txPasswordVerify(txPassword)"></el-input><a href="javascript:void(0)" class="notice">用于提现，请牢记，不可与登录密码相同</a></div>
          <div class="errorBox"><div class="error" v-show="focus_txPassword">资金密码必须是6位数字</div></div> 
          <div class=""><el-input placeholder="再次设置资金密码" type="password" maxlength="6" v-model="phone_txpwConfirm1" @keyup.native="limitTxpw1" @input="txPassword2Verify(txPassword, phone_txpwConfirm1)"></el-input></div>
          <div class="errorBox"><div class="error" v-show="focus_txPassword2">两次资金密码不一致</div></div>
          <el-checkbox v-model="agreen"><span class="checkText">我已阅读并同意</span><span class="text">《用户使用协议》</span></el-checkbox>
          <MyButton text="注册" class="marginBot" style="margin-top: 10px;" @click.native="goVerify" ></MyButton>
          <div class="goLogin"><span class="hasAcc">已有平台账号？</span><nuxt-link :to="$i18n.path('/user/login')">立即登录</nuxt-link></div>
    </div>
    
  </UserCard>
  <UserCard v-else class="user-page">
    <div class="verify_email verify" slot="content" v-if="verify_email">
      <div class="title">输入验证码</div>
      <div>请输入邮箱 <span class="account">{{email.phoneOrEmail}}</span> 收到的验证码</div>
      <div>
        <send-code @transCode="getCode" placeholder="邮箱验证码" :sendHandle="verify"></send-code>
      </div>
      <MyButton text="完成注册" @click.native="registerHandle('email')"></MyButton>
    </div>

    <div class="verify_phone verify" slot="content" v-if="verify_phone">
      <div class="title">输入验证码</div>
      <div>请输入手机号 <span class="account">{{phone.phoneOrEmail}}</span> 收到的验证码</div>
      <div>
        <send-code  @transCode="getCode" placeholder="手机验证码" :sendHandle="verify"></send-code>
      </div>
      <MyButton text="完成注册" @click.native="registerHandle('phone')"></MyButton>
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
        phoneOrEmail: "15928744355"
      },
      email: {
        phoneOrEmail: "279564063@qq.com"
      },
      password: "rxx112233",
      txPassword: "111111",
      phone_area: "+86",
      phone_pwConfirm1: "rxx112233",
      phone_txpwConfirm1: "111111",
      regData: {},
      agreen: false,
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
      let data = Object.assign({}, this[type]);
      if (type === "phone" && this.hasNoError("phone")) {
        data.phoneOrEmail = this.phone_area + data.phoneOrEmail
        let result = await this.CHECK_EXIST({
          phoneOrEmail: data.phoneOrEmail
        });
        if (!result) {
          return;
        }
        this.verify_phone = true;
        this.register = false;
        data.password = this.password;
        data.txPassword = this.txPassword;
        this.regData = data;
      }
      if (type === "email" && this.hasNoError("email")) {
        let result = await this.CHECK_EXIST({
          phoneOrEmail: data.phoneOrEmail
        });
        if (!result) {
          return;
        }
        this.verify_email = true;
        this.register = false;
        data.password = this.password;
        data.txPassword = this.txPassword;
        this.regData = data;
      }
    },
    async verify () {
      let phoneOrEmail = this.regData.phoneOrEmail
      let serviceName = "signUp"
      let result = await this.SEND_CODE({phoneOrEmail: phoneOrEmail, serviceName: serviceName})
      return result
    },
    async registerHandle() {
      if (!this.codeVerify(this.regData.code)) {
        return
      }
      this.regData.txPassword = Number(this.regData.txPassword)
      let result = await this.REGISTER(this.regData);
      result && this.$i18n.push("/user/login");
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

