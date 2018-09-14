<template> 
  <div class="buy sell">
    <div class="dash-box">
      <div class="header border-bottom">
        <header>卖出{{pairNameBefore}}</header>
        <div class="local">
          <el-switch
            :width="30"
            v-model="localCompute"
            active-color="#27AE60"
            inactive-color="#999999"
            @change="changeLocalFiat"
            >
          </el-switch>
          &nbsp;&nbsp;&nbsp;
          <span>本地货币计价</span>
        </div>
      </div>
      <div class="content">
        <div class="item balance-box" v-if="token">
          <span class="my-balance">我的余额</span>
          <span class="price balance">{{balance | currency(pairNameBefore)}} {{pairNameBefore}}</span>
          <nuxt-link :to="$i18n.path(`/finance/property/recharge?type=${pairNameBefore}`)" tag="span" class="route pointer">充值</nuxt-link>
          <nuxt-link :to="$i18n.path(`/finance/property/withdraw?type=${pairNameBefore}`)" tag="span" class="pointer">提现</nuxt-link>
        </div>
        <div class="item" v-if="token">
          <span>可兑换额</span>
          <span class="canBuy">{{canSellAsset | currency(pairNameAfter)}} {{pairNameAfter}}</span>
        </div>
        <div class="item " v-if="!token">
          <nuxt-link tag="span" class="login" :to="$i18n.path('/user/login')">登录</nuxt-link><em>或</em><nuxt-link tag="span" :to="$i18n.path('/user/register')" class="register">注册</nuxt-link>
        </div>
        <div class="item">
          <div class="input-box">
            <span class="name">卖出价{{!localFiatFlag ? pairNameAfter : fiatCurrency}}</span>
            <!-- <span class="val price" v-if="!localFiatFlag">{{curPairPrice.price || 0 | currency(pairNameBefore)}}</span>
            <span class="val price" v-if="localFiatFlag" >{{priceFiat({currency: pairNameBefore}) | fiatCurrency(fiatCurrency)}}</span> -->
            <input type="text"
              v-model="sellPrice" 
              maxlength="14"
              @input="validatePrice" 
              @blur="validatePriceBlur"
              class="val price">
          </div>
        </div>
        <div class="item">
          <div class="input-box">
            <span class="name">卖出量{{pairNameBefore}}</span>
            <input type="text" 
              v-model="sellAmount"
              maxlength="14"
              @input="validateAmount" 
              @blur="validateAmountBlur"
              class="val input">
          </div>
          <!-- <div class="err-tip">
          </div> -->
        </div>
        <div class="item limit">
          <span v-if="!localFiatFlag">
            <span>交易额</span>&nbsp;&nbsp;<em class="price">{{dealAsset | currency(pairNameAfter)}}</em>&nbsp;<em>{{pairNameAfter}}</em>
          </span>
          <span v-if="localFiatFlag">
            <span>交易额</span>&nbsp;&nbsp;<em class="price">{{dealAsset | bbfiatCurrency(fiatCurrency)}}</em>&nbsp;<em>{{fiatCurrency}}</em>
          </span>
        </div>
        <div class="item">
          <button class="btn" @click="sell">立即卖出</button>
        </div>
        <div class="item fee">
          <span>手续费</span>&nbsp;&nbsp;&nbsp;&nbsp;<em class="price small">{{sellFee | currency(pairNameBefore)}} {{pairNameBefore}}</em><em>(</em><em class="price small">{{feeRule}}</em><em>成交才收，撤单退回)</em>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters, mapMutations } from 'vuex';
import { tradePairs } from '@/apis/bbtrade';
import { setCookie, getCookie } from '@/tools/cookie';
import computeFiatPrice from '@/mixins/coin_trade/computeFiatPrice.js'

