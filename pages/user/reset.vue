<template>
  <div class="resetPage container" :style="`backgroundImage: url(${require('@/assets/img/userBg.png')})`">
    <UserCard class="user-page">
      <!-- 重置首页 -->
      <div v-if="showPage.one" slot="content">
        <div class="marginBot title" >{{$t('user.reset.title')}}</div>
        <el-tabs slot="content" v-model="resetType">
          <el-tab-pane :label="$t('user.reset.byPhone')" name="phone">
            <div class="phone" >
              <div class="myrow">
                <el-select v-model="phone_area" @change="phoneVerify(phone_area + phone.phoneOrEmail)">
                  <el-option value="+86">+86</el-option>
                </el-select>
                <el-input v-model="phone.phoneOrEmail" :placeholder="$t('common.phoneNumber')" ref="focus_phone"></el-input>
              </div>
              <div class="errorBox"><div class="error" v-show="focus_phone">{{$t('common.errMsg.phone')}}</div></div>
              <MyButton :text="$t('user.reset.nextStep')" class="marginBot" style="margin-bottom: 10px;" @click.native="resetNext('phone')"></MyButton>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="$t('user.reset.byEmail')" name="email">
            <div class="phone" >
              <div class=""><el-input :placeholder="$t('common.email')" v-model="email.phoneOrEmail" ref="focus_email"></el-input></div>
              <div class="errorBox"><div class="error" v-show="focus_email">{{$t('common.errMsg.email')}}</div></div>
              <MyButton :text="$t('user.reset.nextStep')" class="marginBot" style="margin-bottom: 10px;" @click.native="resetNext('email')"></MyButton>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
      <!-- 重置验证 -->
      <div class="phone" slot="content" v-if="showPage.two">
        <div class="marginBot title">{{$t('user.reset.security')}}</div>
        <!-- <el-input class="marginBot" placeholder="111****111@qq.com（绑定邮箱）" disabled></el-input> -->
        <div v-if="bindInfo.email"><send-code class="marginBot" :sendHandle="sendCodeEmail" :placeholder="`${bindInfo.email}（绑定邮箱）`" :disabledInput="true" noError></send-code>
          <el-input class="" :placeholder="$t('common.code.email')" v-model="code.email" ref="focus_emailCode"></el-input>
          <div class="errorBox"><div class="error" v-show="focus_emailCode">{{$t('common.errMsg.emailCode')}}</div></div>
        </div>
        <div v-if="bindInfo.phone" ><send-code class="marginBot" :sendHandle="sendCodePhone" :placeholder="`${bindInfo.phone}（绑定手机）`" :disabledInput="true" noError></send-code>
          <el-input class="" :placeholder="$t('common.code.phone')" v-model="code.phone" ref="focus_phoneCode"></el-input>
          <div class="errorBox"><div class="error" v-show="focus_phoneCode">{{$t('common.errMsg.phoneCode')}}</div></div>
        </div>
        <div v-if="bindInfo.isBindGlAtu">
          <el-input class="marginBot" :placeholder="$t('common.code.google')" v-model="code.google" ref="focus_googleCode" @input="googleCodeVerify(loginData.googleCode)"></el-input>
          <div class="errorBox"><div class="error" v-show="focus_googleCode">{{$t('common.errMsg.googleCode')}}</div></div>
        </div>
        
        <MyButton :text="$t('common.submit')" @click.native="verifyHandle()"></MyButton>
      </div>

       <!-- 重置密码 -->
       <div slot="content" v-if="showPage.three">
        <div class="marginBot title">{{$t('user.reset.title')}}</div>
        <el-input class="" type="password" v-model="newPwd" :placeholder="$t('user.reset.newPw')" ref="focus_password" @blur="passwordVerify(newPwd)"></el-input>
        <div class="errorBox"><div class="error" v-show="focus_password">{{$t('common.errMsg.password')}}</div></div> 
        <el-input class="" type="password" v-model="newPwd2" :placeholder="$t('user.reset.newPw2')" ref="focus_password2" @blur="password2Verify(newPwd, newPwd2)"></el-input>
        <div class="errorBox"><div class="error" v-show="focus_password2">{{$t('common.errMsg.password2')}}</div></div>
        <MyButton :text="$t('user.reset.confirmChange')" @click.native="resetHandle()"></MyButton>
       </div>
    </UserCard>
  </div>
