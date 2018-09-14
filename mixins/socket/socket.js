import { getCookie } from "@/tools/cookie"
import { mapActions, mapState, mapMutations } from "vuex"
import socket from "@/plugins/socket"
export default {
  data() {},
  computed: {
    ...mapState({
      token: state => state.user.token
    })
  },
  created() {
    if (process.client) {
      let token = getCookie("token")
      window.$chat_baseUrl = this.$store.state.common.chat_url
      if (token) {
        this.USER_INFO()
      }
      window.$socket = this.$socket
      // token = 'CNT+zONiZQkplCjcuwJtNvm3TgBz6IjyNiU5kWJpyq/zyOivBWZOLteWA+WUUWc/XAxf910/W/iwk2f4bXb5Kw=='
      if (token) {
        this.$socket.emit("subcrible", {
          businessName: "SUBSCRIBLE_MY_LEGAL_ORDER",
          token: token
        })
        socket.subscribe({
          businessName: "USER_ON_OFF_LINE",
          token: token,
          online: true
        })
        this.INIT_CHAT()
      }
      this.$socket.on("error", err => {
        console.log(`error:>>>>>> ${err}`)
      })
      this.$socket.on("msg", msg => {
        console.log(`msg:>>>>>> ${JSON.stringify(msg)}`)
      })
      this.$socket.on("data", data => {
        let _data = JSON.parse(data)
        let type = _data.type
        let body = _data.body
        if (type === "SUBSCRIBLE_LEGAL_CURRENCY_QUOTATION") {
          // 法币行情 done -
          this.UPDATE_EXCHANGERATE(body)
        } else if (type === "SUBSCRIBLE_CURRENCY_QUOTATION") {
          // 数字币行情订阅 done -
          this.UPDATE_QUOTES(body)
        } else if (type === "SUBSCRIBLE_MY_LEGAL_ORDER") {
          // 订阅法币自己的订单变化 done -
          this.ADD_ORDER_NOTICE(_data)
          this.UPDATE_ORDERS(body)
        } else if (type === "SUBSCRIBLE_LEGAL_SUCCESS_ORDER") {
          // 订阅法币订单成交推送 done -
          this.UPDATE_HOTORDERS(body)
        } else if (type === "SUBSCRIBLE_LEGAL_AD_CHANGE") {
          // 法币广告更新 -
          this.UPDATE_OTC_ADS(body)
        } else if (type === "SUBSCRIBLE_PAIR_BILL") {
          // 币币成交更新（订阅，基于交易对)
          this.ADD_PAIRBILLS(body)
        } else if (type === "SUBSCRIBLE_PAIR_DEEP") {
          // 币币深度刷新 done
          this.UPDATE_PAIRDEPTH(body)
        } else if (type === "SUBSCRIBLE_PAIR_PRICE") {
          // 交易对最新价格 done
          this.UPDATE_PAIRPRICE(body)
        } else if (type === "SUBSCRIBLE_MY_BB_BILL") {
          // BB自己的成交单,历史委托单 done
          // this.ADD_ORDER_NOTICE(_data)
          this.ADD_HISTORYBILLS(body)
        } else if (type === "SUBSCRIBLE_USER_CURRRENCY_CHANGE") {
          this.UPDATE_ACCOUNT_ASSET(body)
        } else if (type === "SUBSCRIBLE_MY_BB_DELEGATION_CHANGE") {
          // 当前委托单成交变化 done
          // this.ADD_ORDER_NOTICE(_data)
          this.UPDATE_CUR_ENTRUSORDERS(body)
        }
      })
    }
  },
  methods: {
    ...mapMutations("trade_order", ["UPDATE_HOTORDERS"]),
    ...mapMutations("trade_order", ["UPDATE_ORDERS"]),
    ...mapActions("adver", ["UPDATE_OTC_ADS"]),
    ...mapMutations(["UPDATE_EXCHANGERATE", "UPDATE_QUOTES"]),
    ...mapActions("notice", ["TOGGLE_NOTICE", "ADD_ORDER_NOTICE"]),
    ...mapMutations("coin_trade", [
      "UPDATE_PAIRDEPTH",
      "UPDATE_PAIRPRICE",
      "ADD_PAIRBILLS",
      "UPDATE_CUR_ENTRUSORDERS",
      "ADD_HISTORYBILLS"
    ]),
    ...mapMutations("account", ["UPDATE_ACCOUNT_ASSET"]),
    ...mapActions("user", ["USER_INFO"]),
    ...mapActions("c2c_chat", ["INIT_CHAT"])
  },
  mounted() {
    let activeLink = this.$el.querySelector(".nuxt-link-active")
    if (activeLink) {
      this.title = activeLink.innerText
    }
    this.$socket.on("error", err => {
      console.log(`error:>>>>>> ${err}`)
    })
    this.$socket.on("msg", msg => {
      console.log(`msg:>>>>>> ${JSON.stringify(msg)}`)
    })
    this.$socket.on("data", data => {
      console.log("/*********Socket Start***********/")
      console.log(JSON.parse(data))
      console.log("/*********Socket End***********/")
    })
  }
}
