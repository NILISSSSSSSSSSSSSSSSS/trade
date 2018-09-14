export default {
  data () {
    return {
      currency: '',
      currencyCombine: {},
      fiatCurrency: ''
    }
  },
  methods: {
    showPageHandle(page) {
      if (page.includes('_') && this.common.legalCoins.includes(page.split('_')[1]) && this.common.currencies.includes(page.split('_')[0])) {
        this.fiatCurrency = page.split('_')[1]
        this.currency = page.split('_')[0]
      } else {
        this.fiatCurrency = this.common.legalCoins[0];
        this.currency = this.common.currencies[0];
      }
      this.currencyCombine = {currency: this.currency, fiatCurrency: this.fiatCurrency}
    }
  },
  created() {
    process.client && this.showPageHandle(this.$route.params.currency)
  }
}
