<template>
  <div class="wrapper">
    <section class="first">
      <FinanceTitle :title="$t('finance.security.pay.title')" icon="icon-shoukuanshezhi"></FinanceTitle>
      <span class="tip">
        {{$t('finance.security.pay.tip')}}
      </span>
    </section>

    <section class="binding alipay"  v-for="(item,index) in paywayList" :key="index"> 
      <h3 class="title border-bottom">绑定{{item.desc}}</h3>
      <!-- <MySwitch :index="index" :value="!!item.status" @changePayway="changePayway" /> -->
      <div class="switch">
        <el-switch
          active-color="#4A90E2"
          inactive-color="#ccc"
          v-model="item.enable"
          @change=changeEnable(index,item.enable)
        >
        </el-switch>
        <span class="switch-text">{{item.enable ? '关闭' : '开启'}}</span>
      </div>

      <div class="edit-box" v-show="item.enable && item.editFlag" >
        <div class="item" >
          <div class="name">{{item.pic.title}}</div>
          <div class="val">
            <!-- <el-upload
              :action="url + '/img/upload'"
              list-type="picture-card"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <img v-if="item.pic.val" :src="url + item.pic.val" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload> -->
            <MyUpload :index="index" :imgUrl="item.pic.val" @success="handleAvatarSuccess" />
          </div>
        </div>
        <div class="item">
            <div class="name">{{item.code.title}}</div>
            <div class="val">
              <el-input v-model="item.code.val" ></el-input>
              <!-- <div class="err-tip">请填写正确的资金密码</div> -->
            </div>
        </div>
        <div v-if=" true && item.addons.length">
          <div class="item"  v-for="(editlist,editIndex) in item.addons" :key="editIndex">
            <div class="name">{{editlist.title}}</div>
            <div class="val">
              <el-input v-model="editlist.val" ></el-input>
            </div>
          </div>
        </div>
        <div class="item">
          <div class="name"></div>
          <div class="val">
            <el-button type="primary" style="width: 100%;" @click="bind(item)">确认绑定</el-button>
          </div>
        </div>
      </div>

      <div class="saved-box" v-if="item.enable && !item.editFlag" >
          <div class="item">
            <div class="name">{{item.code.title}}</div>
            <div class="val">
              <span>{{item.code.val}}</span>
            </div>
          </div>
          <div class="item">
            <div class="name">{{item.pic.title}}</div>
            <div class="val">
              <span  @click="lookQrcode(item.pic.val)">点击查看二维码</span>
            </div>
          </div>
        <div v-if="item.addons.length" >
          <div class="item" v-for="(savedList,savedIndex) in item.addons" :key="savedIndex">
            <div class="name">{{savedList.title}}</div>
            <div class="val">
              <span>{{savedList.val}}</span>
            </div>
          </div>
          <!-- <div class="item" >
            <div class="name">{{savedList.name}}</div>
            <div class="val">
              <span @click="lookQrcode(savedList.val)">点击查看二维码</span>
            </div>
          </div> -->
        </div>
        <div class="modify-btn">
          <el-button type="primary" class="btn" @click="item.editFlag = true">修改</el-button>
        </div>
      </div>
    </section>

    <section class="warning-box">
      <p>{{$t('finance.security.pay.warning.name')}}</p>
      <p>1. {{$t('finance.security.pay.warning.cont1')}}</p>
      <p>2. {{$t('finance.security.pay.warning.cont2')}}</p>
    </section>

    <el-dialog
      center
      :visible="visible"
      :show-close="false"
      class="pay-dialog my-dialog"
      >
      <div class="content">
        <div class="close-tag" @click="visible=false">
          <i class="el-icon-close"></i>
        </div>

        <div class="picture">
          <img :src="imgHost + alertImg" alt="">
        </div>
      </div>
    </el-dialog>
    
  </div>
