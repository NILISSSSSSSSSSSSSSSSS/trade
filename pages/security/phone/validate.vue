<template>
  <div class="wrapper">
    <section class="first border-bottom">
      <FinanceTitle title="绑定手机" icon="icon-bangdingshouji"></FinanceTitle>
      <span class="tip" v-if="!vertifyData.phone">
        手机号绑定后不可修改
      </span>

      <span class="binded-tip tip" v-if="vertifyData.phone">已绑定手机号：<em>{{phoneByStar}}</em>。用于安全通知，登录、安全设置时输入。</span>
    </section>

    <section class="input-box" v-if="!vertifyData.phone">
      <div class="item">
        <div class="name">
          绑定手机号码
        </div>
        <div class="val">
          <el-input v-model="post.phone" >
            <!-- <template> -->
              <el-select v-model="selects" slot="prepend"  class="regions">
                <el-option v-for="list in lists" :label="list.name" :value="list.value" :key="list.value"></el-option>
              </el-select>
            <!-- </template> -->
          </el-input>
          <div class="err-tip">{{errCode.phone}}</div>
        </div>
      </div>

      <div class="item">
        <div class="name">短信验证码</div>
        <div class="val">
          <!-- <el-input  class="valicode-input security">
            <template slot="append">
              <i class="line" :class="visible ? 'click-before' : 'click-after'"></i>
              <em v-if="visible">获取验证码</em>
              <span v-else>重发({{90}})s</span>
            </template>
          </el-input> -->
          <send-code @transCode="getCode" @sendCode="sendHandle" :sendFlag="sendFlag"></send-code>
          <div class="err-tip">{{errCode.phoneCode}}</div>
        </div>
      </div>

      <div class="item">
        <el-button type="primary" style="width: 100%;" @click="bindPhone">绑定</el-button>
      </div>
    </section>

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
import { mapActions, mapState } from "vuex";
import getUserInfo from "@/mixins/security/getUserInfo";
import vertify from "@/mixins/user/verify";
import {bindPhoneOrEmail} from "@/apis/user";
import {getVertifyCode} from "@/apis/default";

export default {
  mixins: [getUserInfo, vertify],
  components: {
    FinanceTitle,
    SendCode,
    AlertVertify
  },
  data() {
    return {
      selects: "+86",
      input: "",
      visible: false,
      lists: [
        { name: "+86", value: "86" }
        // { name: "+87", value: "87" },
        // { name: "+88", value: "88" }
      ],
      post: {
        phone: "",
        phoneCode: ""
      },
      errCode: {
        phone: '',
        phoneCode: ''
      },
      sendFlag: 0
    };
  },
  computed: {
    postPhone () {
      return this.selects + this.post.phone.trim()
    }
  },
  methods: {
    bindPhone() {
      let phoneFlag = this.phoneVerify(this.postPhone)
      if (!phoneFlag) {
        this.errCode.phone = '请填写正确的手机号'
        return
      } else {
        this.errCode.phone = ''
      }
      let phoneCodeFlag = this.codeVertify(this.post.phoneCode)
      if (!phoneCodeFlag) {
        this.errCode.phoneCode = '请输入正确的短信验证码'
        return
      } else {
        this.errCode.phoneCode = ''
      }
      let postData = {
        stepId: 0,
        emailOrPhone: this.postPhone,
        serviceName: this.serviceName,
        phoneVerifyCode: this.post.phoneCode,
        emailVerifyCode: '',
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
    getCode(val) {
      this.post.phoneCode = val
    },
    sendHandle() {
      let phoneFlag = this.phoneVerify(this.postPhone)
      if (!phoneFlag) {
        this.errCode.phone = '请填写正确的手机号'
        return
      } else {
        this.errCode.phone = ""
      }
      let postData = {
        serviceName: this.serviceName,
        phoneOrEmail: this.postPhone
      }
      // this.sendFlag = true
      getVertifyCode(postData).then((res) => {
        if (res.success) {
          this.sendFlag++
          this.$message.success('获取验证码成功')
        } else {
          this.$message.error(res.message)
        }
      })
    },
    alertSure(codeObj) {
      let postData = {
        stepId: 1,
        emailOrPhone: this.postPhone,
        serviceName: this.serviceName,
        phoneVerifyCode: this.post.phoneCode,
        emailVerifyCode: codeObj.email,
        googleCode: codeObj.google
      };
      bindPhoneOrEmail(postData).then(res => {
        if (res.success) {
          this.resultInfo = '绑定成功'
          location.reload()
        } else {
          this.resultInfo = res.message
        }
      });
    },
    alertClose() {
      this.resultInfo = ""
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
    .binded-tip {
      color: $font-color2;
      em{
        font-weight: 550;
      }
    }
    // border-bottom: 1px solid $line-color;
  }

  .input-box {
    padding-top: 40px;
    .item {
      // margin: 0 auto;
      max-width: 476px;
      .name {
        @include fontsize("content3");
        color: $font-color4;
        margin-bottom: 10px;
      }
      .val {
        // margin-bottom: 30px;
        .regions {
          width: 100px;
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


