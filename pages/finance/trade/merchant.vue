<template>
  <div class="trade-merchant">
    <div class="title">
      <h3 class="h3-title">
        <i class="iconfont icons icon-shangjiarenzheng"></i>
        商家认证 
        <span v-if="stat === unverified" class="authentication font-color5">(未认证)</span>
      </h3>
      <p class="hint font-color4">
        *成为认证商家，即可成为委托交易商家，你可以在委托交易平台进行委托交易。
      </p>
    </div>

    <div class="setting">
      <h4>
        <span class="font-color6">*</span>1.储备金
        <!-- <i v-if="isLockUSDT" class="el-icon-success"></i>
        <i v-else class="el-icon-error"></i> -->
      </h4>
      <div class="item border-bottom">
        <span class="left">USDT</span>
        <span 
          v-if="!editUSDT" 
          class="center font-color5 font-color5"
          @click="editUSDT = true">
          最低限额{{ vipInfo.vipMinUSDTAmount }}USDT, 设置数量{{USDTValue}}USDT
        </span>
        <el-input 
          class="edit"
          v-else 
          v-model="USDTValue" 
          @keyup.native.enter="USDTValueChange"
          placeholder="输入限额"></el-input>
        <span class="right font-color8"
          @click="$i18n.push('/finance/property/recharge?type=USDT')">去充值</span>
      </div>
    </div>

    <div class="setting">
      <h4>
        <span class="font-color6">*</span>2.收款设置
        <i v-if="isPay" class="el-icon-success"></i>
        <i v-else class="el-icon-error"></i>
      </h4>
      <div v-if="paywayList.length">
        <div
          class="item border-bottom"
          v-for="item in paywayList"
          :key="item.payWay">
          <span class="left">
            绑定{{ item.payWay | payWay }}
          </span>
          <span class="center font-color5">
            {{ item.code || '***' }}
          </span>
          <span
            @click="$i18n.push('/security/pay/setting')"
            class="right font-color8">{{ item.status ? '去修改' : '去绑定'}}</span>
          </div>
      </div>
      <div v-else class="item border-bottom">
        <span class="left">
          绑定
        </span>
        <span class="center font-color6">
          {{ '没有绑定支付信息' }}
        </span>
        <span
          @click="$i18n.push('/security/pay/setting')"
          class="right font-color8">{{'去绑定'}}</span>
      </div>
    </div>

    <div class="setting">
      <h4>
        <span class="font-color6">*</span>3.联系手机号
        <!-- <i v-if="isPhone" class="el-icon-success"></i>
        <i v-else class="el-icon-error"></i> -->
      </h4>
      <div class="item border-bottom">
        <span class="left">预留手机号</span>
        <span 
          v-if="!editPhone"
          @click="editPhone = true"
          class="center font-color5">
          {{PhoneValue || '****'}}
        </span>
        <el-input 
          class="edit"
          v-else
          v-model="PhoneValue" 
          @keyup.native.enter="editPhone = false"
          placeholder="请输入手机号"></el-input>
        <span
          @click="editPhone = true"
          class="right font-color8">编辑手机号</span>
      </div>
    </div>

    <div class="setting">
      <h4>
        <span class="font-color6">*</span>4.绑定证件
        <span class="authentication font-color5">(上传身份证正反面或护照首页)</span>
        <i class="el-icon-error"></i>
      </h4>
      <div class="item"></div>
    </div>

    <div class="upload">
      <div class="id-card">
        <my-upload
          :_id="0"
          class="my-upload"
          title="身份证正面"
          :url="vipPhotos[0]"
          :useUrl="useUrl"
          @fileUpload="fileUpload"></my-upload>
        <my-upload
          :_id="1"
          class="my-upload2 my-upload"
          title="身份证反面"
          :url="vipPhotos[1]"
          :useUrl="useUrl"
          @fileUpload="fileUpload"></my-upload>
      </div>
      <div class="dotted-line"></div>
      <div class="passport">
        <my-upload
          :_id="2"
          class="my-upload"
          title="护照首页"
          :url="vipPhotos[2]"
          :useUrl="useUrl"
          @fileUpload="fileUpload"></my-upload>
      </div>
    </div>

    <my-button 
      @click="handleSubmit"
      class="my-button" 
      :text="buttonText"
      :disabled="disabled"></my-button>
  </div>
</template>

<script>
import MyUpload from "@/components/trade/MyUpload"
import MyButton from "@/components/Button"
import { mapGetters, mapActions } from "vuex"
import { imgHost } from "@/plugins/config"
import { merchantInfo, merchantApplay } from "@/apis/merchant"
import { unverified, verified, verifiding, SET_STAT } from "@/store/merchant"
import { paywayList } from "@/apis/payway"

