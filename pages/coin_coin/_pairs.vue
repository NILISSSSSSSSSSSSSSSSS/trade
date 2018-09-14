<template>
  <div class="coin-coin container" ref="coinCoin">
    <div class="test">
      <grid-layout
        :layout="layout"
        :col-num="12"
        :row-height="24"
        :is-draggable="false"
        :is-resizable="false"
        :is-mirrored="false"
        :vertical-compact="true"
        :margin="margin"
        :use-css-transforms="true"
        >
          <grid-item v-for="(item,index) in layout"
            class="drag-item"
            :key="index"
            :x="item.x"
            :y="item.y"
            :w="item.w"
            :h="item.h"
            :i="item.i">
              <!-- {{item.i}} -->
              <!-- <div> -->
                <div class="tv-container" v-if="item.i === 'MyTradingView'">
                  <filter-head
                    :tradePair="pairs"
                    @visible="handleVisible"></filter-head>
                  <div class="trading-wraper">
                    <my-trading-view
                      :tradePair="pairs" />
                    <Filters
                      class="filter"
                      v-show="showFilter"
                      />
                  </div>
                </div>
                <div v-if="item.i === 'BuyAndSell'" class="buy-and-sell">
                  <Buy class="sale-item"  />
                  <Sell class="sale-item" />
                </div>
                <Entrust v-if="item.i === 'Entrust'" />
                <NewPrice v-if="item.i === 'NewPrice'" />
                <NewDeal v-if="item.i === 'NewDeal'"  />
                <MyCharts v-if="item.i === 'MyCharts'" />
              <!-- </div> -->
          </grid-item>
        </grid-layout>
      </div>
      <group-chat-tip></group-chat-tip>
      <group-chat></group-chat>
  </div>
</template>

<script>
import MyTradingView from "@/components/coin/trading"
import FilterHead from "@/components/coin/FilterHead"
import Buy from "@/components/coin/buy"
import Sell from "@/components/coin/sell"
import Entrust from "@/components/coin/entrust"
import NewPrice from "@/components/coin/newPrice"
import NewDeal from "@/components/coin/newDeal"
import Filters from "@/components/coin/filter"
import MyCharts from "@/components/coin/charts"
import groupChatTip from "@/components/chat/groupTip"
import groupChat from "@/components/chat/group"
import {
  getOnePairConfig,
  getPairPrice,
  getPairDeepth,
  getPairDeal,
  querybbEntrust
} from "@/apis/bbtrade"
import { mapActions, mapGetters, mapMutations } from "vuex"
import { getCookie } from "@/tools/cookie"

let testLayout = [
  { x: 0, y: 0, w: 12, h: 16, i: "MyTradingView" },
  { x: 0, y: 10, w: 5, h: 11, i: "NewPrice" },
  { x: 5, y: 10, w: 7, h: 11, i: "BuyAndSell" },
  { x: 0, y: 21, w: 12, h: 8, i: "Entrust" },
  { x: 0, y: 29, w: 8, h: 14, i: "MyCharts" },
  { x: 8, y: 29, w: 4, h: 14, i: "NewDeal" }
]

export default {
  head: {
    script: []
  },
  data() {
    return {
      layout: testLayout,
      pairs: "",
      bbPairs: [],
      showFilter: false,
      token: "",
      margin: [10, 10]
    }
  },
  created() {
    this.bbPairs = this.$store.state.bbPairs
    // console.log("this.bbpairs", this.bbPairs)
    if (process.client) {
      if (this.os) {
        if (this.os.phone) {
          // this.osType = "phone";
          this.margin = [0, 10]
          this.layout.forEach((item, index) => {
            item.x = 0;
            item.w = 12;
            if (item.i === 'BuyAndSell') {
              item.h = 2 * item.h
            }
            this.computedY()
          })
        }
      }
    }
  },
  async beforeMount() {
    // let pairName = this.$route.params.pairs
    this.pairs = this.$route.params.pairs
    if (!this.pairs || this.pairs.indexOf("_") === -1) {
      this.$router.push("/coin_coin")
    }
    this.bbPairs.forEach(item => {
      if (item.zone === this.pairs.split("_")[1]) {
        // console.log(item.pairs.indexOf(this.pairs))
        if (item.pairs.indexOf(this.pairs) === -1) {
          this.$router.push("/coin_coin")
        }
      }
    });
    this.SET_CUR_PAIRNAME(this.pairs);
    await this.GET_CUR_PAIRPRICE(this.pairs);
    let fiatCurrency = this.$store.state.lang.fiatCurrency;
    await this.GET_EXCHANGERATE(fiatCurrency);
    await this.GET_Config(this.pairs)
    // this._getOnePairConfig();
    // axios.all([this._getPairPrice(),this._getPairDeal()])
  },
  mounted() {
    this.token = getCookie("token")
    if (this.token) {
      this.GET_CUR_ENTRUSORDERS(this.pairs)
    }
    this.GET_PAIRDEPTH(this.pairs)
    this.GET_PAIRBILLS(this.pairs)
    window.onresize = () => {
      const width = this.utils.getWindowW()
      this.SET_WINDOWWIDTH(width)
    }
  },
  computed: {
    // ...mapGetters("coin_trade", ["pairDepth"])
  },
  methods: {
    computedY(index) {
      let y = 0
      for (let i = 0; i < this.layout.length; i++) {
        if (index > i) {
          y += this.layout[i].h
        } else {
          break
        }
      }
      return y
    },
    handleVisible(bool) {
      this.showFilter = bool
    },
    ...mapActions(["GET_EXCHANGERATE"]),
    ...mapActions("coin_trade", [
      "GET_Config",
      "GET_PAIRPRICE",
      "GET_PAIRDEPTH",
      "GET_CUR_PAIRPRICE",
      "GET_PAIRBILLS",
      "GET_CUR_ENTRUSORDERS"
    ]),
    ...mapMutations("coin_trade", ["SET_CUR_PAIRNAME", "SET_WINDOWWIDTH"])
  },
  components: {
    MyTradingView,
    FilterHead,
    Buy,
    Sell,
    Entrust,
    NewPrice,
    NewDeal,
    Filters,
    MyCharts,
    groupChatTip,
    groupChat
  }
}
</script>

<style lang="scss" scoped>
.coin-coin {
  padding: 10px 0px;
  background-color: $line-color;
  box-sizing: border-box;
  // overflow-x: hidden;
  @include phone{
    padding: 16px 0 ;
  }
  .tv-container {
    width: 100%;
    height: 100%;
    .trading-wraper {
      width: 100%;
      height: 100%;
      position: relative;
      .filter {
        position: absolute;
        top: 0px;
        right: 0px;
        width: 35%;
        max-width: 600px;
        min-width: 460px;
        height: 90%;
        z-index: 20;
        @include phone{
          width: 100%;
          max-width: 100%;
          min-width: 100%;
        }
      }
    }
  }
  .drag-item {
    // background-color: #ccc;
    overflow: hidden;
    // padding: 10px;
    box-sizing: border-box;
    .buy-and-sell{
      // display:flex;
      height: 100%;
      background-color: $bg-content;
      overflow: auto;
      .sale-item{
        width: 50%;
        float: left;
        // height: 100%
      }
      @include phone{
        .sale-item{
          width: 100%;
          height: 50%;
        }
      }
    }
  }
}
</style>
<style lang="scss">
</style>