export default {
  mixins: [computeFiatPrice],
  data() {
    return {
      sellAmount: 0,
      localCompute: false,
      token: '',
      sellPrice: ''
    }
  },

  mounted() {
    this.sellPrice = this.curPairPrice.price
    this.token = getCookie('token')
    if (this.token) {
      this.SET_ACCOUNT_ASSET()
    }
  },
  computed: {
    dealAsset() {
      // if (this.localFiatFlag) { // 计算本地法币交易额
      //   return this.priceFiat({currency: this.fiatCurrency}) * this.sellAmount * this.sellPrice
      // }
      if (this.sellPrice) { // 计算数字币交易额
        let result = this.sellAmount * this.sellPrice
        return result
      }
      return 0
    },
    balance() {
      if (this.account_asset.length) {
        let index = this.account_asset.findIndex((item) => {
          return item.currency === this.pairNameBefore
        })
        if (index > -1) {
          return this.account_asset[index].balance
        }
      }
      return 0
    },
    canSellAsset() {
      let sellPrice = this.sellPrice
      if (this.localFiatFlag) {
        // 将法币转为相应的数字币
        sellPrice = this.fiatToCurrency({currency: this.pairNameAfter, price: sellPrice})
      }
      if (this.balance && Number(sellPrice) !== 0) {
        return this.balance * sellPrice
      }
      return 0
    },
    sellFee() {
      // let sellPrice = this.sellPrice
      // if (this.localFiatFlag) {
      //   // 将法币转为相应的数字币
      //   sellPrice = this.fiatToCurrency({currency: this.pairNameAfter, price: sellPrice})
      // }
      // 计算数字币交易额
      let result = this.sellAmount
      console.log(result)
      if (this.pairConfig && this.pairConfig._id) {
        let fixed = this.pairConfig.sellFee.tradeFee.fixed
        let percent = Number(this.pairConfig.sellFee.tradeFee.percent)
        if (fixed > 0) {
          return result * percent + fixed
        }
        return result * percent
      }
      return 0
    },
    feeRule() {
      if (this.pairConfig && this.pairConfig._id) {
        let fixed = this.pairConfig.sellFee.tradeFee.fixed
        let percent = this.pairConfig.sellFee.tradeFee.percent * 100 + '%'
        if (fixed > 0) {
          return `${fixed}{this.pairNameBefore} + ${percent}`
        }
        return `${percent}`
      }
    },
    ...mapGetters('account', ['account_asset']),
    ...mapGetters('coin_trade', ['curPairPrice', 'localFiatFlag'])
  },
  watch: {
    curPairPrice: {
      handler: function(newVal, old) {
        let sellPrice = newVal.price || 0
        if (!this.localFiatFlag) {
          this.sellPrice = this.filterCurrency(sellPrice, this.pairNameAfter) || 0
        } else {
          this.sellPrice = this.filterFiatCurrency(this.priceFiat({currency: this.fiatCurrency})) || 0
        }
      },
      deep: true
    },
    localFiatFlag(newVal, old) {
      let sellPrice = this.sellPrice
      let exchangeRate = this.$store.state.exchangeRate
      if (exchangeRate && exchangeRate.usdValue) {
        let rate = exchangeRate.usdValue
        if (newVal) {
          this.sellPrice = this.filterFiatCurrency(this.priceFiat({currency: this.pairNameAfter, price: sellPrice}))
        } else {
          this.sellPrice = this.fiatToCurrency({price: sellPrice, currency: this.pairNameAfter})
        }
      } else {
        this.sellPrice = sellPrice
      }
    }
  },
  methods: {
    onlyNumber(value) {
      // let value = e.target.value + ""
      value = value + ""
      // 得到第一个字符是否为负号
      // var t = value.charAt(0);
      // 先把非数字的都替换掉，除了数字和.
      value = value.replace(/[^\d/.]/g, "");
      // 必须保证第一个为数字而不是.
      value = value.replace(/^\./g, "");
      // 保证只有出现一个.而没有多个.
      value = value.replace(/\.{2,}/g, ".");
      // 保证.只出现一次，而不能出现两次以上
      value = value
        .replace(".", "$#$")
        .replace(/\./g, "")
        .replace("$#$", ".");
      // if (!value) {
      //   value = "0"
      // }
      return value
      // 如果第一位是负号，则允许添加
      // if (t == "-") {
      //   obj.value = "-" + obj.value;
      // }
    },
    validateAmount(e) {
      let value = this.onlyNumber(e.target.value)
      let dotIndex = value.indexOf('.')
      let floatFixed
      if (dotIndex > -1) {
        floatFixed = value.length - dotIndex - 1
        if (floatFixed > 4) {
          value = Number(value).toFixed(4)
        }
      }
      this.sellAmount = value
    },
    validateAmountBlur(e) {
      let value = e.target.value
      if (!value) {
        value = 0
      }
      this.sellAmount = value
    },
    validatePriceBlur(e) {
      let value = e.target.value
      if (!value) {
        value = 0
      }
      this.sellPrice = value
    },
    validatePrice(e) {
      let value = this.onlyNumber(e.target.value)
      this.sellPrice = value
    },
    sell() {
      if (!this.token) {
        this.$router.push(this.$i18n.path('/user/login'))
        return
      }
      let price = Number(this.sellPrice)
      let amount = Number(this.sellAmount)
      if (!price) {
        this.$message.error('价格必须大于0')
        return
      } else if (!amount) {
        this.$message.error('卖出量必须大于0')
        return
      } else if (this.balance < amount) {
        this.$message.error('超出可卖出量')
        return
      }
      let postObj = {
        pairName: this.pairName,
        isBuy: false,
        price: price.toString(),
        amount: this.sellAmount.toString()
      }
      console.log(postObj)
      if (!this.once) {
        this.once = true
        tradePairs(postObj).then((res) => {
          this.once = false
          if (res.success) {
            this.$message.success(res.message || '交易成功')
            this.sellAmount = 0
          } else {
            this.$message.error(res.message)
          }
        }).catch(() => {
          this.once = false
        })
      }
    },
    changeLocalFiat(bool) {
      this.SET_LOCALFIAT(bool)
    },
    ...mapMutations('coin_trade', ['SET_LOCALFIAT']),
    ...mapActions('account', ['SET_ACCOUNT_ASSET'])
  }
}
</script>
<style lang="scss" scoped>
  @import "./buyOrSell.scss";
</style>
<style lang="scss">
.sell{
  .el-switch{
    height: 13px;
    .el-switch__core{
      width: 100%;
      height: 14px;
      &::after{
        width: 10px;
        height: 10px;
      }
    }
  }
  .el-switch.is-checked .el-switch__core::after{
    margin-left: -12px;
  }
}
</style>