export default {
  data() {
    return {
      images: new Array(3),
      disabled: false,
      buttonText: "提交认证申请",
      useUrl: false,
      vipInfo: {},
      unverified: unverified,
      vipPhotos: [],
      paywayList: [],

      editUSDT: false,
      editPhone: false,
      USDTValue: 0,
      PhoneValue: ""
    }
  },
  computed: {
    ...mapGetters("receipt", ["paySettings"]),
    ...mapGetters("user", ["phoneAndEmail"]),
    ...mapGetters("merchant", ["stat"]),
    isPay() {
      return this.paywayList.some(pay => pay.status)
    }
  },
  mounted() {
    this._merchantInfo()
    this._paywayList()
  },
  watch: {
    stat: {
      handler(val) {
        if (val) {
          this.skip()
        }
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions("merchant", [SET_STAT]),
    handlerClickPhone() {
      if (this.isPhone) return null
      this.$router.push(this.$i18n.push("/security/phone/validate"))
    },
    skip() {
      // init, processing, success, fail
      const status = this.stat.certifyStatus

      this.buttonText = "提交认证申请"
      this.disabled = false
      this.useUrl = false

      if (status === verifiding) {
        this.buttonText = "审核中"
        this.disabled = true
        this.useUrl = true
      } else if (status === "fail") {
      } else if (status === verified) {
        this.buttonText = "修改认证"
        this.useUrl = true
        // this.$router.push(this.$i18n.path("/finance/trade/merchant-success"));
      }
    },
    USDTValueChange() {
      const n = +this.USDTValue
      if (isNaN(n)) {
        return this.$message.error("锁定数量填写无效")
      }
      if (n < this.vipInfo.vipMinUSDTAmount) {
        return this.$message.error(
          `锁定数量不能小于${this.vipInfo.vipMinUSDTAmount}`
        )
      }
      this.editUSDT = false
    },
    async _merchantApplay() {
      this.images.forEach((img, i) => {
        if (img && img[0] !== "/") {
          this.images[i] = "/" + img
        }
      })

      const resData = await merchantApplay({
        lockUSDTAmount: String(this.USDTValue),
        contact: this.PhoneValue,
        picUrls: this.images
      })
      if (resData.success) {
        this[SET_STAT]()
        this._merchantInfo()
        this.$message.success("提交认证成功")
      } else {
        this.$message.error(resData.message)
      }
    },
    async _merchantInfo() {
      const resData = await merchantInfo()
      if (resData.success) {
        this.vipInfo = resData.data
        this.vipPhotos = this.vipInfo.picUrls
        this.PhoneValue = this.vipInfo.contact
        this.USDTValue = this.vipInfo.vipMinUSDTAmount
      }
    },
    async _paywayList() {
      const resData = await paywayList()
      if (resData.success) {
        this.paywayList = resData.data
      }
    },
    fileUpload(_id, imgUrl) {
      this.images[_id] = `${imgUrl}`
    },
    handleSubmit() {
      if (!this.isPay) {
        return this.$message.error("请先设置支付方式")
      }
      if (!this.PhoneValue) {
        return this.$message.error("请先绑定手机号")
      }
      if (this.images[2]) {
        return this._merchantApplay()
      }
      if (this.images.length === 0) {
        return this.$message.error("请提交身份证或护照")
      }
      if (!(this.images[0] && this.images[1])) {
        return this.$message.error("请提交身份证正反两面")
      }
      this._merchantApplay()
    }
  },
  components: {
    MyUpload,
    MyButton
  }
}
</script>

<style lang="scss" scoped>
.trade-merchant {
  max-width: 1000px;
  .edit {
    width: 160px;
  }
  .authentication {
    @include fontsize("small");
  }
  .error-hint {
    white-space: nowrap;
  }
  .hint {
    @include fontsize("content3");
  }
  .icons {
    font-size: 20px;
  }
  .setting {
    margin-top: 50px;
    & > h4 {
      @include fontsize("title3");
      font-weight: normal;
      margin-bottom: 12px;
      i {
        float: right;
      }
      .el-icon-error {
        color: $btn-red;
      }
      .el-icon-success {
        color: $btn-green;
      }
    }
    .item {
      display: flex;
      justify-content: space-between;
      padding: 24px 0;
      @include fontsize("content3");

      .left {
        width: 20%;
      }
      .center {
        width: 60%;
        text-align: center;
      }
      .right {
        width: 20%;
        cursor: pointer;
        text-align: right;
      }
    }
  }
  .upload {
    display: flex;
    .dotted-line {
      margin: 0 100px;
      border-left: 1px dashed #d9d9d9;
    }
    .id-card {
      display: flex;
      .my-upload2 {
        margin-left: 24px;
      }
    }
  }
  .my-button {
    margin: 24px auto;
    width: 50%;
  }

  @media screen and (max-width: 940px) {
    .upload {
      .dotted-line {
        margin: 0 20px;
      }
    }
  }

  @media screen and (max-width: 790px) {
    .upload {
      flex-direction: column;
      align-items: center;
      .my-upload {
        margin-bottom: 24px;
      }
      .dotted-line {
        display: none;
      }
      .id-card {
        flex-direction: column;
        .my-upload2 {
          margin-left: 0;
        }
      }
    }
  }
}
</style>
