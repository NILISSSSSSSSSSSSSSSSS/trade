<template>
<div style="width: 100%">
  <UserCard v-if="showLogin" class="user-page">
    <div class="marginBot title" slot="content">{{$t('user.login.welcome')}}</div>
    <div slot="content" class="phone">
      <el-tabs v-model="loginType">
        <el-tab-pane :label="$t('user.login.byPhone')" name="phone">
          <div class="phone">
            <div class="myrow">
              <el-select v-model="phone_area" @change="phoneVerify(phone_area + phone.phoneOrEmail)">
                <el-option value="+86">+86</el-option>
              </el-select>
              <el-input v-model="phone.phoneOrEmail" :placeholder="$t('common.phoneNumber')" ref="focus_phone" @blur="phoneVerify(phone_area + phone.phoneOrEmail)"></el-input>
            </div>
            <div class="errorBox">
              <div class="error" v-show="focus_phone">{{$t('common.errMsg.phone')}}</div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane :label="$t('user.login.byEmail')" name="email">
          <div class="phone">
            <div class="">
              <el-input :placeholder="$t('common.email')" v-model="email.phoneOrEmail" ref="focus_email" @blur="emailVerify(email.phoneOrEmail)"></el-input>
            </div>
            <div class="errorBox">
              <div class="error" v-show="focus_email">{{$t('common.errMsg.email')}}</div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
      <div class="">
        <el-input :placeholder="$t('user.login.password')" type="password" v-model="password" ref="focus_password" @blur="passwordVerify(password)"></el-input>
      </div>
      <div class="errorBox">
        <div class="error" v-show="focus_password">{{$t('common.errMsg.password')}}</div>
      </div>
      <MyButton :text="$t('user.login.title')" class="marginBot" style="margin-bottom: 10px;" @click.native="goVerify()"></MyButton>
      <nuxt-link class="forget" :to="$i18n.path('/user/reset')">{{$t('user.login.forgetPw')}}</nuxt-link>
    </div>
    <div class="noAcc" slot="content">
      <div>{{$t('user.login.noAcc')}}</div>
      <div>{{$t('user.login.regNow')}}</div>
      <nuxt-link :to="$i18n.path('/user/register')">{{$t('user.login.regFree')}}</nuxt-link>
    </div>
  </UserCard>
  <!-- 两步验证 -->
  <UserCard v-else class="user-page">
    <div class="phone" slot="content">
      <div class="marginBot title">{{$t('common.twoStep.title')}}</div>
      <div href="javascript: void(0)" class="marginBot plz">{{$t('common.twoStep.inputCode')}}</div>
      <el-input class="" :placeholder="$t('common.twoStep.googleCode')" v-model="loginData.googleCode" ref="focus_googleCode" @input="googleCodeVerify(loginData.googleCode)"></el-input>
      <div class="errorBox">
        <div class="error" v-if="focus_googleCode">{{$t('common.errMsg.googleCode')}}</div>
      </div>
      <MyButton :text="$t('user.login.title')" @click.native="loginHandle()"></MyButton>
    </div>
  </UserCard>
</div>
</template>

<script>
import MyButton from '@/components/Button'
import UserCard from '@/components/user/card'
import {
  mapState,
  mapActions
} from 'vuex'
import verify from '@/mixins/user/verify'
export default {
  mixins: [verify],
  components: {
    MyButton,
    UserCard
  },
  data() {
    return {
      phone: {
        phoneOrEmail: ''
      },
      email: {
        phoneOrEmail: ''
      },
      password: '',
      loginData: {
        phoneOrEmail: '',
        password: '',
        googleCode: ''
      },
      phone_area: '+86',
      agreen: false,
      showLogin: true,
      activeName: 'google',
      loginType: 'phone'
    }
  },
  watch: {},
  methods: {
    ...mapActions('user', ['LOGIN', 'SET_TOKEN', 'USER_INFO']),
    async goVerify() {
      //  本地数据格式验证
      let type = this.loginType
      let data = Object.assign({}, this[type])
      let flag = ''
      if (type === 'phone') {
        if (!this.phoneVerify(this.phone_area + data.phoneOrEmail)) {
          this.$refs['focus_phone'].focus()
          return
        }
        if (!this.passwordVerify(this.password)) {
          this.$refs['focus_password'].focus()
          return
        }
        data.phoneOrEmail = this.phone_area + data.phoneOrEmail
        flag = "verify_phone"
      } else if (type === 'email') {
        if (!this.emailVerify(data.phoneOrEmail)) {
          this.$refs['focus_email'].focus()
          return
        }
        if (!this.passwordVerify(this.password)) {
          this.$refs['focus_password'].focus()
          return
        }
        flag = "verify_email"
      }
      if (flag === '') {
        return
      }
      data.password = this.password
      // let result = await this.CHECK_EXIST(data)
      let result = true
      if (result) {
        this.loginData = Object.assign(this.loginData, data)
        let result = await this.LOGIN({ ...this.loginData,
          stepId: 0
        })
        console.log(result)
        if (result.success) {
          if (result.data.waitForGoogleAuth) {
            this.showLogin = false
            this[flag] = true
          } else {
            this.SET_TOKEN(result.data.token)
            this.USER_INFO()
            let returnUrl = this.$route.query.returnurl || null
            if (returnUrl) {
              window.location.href = `${window.location.origin}${decodeURIComponent(returnUrl)}}`
            } else {
              window.location.href = `${window.location.origin}?lang=${this.$route.query.lang}`
            }
            // this.$i18n.push('/')
            // window.location.href('/')
          }
        }
      }
      //  服务器端合法性与可用性验证
    },
    async loginHandle() {
      //  本地验证数据合法性
      if (!this.googleCodeVerify(this.loginData.googleCode)) {
        return
      }
      let result = await this.LOGIN({ ...this.loginData,
        stepId: 1
      })
      if (result.success) {
        this.SET_TOKEN(result.data.token)
        this.USER_INFO()
        let returnUrl = this.$route.query.returnurl || null
        if (returnUrl) {
          window.location.href = `${window.location.origin}${decodeURIComponent(returnUrl)}}`
        } else {
          window.location.href = `${window.location.origin}?lang=${this.$route.query.lang}`
        }
        // this.$i18n.push('/')
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

.phone {
  .title {
    @include fontsize('title2');
    color: $font-color2;
  }
  .myrow {
    display: flex;
    justify-content: space-between;
    select {
      height: 40px;
      flex: 1;
      margin-right: 20px;
    }
    .el-input {
      flex: 2;
    }
  }
  .marginBot {
    .notice {
      @include fontsize('small');
    }
  }
  .el-checkbox {
    .checkText {
      color: $font-color8;
      @include fontsize('content3');
    }
    .text {
      color: $font-color2;
      @include fontsize('content3');
    }
  }
  .forget {
    @include fontsize('content3');
    color: $font-color8;
  }
}

.noAcc {
  @include pc {
    margin-top: 78px;
  }
  ;
  @include pad {
    margin-top: 28px;
  }
  ;
  @include phone {
    margin-top: 28px;
  }
  ;
  @include fontsize('small');
}

.plz {
  @include fontsize('content3');
  @include pc {
    margin: 30px 0;
  }
  @include notpc {
    margin: 15px 0;
  }
  color: $primary;
}
</style>
