<template>
  <div class="buy">
    <div class="dash-box">
      <header class="header border-bottom">买入{{pairNameBefore}}</header>
      <div class="content">
        <div class="item balance-box" v-if="token">
          <span class="my-balance">我的余额</span>
          <span class="price balance">{{balance | currency(pairNameAfter)}} {{pairNameAfter}}</span>
          <nuxt-link :to="$i18n.path(`/finance/property/recharge?type=${pairNameAfter}`)" tag="span" class="route pointer">充值</nuxt-link>
          <nuxt-link :to="$i18n.path(`/finance/property/withdraw?type=${pairNameAfter}`)" tag="span" class="pointer" >提现</nuxt-link>
        </div>
        <div class="item" v-if="token">
          <span>可买入量</span>
          <span class="canBuy">{{canbuyAmount | currency(pairNameBefore)}} {{pairNameBefore}}</span>
        </div>
        <div class="item " v-if="!token">
          <nuxt-link tag="span" class="login" :to="$i18n.path('/user/login')">登录</nuxt-link><em>或</em><nuxt-link tag="span" :to="$i18n.path('/user/register')" class="register">注册</nuxt-link>
        </div>
        <div class="item">
          <div class="input-box">
            <span class="name">买入价{{!localFiatFlag ? pairNameAfter : fiatCurrency}}</span>
            <!-- <span class="val price">{{curPairPrice.price || 0 | currency(pairNameBefore)}}</span> -->
            <input type="text" v-model="buyPrice"
              maxlength="14"
              @input="validatePrice" 
              @blur="validatePriceBlur"
              class="val price">
          </div>
        </div>
        <div class="item">
          <div class="input-box">
            <span class="name">买入量{{pairNameBefore}}</span>
            <input type="text" v-model="buyAmount"
              maxlength="14"
              @input="validateAmount" 
              @blur="validateAmountBlur" class="val input">
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
          <!-- <span>交易额</span>&nbsp;&nbsp;<em class="price">{{dealAsset | currency(pairNameAfter)}}</em>&nbsp;<em>{{pairNameAfter}}</em> -->
        </div>
        <div class="item">
          <button class="btn" @click="buy" >立即买入</button>
        </div>
        <div class="item fee">
          <span>手续费</span>&nbsp;&nbsp;&nbsp;&nbsp;<em class="price small">{{buyFee | currency(pairNameAfter)}} {{pairNameAfter}}</em><em>(</em><em class="price small">{{feeRule}}</em><em>成交才收，撤单退回)</em>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {mapActions, mapGetters} from 'vuex';
import { tradePairs } from '@/apis/bbtrade';
import { setCookie, getCookie } from '@/tools/cookie'
import computeFiatPrice from '@/mixins/coin_trade/computeFiatPrice.js'

