export default {
  data () {
    return {
      focus_area: false,
      focus_phone: false,
      focus_email: false,
      focus_password: false,
      focus_txPassword: false,
      focus_password2: false,
      focus_txPassword2: false,
      focus_verifyCode: false,
      focus_googleCode: false
    }
  },
  methods: {
    phoneVerify (phone) {
      if (phone.trim() === '') {
        this.focus_phone = true
        return false
      } else {
        let head = phone.substring(0, 1)
        let area = phone.substring(0, 3)
        let number = phone.substring(3)
        let reg = /^1[0-9]{10}$/
        if (head !== '+') {
          this.focus_phone = true
          return false
        }
        if (area === '+86') {
          if (reg.test(number)) {
            this.focus_phone = false
            return true
          } else {
            this.focus_phone = true
            return false
          }
        }
        this.focus_phone = false
        return true
      }
    },
    emailVerify (email) {
      let reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
      if (reg.test(email)) {
        this.focus_email = false
        return true
      } else {
        this.focus_email = true
        return false
      }
    },
    passwordVerify (password) {
      let reg = /^[a-zA-Z]\w{5,17}$/
      if (reg.test(password)) {
        this.focus_password = false
        return true
      } else {
        this.focus_password = true
        return false
      }
    },
    password2Verify (password, password1) {
      if (password === password1) {
        this.focus_password2 = false
        return true
      } else {
        this.focus_password2 = true
        return false
      }
    },
    txPasswordVerify (password) {
      let reg = /^[0-9]{6}$/
      if (reg.test(password)) {
        this.focus_txPassword = false
        return true
      } else {
        this.focus_txPassword = true
        return false
      }
    },
    txPassword2Verify (password, password1) {
      if (password === password1) {
        this.focus_txPassword2 = false
        return true
      } else {
        this.focus_txPassword2 = true
        return false
      }
    },
    codeVertify (code) { // 验证google二次验证码以及短信验证码
      code = ("" + code).trim()
      let reg = /^[0-9]{6}/
      let result = reg.test(code)
      if (result) {
        return true
      } else {
        return false
      }
    },
    hasNoError (type) {
      if (type === 'phone') {
        (!this.phoneVerify(this.phone_area + this.phone.phoneOrEmail)) && (this.$refs['focus_phone'].focus());
        (!this.passwordVerify(this.password)) && (this.$refs['focus_password'].focus());
        (!this.password2Verify(this.password, this.phone_pwConfirm1)) && (this.$refs['focus_password2'].focus());
        (!this.txPasswordVerify(this.txPassword)) && (this.$refs['focus_txPassword'].focus());
        (!this.txPassword2Verify(this.txPassword, this.phone_txpwConfirm1)) && (this.$refs['focus_txPassword2'].focus());
        if (this.focus_phone === false &&
          this.focus_password === false &&
          this.focus_txPassword === false &&
          this.focus_password2 === false &&
          this.focus_txPassword2 === false) {
            return true
          } else {
            return false
          }
      } else if (type === 'email') {
        (!this.phoneVerify(this.email.phoneOrEmail)) && (this.$refs['focus_email'].focus());
        (!this.passwordVerify(this.password)) && (this.$refs['focus_password'].focus());
        (!this.password2Verify(this.password, this.phone_pwConfirm1)) && (this.$refs['focus_password2'].focus());
        (!this.txPasswordVerify(this.txPassword)) && (this.$refs['focus_txPassword'].focus());
        (!this.txPassword2Verify(this.txPassword, this.phone_txpwConfirm1)) && (this.$refs['focus_txPassword2'].focus());
        if (this.focus_email === false &&
          this.focus_password === false &&
          this.focus_txPassword === false &&
          this.focus_password2 === false &&
          this.focus_txPassword2 === false) {
            return true
          } else {
            return false
          }
      }
    },
    codeVerify (code) {
      let reg = /^[0-9]{6}$/
      if (reg.test(code)) {
        this.focus_verifyCode = false
        return true
      } else {
        this.focus_verifyCode = true
        return false
      }
    },
    googleCodeVerify (code) {
      let reg = /^[0-9]{6}$/
      if (reg.test(code)) {
        this.focus_googleCode = false
        return true
      } else {
        this.focus_googleCode = true
        return false
      }
    }
  }
}
