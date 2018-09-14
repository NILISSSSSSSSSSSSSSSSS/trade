import {mapState} from 'vuex'
export default {
  data () {
    return {
    }
  },
  computed: {
    ...mapState({
      legalCoins: state => state.common.allLegalCurrency.legalCurrencyList
    }),
    payWays () {
      // debugger
      let len = this.legalCoins.length;
      let i;
      for (i = 0; i < len; i++) {
        if (this.legalCoins[i].symbol === this.fiatCurrency) {
          return this.legalCoins[i].payWays
        }
      }
    }
  }
}