</template>
<script>
import FinanceTitle from "@/components/FinanceTitle";
import MyUpload from "@/components/security/Upload";
import MySwitch from "@/components/security/Switch";
import { legalUrl, imgHost } from "@/plugins/config";
import vertify from "@/mixins/user/verify";
import {getPayType, bindPayType, changePayType, getFiatCurrencyConfig} from "@/apis/security";
// import {map}

export default {
  mixins: [vertify],
  components: {
    FinanceTitle,
    MyUpload,
    MySwitch
  },
  data() {
    return {
      visible: false,
      url: legalUrl,
      imgHost: imgHost,
      paywayList: [],
      bindedpayList: [],
      alertImg: ''
    };
  },
  created() {
    let paywayList = this.$store.state.common.payWays || []
    this.paywayList = JSON.parse(JSON.stringify(paywayList))
  },
  mounted() {
    this._getPayType()
    // let paywayList = this.$store.state.common.siteInfo.legalCoinPayWays.slice()
    // this.paywayList = JSON.parse(JSON.stringify(paywayList))
  },
  computed: {
  },
  methods: {
    bind(item) {
      console.log(item)
      let addons = []
      // item.addons.forEach((list) => {
      //   list.val = list.val || ""
      //   addons.push(list.val)
      // })
      if (item.pic.needed === 2 && !item.pic.val) {
        this.$message.error(item.pic.title + '必填')
        return
      }
      if (item.code.needed === 2 && !item.code.val) {
        this.$message.error(item.code.title + '必填')
        return
      }
      for (let i = 0; i < item.addons.length; i++) {
        let list = item.addons[i]
        list.val = list.val || ""
        addons.push(list.val)
        if (list.needed === 2 && !list.val) {
          this.$message.error(list.title + '必填')
          return
        }
      }

      let postObj = {
        payWay: item.id,
        status: true,
        pic: item.pic.val,
        code: item.code.val,
        addon: addons
      }
      console.log(postObj)
      this._bindPayType(postObj)
    },
    lookQrcode(imgUrl) {
      this.visible = true
      this.alertImg = imgUrl
    },
    changeEnable(index, enable) {
      let postObj = {
        payWay: this.paywayList[index].id,
        status: enable
      }
      if (!this.paywayList[index].editFlag) {
        this._changePayType(postObj)
      }
      // console.log(enable, index)
    },
    handleAvatarSuccess(res, index) {
      console.log(res.data, index)
      this.$message.success('上传成功')
      let tmpObj = this.paywayList[index]
      tmpObj.pic.val = res.data
      this.paywayList.splice(index, 1, tmpObj)
      // this.paywayList[index].pic.val = res.data
    },
    _changePayType(obj) {
      changePayType(obj).then((res) => {
        if (res.success) {
          this._getPayType()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    _getFiatCurrencyConfig() {
      // getFiatCurrencyConfig().then((res) => {
      //   if (res.success) {
      //     let fiatCurrencyList = res.data || []
      //     let allPaywayList = this.$store.state.common.siteInfo.legalCoinPayWays
      //     let legalCoins = this.$store.state.common.siteInfo.legalCoins
      //     let paywayIdList = []
      //     let paywayList = []
      //     legalCoins.forEach((item) => {
      //       if (fiatCurrencyList.indexOf(item.symbol) > -1) {
      //         item.payWays.forEach((payWay) => {
      //           if (paywayIdList.indexOf(payWay) === -1) {
      //             paywayIdList.push(payWay)
      //           }
      //         })
      //       }
      //     })
      //     allPaywayList.forEach((item) => {
      //       if (paywayIdList.indexOf(item.id) > -1) {
      //         paywayList.push(item)
      //       }
      //     })
      //     this.paywayList = JSON.parse(JSON.stringify(paywayList))
      //     console.log(paywayList)
      //   }
      // })
    },
    _getPayType() {
      getPayType().then((res) => {
        if (res.success) {
          let data = res.data || []
          this.paywayList.forEach((unbindItem) => {
            unbindItem.enable = false
            unbindItem.editFlag = true
            data.forEach((bindItem) => {
              if (unbindItem.id === bindItem.payWay) {
                unbindItem.editFlag = false
                unbindItem.enable = bindItem.status
                unbindItem.pic.val = bindItem.pic || ""
                unbindItem.code.val = bindItem.code || ""
                unbindItem.addons.forEach((item, index) => {
                  item.val = bindItem.addon[index]
                })
              }
            })
          })
          this.paywayList = JSON.parse(JSON.stringify(this.paywayList))
          console.log(this.paywayList)
        }
      })
    },
    _bindPayType(obj) {
      bindPayType(obj).then((res) => {
        if (res.success) {
          this.$message.success("绑定成功")
          this._getPayType()
        } else {
          this.$message.error(res.message)
        }
      })
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
      height: 30px;
      line-height: 30px;
    }
    // border-bottom: 1px solid $line-color;
  }
  .binding {
    display: block;
    .title {
      @include fontsize("content2");
      height: 30px;
      line-height: 30px;
      color: $font-color2;
      margin-bottom: 15px;
    }
    .switch {
      margin-bottom: 15px;
      display: flex;
      align-items: center;
    }
    .switch-text {
      color: $font-color2;
      margin-left: 12px;
    }
    .item {
      // max-width: 650px;
      // width: 650px;
      width: 100%;
      display: flex;
      // align-items: center;
      line-height: 40px;
      margin-bottom: 15px;
      box-sizing: border-box;
      @include fontsize("content3");

      .name {
        width: 180px;
        text-align: right;
        color: $font-color4;
        margin-right: 30px;
      }
      .val {
        flex: 1;
        max-width: 470px;
        color: $font-color2;
        .tips {
          @include fontsize("small");
          color: $font-color4;
          padding-top: 5px;
          display: inline-block;
        }
        .checked {
          // width: 100%;
          display: inline-block;
          margin-right: 10px;
        }
      }
      .branch-bank {
        position: relative;
        margin-bottom: 0;
        .tips {
          // position: absolute;
          // left: 0;
          // top: 44px;
          @include fontsize("small");
          color: $font-color4;
          display: block;
        }
      }
    }

    .risk-tip {
      .val {
        color: $primary;
        @include fontsize("small");
      }
    }
    .readme {
      .val {
        span {
          color: $font-color6;
          @include fontsize("content3");
        }
      }
    }
    .saved-box {
      width: 100%;
      .item {
        background-color: $line-color;
        height: 44px;
        line-height: 44px;
        margin-bottom: 1px;
        width: 100%;
        .name {
          text-align: left;
          text-indent: 15px;
        }
      }
      .modify-btn {
        text-align: right;
        padding-top: 30px;
        .btn {
          width: 144px;
        }
      }
    }
    .edit-box {
      .item{
        @include phone {
          width: 100%;
          flex-direction: column;
          padding-left: 15px;
          align-items: flex-start;
          .name {
            text-align: left;
            width: 100%;
            margin-bottom: 5px;
          }
          .val {
            width: 100%;
            max-width: 476px;
            .el-input {
              max-width: 476px;
            }
          }
        }
      }
    }
  }

  .warning-box {
    padding-top: 30px;
    p {
      @include fontsize("content3");
      color: $font-color4;
      line-height: 10px;
    }
  }
}
</style>
<style lang="scss">
.pay-dialog{
  .el-dialog{
    width: 300px;
    padding: 0 27px;
  }
  .el-dialog__body{
    padding: 30px 0;
  }
  .content{
    padding-bottom: 0;
    .close-tag {
      position: absolute;
      font-size: 20px;
      right: -20px;
      top: -15px;
      cursor: pointer;
    }
    .picture{
      // width: 180px;
      width: 100%;
      height: 280px;
      background-color: $line-color;
      margin: 0 auto;
      img{
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>