export default {
  mixins: [computeFiatPrice],
  data() {
    return {
      buyAmount: 0,
      token: '',
      buyPrice: 0
      // pairNameBefore: '',
      // pairNameAfter: '',
      // pairName: ''
      // dealAsset: '' // 交易额 === 数量×单价
      // balance: 0
    }
  },
  beforeMount() {
    // this.pairName = this.$route.params.pairs
    // this.pairNameBefore = this.$route.params.pairs.split("_")[0]
    // this.pairNameAfter = this.$route.params.pairs.split("_")[1]
    // this.token = this.$store.state.user.token
    this.token = getCookie('token')
    console.log('token', this.token)
    if (this.token) {
      this.SET_ACCOUNT_ASSET()
    }
  },
  computed: {
    dealAsset() {
      let buyPrice = this.buyPrice
      // 计算数字币交易额
      let result = this.buyAmount * buyPrice
      return result || 0
    },
    balance() {
      if (this.account_asset.length) {
        let index = this.account_asset.findIndex((item) => {
          return item.currency === this.pairNameAfter
        })
        if (index > -1) {
          return this.account_asset[index].balance
        }
      }
      return 0
    },
    canbuyAmount() {
      let buyPrice = this.buyPrice
      if (this.localFiatFlag) {
        // 将法币转为相应的数字币
        buyPrice = this.fiatToCurrency({currency: this.pairNameAfter, price: buyPrice})
      }
      if (this.balance && Number(buyPrice) !== 0) {
        return this.balance / buyPrice
      }
      return 0
    },
    buyFee() {
      let buyPrice = this.buyPrice
      if (this.localFiatFlag) {
        // 将法币转为相应的数字币
        buyPrice = this.fiatToCurrency({currency: this.pairNameAfter, price: buyPrice})
      }
      // 计算数字币交易额
      let result = this.buyAmount * buyPrice
      // console.log(buyPrice, result)
      if (this.pairConfig && this.pairConfig._id) {
        let fixed = this.pairConfig.buyFee.tradeFee.fixed
        let percent = Number(this.pairConfig.buyFee.tradeFee.percent)
        if (fixed > 0) {
          return result * percent + fixed
        }
        return result * percent
      }
      return 0
    },
    feeRule() {
      if (this.pairConfig && this.pairConfig._id) {
        let fixed = this.pairConfig.buyFee.tradeFee.fixed
        let percent = this.pairConfig.buyFee.tradeFee.percent * 100 + '%'
        if (fixed > 0) {
          return `${fixed}{this.pairNameAfter} + ${percent}`
        }
        return `${percent}`
      }
    },
    ...mapGetters('account', ['account_asset']),
    ...mapGetters('coin_trade', ['curPairPrice'])
  },
  watch: {
    curPairPrice: {
      handler: function(newVal, old) {
        let buyPrice = newVal.price || 0
        if (!this.localFiatFlag) {
          this.buyPrice = this.filterCurrency(buyPrice, this.pairNameAfter)
        } else {
          this.buyPrice = this.filterFiatCurrency(this.priceFiat({currency: this.fiatCurrency}))
        }
      },
      deep: true
    },
    localFiatFlag(newVal, old) {
      let buyPrice = this.buyPrice
      let exchangeRate = this.$store.state.exchangeRate
      if (exchangeRate && exchangeRate.usdValue) {
        let rate = exchangeRate.usdValue
        // console.log(rate)
        if (newVal) {
          this.buyPrice = this.filterFiatCurrency(this.priceFiat({currency: this.pairNameAfter, price: buyPrice}))
        } else {
          this.buyPrice = this.fiatToCurrency({price: buyPrice, currency: this.pairNameAfter})
        }
        // console.log(this.buyPrice)
      } else {
        this.buyPrice = buyPrice
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
      this.buyAmount = value
    },
    validateAmountBlur(e) {
      let value = e.target.value
      if (!value) {
        value = 0
      }
      this.buyAmount = value
    },
    validatePriceBlur(e) {
      let value = e.target.value
      if (!value) {
        value = 0
      }
      this.buyPrice = value
    },
    validatePrice(e) {
      let value = this.onlyNumber(e.target.value)
      this.buyPrice = value
    },
    buy() {
      if (!this.token) {
        this.$router.push(this.$i18n.path('/user/login'))
        return
      }
      let price = Number(this.buyPrice)
      let amount = Number(this.buyAmount)
      if (!price) {
        this.$message.error('价格必须大于0')
        return
      } else if (!amount) {
        this.$message.error('买入量必须大于0')
        return
      } else if (this.canbuyAmount < amount) {
        this.$message.error('超出可买入量')
        return
      }
      let postObj = {
        pairName: this.pairName,
        isBuy: true,
        price: price.toString(),
        amount: this.buyAmount.toString()
      }
      // console.log(postObj)
      if (!this.once) {
        this.once = true
        tradePairs(postObj).then((res) => {
          this.once = false
          if (res.success) {
            this.$message.success(res.message || '交易成功')
            this.buyAmount = 0
          } else {
            this.$message.error(res.message)
          }
        }).catch(() => {
          this.once = false
        })
      }
    },
    clear() {

    },
    ...mapActions('account', ['SET_ACCOUNT_ASSET'])
  }
}
</script>
<style lang="scss" scoped>
@import "./buyOrSell.scss"
</style>


