import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      pairNameBefore: '',
      pairNameAfter: '',
      pairName: ''
    }
  },
  created() {
    this.pairName = this.$route.params.pairs
    this.pairNameBefore = this.$route.params.pairs.split("_")[0]
    this.pairNameAfter = this.$route.params.pairs.split("_")[1]
  },
  computed: {
    fiatCurrency() {
      return this.$store.state.lang.fiatCurrency
    },
    ...mapGetters(['bbPairs', 'quotes', 'exchangeRate']),
    ...mapGetters('coin_trade', ['curPairPrice', 'pairDepth', 'pairBills', 'localFiatFlag', 'pairConfig'])
  },
  methods: {
    priceFiat({currency, price}) { // 实际上是计算多少个数字币值多少个USD,名字取错了
      // 此处price相当于数量,表示多少个当前传入的币种
      // let currency = item.name
      // let price = item.price
      if (this.quotes.length) {
        // console.log(this.quotes)
        let usdValue = 0
        let fiatValue
        for (let i = 0; i < this.quotes.length; i++) {
          if (currency === this.quotes[i].currencyId) {
            usdValue = this.quotes[i].currentPrice
            break
          }
        }
        // if (this.exchangeRate && this.exchangeRate.usdValue) {
        //   fiatValue = Number(this.exchangeRate.usdValue)
          // console.log(usdValue, fiatValue)
          if (price) {
            // console.log(22222)
            return price * usdValue
          }
          return usdValue
        // }
      }
      return ""
    },
    fiatToCurrency({currency, price}) {
      if (this.quotes.length) {
        let usdValue = 0
        let fiatValue
        for (let i = 0; i < this.quotes.length; i++) {
          if (currency === this.quotes[i].currencyId) {
            usdValue = this.quotes[i].currentPrice
            break
          }
        }
        if (this.exchangeRate && this.exchangeRate.usdValue) {
          fiatValue = Number(this.exchangeRate.usdValue)
          // console.log(fiatValue, usdValue, price)
          if (price) {
            let result = price * fiatValue / usdValue
            return this.filterCurrency(result, currency)
          }
          return this.filterCurrency(fiatValue / usdValue, currency)
        }
      }
      return this.filterCurrency(0, currency)
    },
    filterCurrency(s, coin) {
      if (coin === undefined) {
        console.warn('数字币过滤器需要传入数字币ID')
        return Number(s).toFixed(4)
      }
      let config = this.$store.state.common.currencyConfig || []
      let len = config.length
      var i
      for (i = 0; i < len; i++) {
        if (coin === config[i].id) {
          s = Number(s).toFixed(config[i].displayFixed)
          return s
        }
      }
      console.warn('数字币过滤器传入的ID暂不支持')
      return Number(s).toFixed(4)
    },
    filterFiatCurrency(s, coin) {
      if (!s) {
        return Number(0).toFixed(2)
      }
      if (!this.$store.state.exchangeRate || this.$store.state.exchangeRate.usdValue === null) {
        return Number(s).toFixed(2) + ' USD'
      } else {
        let rate = this.$store.state.exchangeRate.usdValue
        return Number(Number(s) / rate).toFixed(2)
      }
    }
  }
}