</template>
<script>
import MyButton from '@/components/Button'
import UserCard from '@/components/user/card'
import SendCode from '@/components/sendCode'
import {mapState, mapActions} from 'vuex'
import verify from "@/mixins/user/verify";
export default {
  mixins: [verify],
  components: {
    MyButton,
    UserCard,
    SendCode
  },
  data () {
    return {
      phone: {
        phoneOrEmail: ''
      },
      email: {
        phoneOrEmail: ''
      },
      code: {
        phone: '',
        email: '',
        google: ''
      },
      focus_phoneCode: false,
      focus_emailCode: false,
      resetData: {},
      phone_area: '+86',
      agreen: false,
      login: true,
      activeName: 'google',
      resetType: 'phone',
      newPwd: '',
      newPwd2: '',
      showPage: {
        one: true,
        two: false,
        three: false
      }
    }
  },
  computed: {
    ...mapState({
      bindInfo: state => state.user.bindInfo
    })
  },
  created () {
  },
  methods: {
    ...mapActions('user', ['GET_BIND_BY_ACCOUNT', 'RESET', 'SEND_CODE']),
    show (arg) {
      for (let key in this.showPage) {
        this.showPage[key] = false
      }
      this.showPage[arg] = true
    },
    async resetNext (type) {
      if (type === "phone") {
        if (!this.phoneVerify(this.phone_area + this[type].phoneOrEmail)) {
          this.$refs['focus_phone'].focus()
          return
        }
      }
      if (type === "email") {
        if (!this.emailVerify(this[type].phoneOrEmail)) {
          this.$refs['focus_email'].focus()
          return
        }
      }
      this.resetData = Object.assign({}, this[type])
      if (type === 'phone') {
        this.resetData.phoneOrEmail = this.phone_area + this[type].phoneOrEmail
      }
      let result = await this.GET_BIND_BY_ACCOUNT({...this.resetData})
      console.log(result)
      result && this.show('two')
    },
    async sendCodeEmail () {
      let phoneOrEmail = this.email.phoneOrEmail
      let serviceName = "retrievePwd"
      let result = await this.SEND_CODE({phoneOrEmail: phoneOrEmail, serviceName: serviceName})
      return result
    },
    async sendCodePhone () {
      let phoneOrEmail = this.phone_area + this.phone.phoneOrEmail
      let serviceName = "retrievePwd"
      let result = await this.SEND_CODE({phoneOrEmail: phoneOrEmail, serviceName: serviceName})
      return result
    },
    async verifyHandle () {
      if (this.code.email && !this.codeVerify(this.code.email)) {
        this.focus_emailCode = true
        this.$refs['focus_emailCode'].focus()
        return
      }
      if (this.code.phone && !this.codeVerify(this.code.phone)) {
        this.focus_phoneCode = true
        this.$refs['focus_phoneCode'].focus()
        return
      }
      if (this.code.google && !this.googleCodeVerify(this.code.google)) {
        this.$refs['focus_googleCode'].focus()
        return
      }
      this.focus_emailCode = false
      this.focus_phoneCode = false
      let data = Object.assign({
        serviceName: "retrievePwd",
        stepId: 0,
        phoneVerifyCode: this.code.phone,
        emailVerifyCode: this.code.email,
        googleCode: this.code.google,
        newPwd: this.newPwd
      }, this.resetData)
      let result = await this.RESET(data)
      result && this.show('three')
    },
    async resetHandle () {
      if (!this.passwordVerify(this.newPwd)) {
        this.$refs['focus_password'].focus();
        return
      }
      if (!this.password2Verify(this.newPwd, this.newPwd2)) {
        this.$refs['focus_password2'].focus();
        return
      }
      let data = Object.assign({
        serviceName: "retrievePwd",
        stepId: 1,
        phoneVerifyCode: this.code.phone,
        emailVerifyCode: this.code.email,
        googleCode: this.code.google,
        newPwd: this.newPwd
      }, this.resetData)
      let result = await this.RESET(data)
      if (result) {
        this.$message({
          message: '修改成功',
          type: 'success'
        })
        this.$i18n.push('/user/login')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.errorBox {
  color: $font-color6;
  @include fontsize("small");
  margin-top: 5px;
  height: 24px;
}
.resetPage{
  background-color: #10172A;
  background-size: cover;
  .phone{
    .title{
      @include fontsize('title2');
      color: $font-color2;
    }
    .myrow{
      display: flex;
      justify-content: space-between;
      select{
        height: 40px;
        flex: 1;
        margin-right: 20px;
      }
      .el-input{
        flex: 2;
      }
    }
    .marginBot{
      .notice{
        @include fontsize('small');

      }
    }
    .el-checkbox{
      .checkText{
        color: $font-color8;
        @include fontsize('content3');
      }
      .text{
        color: $font-color2;
        @include fontsize('content3');
      }
    }
    .forget{
      @include fontsize('content3');
      color: $font-color8;
    }
  }
  .noAcc{
    @include pc{
      margin-top: 78px;
    };
    @include pad{
      margin-top: 28px;
    };
    @include phone{
      margin-top: 28px;
    };
    @include fontsize('small');
  }
  .plz{
    @include fontsize('content3');
    @include pc{
      margin: 30px 0;
    }
    @include notpc{
      margin: 15px 0;
    }
    color: $primary;
  }
}

</style>