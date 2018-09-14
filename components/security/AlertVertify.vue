<template>
  <el-dialog
    center
    :visible="visible"
    :show-close="false"
    class="dialog my-dialog"
    >
    <div class="content">
      <div class="close-tag" @click="close">
        <i class="el-icon-close"></i>
      </div>
      <header class="head">安全验证</header>

      <!-- 邮箱验证 -->
      <div v-if="vertifyData.email">
        <div class="item">
          <el-input disabled class="valicode-input" v-model="emailText">
            <template slot="append">
              <i class="line" :class="geted ? 'click-before' : 'click-after'"></i>
              <em v-if="geted" @click="getCode('email')">获取验证码</em>
              <span v-else>重发({{time}})s</span>
            </template>
          </el-input>
          <span class="err-tip"></span>
        </div>
        <div class="item" >
          <el-input placeholder="邮箱验证码" v-model="code.email">
          </el-input>
          <span class="err-tip" >{{errTip.email}}</span>
        </div>
      </div>
      <!-- 手机验证 -->
      <div v-if="vertifyData.phone">
        <div class="item">
          <el-input disabled class="valicode-input" v-model="phoneText">
            <template slot="append">
              <i class="line" :class="geted ? 'click-before' : 'click-after'"></i>
              <em v-if="geted" @click="getCode('phone')">获取验证码</em>
              <span v-else>重发({{time}})s</span>
            </template>
          </el-input>
          <span class="err-tip"></span>
        </div>
        <div class="item">
          <el-input placeholder="短信验证码" v-model="code.phone">
          </el-input>
          <span class="err-tip" >{{errTip.phone}}</span>
        </div>
      </div>
      <!-- google验证 -->
      <div class="item" v-if="vertifyData.google && googleFlag">
        <el-input placeholder="谷歌验证码" v-model="code.google">
        </el-input>
        <span class="err-tip" >{{errTip.google}}</span>
      </div>

      <div class="item">
        <el-button class="btn" type="primary" @click="sure">提交</el-button>
      </div>

      <div class="msg-tip" v-show="resultInfo">
        <span>
          <!-- 绑定成功 -->
          {{resultInfo}}
        </span>
      </div>

    </div>
  </el-dialog>
</template>
<script>
// import {getVertifyCode} from "@/apis/security"
import {getVertifyCode} from "@/apis/default"
export default {
  props: {
    vertifyData: {
      type: Object,
      default: function() {
        return {}
      }
    },
    visible: {
      type: Boolean,
      default: false
    },
    serviceName: {
      type: String,
      default: 'signUp'
    },
    resultInfo: {
      type: String,
      default: ''
    },
    googleFlag: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      code: {
        email: '',
        phone: '',
        google: ''
      },
      errTip: {
        email: '',
        phone: '',
        google: ''
      },
      geted: true,
      time: 60
    }
  },
  computed: {
    phoneText() {
      let phone = (this.vertifyData.phone).toString()
      if (phone) {
        let lens = phone.length
        return phone.slice(0, lens - 8) + '****' + phone.slice(lens - 4) + "(绑定手机)"
      }
      return ''
    },
    emailText() {
      let email = (this.vertifyData.email).toString()
      if (email) {
        let splitAfter = email.split("@")[1]
        return email.slice(0, 3) + '****@' + splitAfter + "(绑定邮箱)"
      }
      return ''
    }
  },
  methods: {
    sure() {
      console.log('emit1')
      // 验证手机验证码
      if (this.vertifyData.phone) {
        let vertifyPhone = this.vertifyCode(this.code.phone)
        if (!vertifyPhone) {
          this.errTip.phone = '请输入正确的短信验证码'
          return
        }
      }
      // 验证邮箱验证码
      if (this.vertifyData.email) {
        let vertifyEmail = this.vertifyCode(this.code.email)
        if (!vertifyEmail) {
          this.errTip.email = '请填入正确的邮箱验证码'
          return
        }
      }
      // 验证google验证码
      if (this.vertifyData.google && this.googleFlag) {
        let vertifyGoogle = this.vertifyCode(this.code.google)
        if (!vertifyGoogle) {
          this.errTip.google = '请输入正确的google验证码'
          return
        }
      }
      console.log('emit')
      this.$emit('sure', this.code)
    },
    close() {
      this.code = {
        email: '',
        phone: '',
        google: ''
      }
      this.errTip = {
        email: '',
        phone: '',
        google: ''
      }
      this.$emit('close')
    },
    vertifyCode(code) {
      code = code.trim()
      let reg = /[0-9]{6}/
      let result = reg.test(code)
      if (result) {
        return true
      } else {
        return false
      }
    },
    getCode(flag) {
      let data = {
        serviceName: this.serviceName,
        phoneOrEmail: ""
      }
      if (flag === 'phone') {
        data.phoneOrEmail = this.vertifyData.phone
      } else if (flag === 'email') {
        data.phoneOrEmail = this.vertifyData.email
      }
          // this.countDown()
      getVertifyCode(data).then((res) => {
        if (res.success) {
          this.$message.success("获取验证码成功")
          this.countDown()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    countDown () {
      var time = 60
      var timer = setInterval(() => {
        time--
        if (time > 0) {
          this.time = time
          this.geted = false
        } else {
          this.geted = true
          clearInterval(timer)
        }
      }, 1000)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>


