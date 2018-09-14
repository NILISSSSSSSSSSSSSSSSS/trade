<template>
<div class="c2c-page container">
  <el-row>
    <el-col :lg="5" :md="5" :sm="5" :xs="24" class="leftSide">
      <otc-sidebar :currencyCombine="currencyCombine" routeName="c2c-trade"></otc-sidebar>
    </el-col>
    <el-col :lg="19" :md="19" :sm="19" :xs="24" class="rightSide">
      <div class="title">
        <div class="left">{{currency}} {{$t('c2c.to')}} {{fiatCurrency}}</div>
        <el-button type="primary" v-if="!vip_status" @click="$i18n.push('/finance/trade/merchant-pre')">{{$t('c2c.becomeMerchant')}}</el-button>
        <el-button type="primary" v-else @click="$i18n.push(`/publish/${currency}_${fiatCurrency}`)">{{$t('common.adver.publish')}}</el-button>
      </div>
      <!-- <div class="market-price" v-if="curQuotes">
        <div><span class="price-title">{{$t('c2c.priceMap.cur')}}</span><span class="price-count">{{curQuotes.currentPrice}}</span></div>
        <div><span class="price-title">{{$t('c2c.priceMap.day')}}</span><span class="price-count percent">{{((curQuotes.currentPrice - curQuotes.prePrice) * 100) | fiatCurrency}}%</span></div>
        <div><span class="price-title">{{$t('c2c.priceMap.high')}}</span><span class="price-count">￥{{curQuotes.maxPrice}}</span></div>
        <div><span class="price-title">{{$t('c2c.priceMap.low')}}</span><span class="price-count">￥{{curQuotes.minPrice}}</span></div>
      </div> -->
      <div class="trade-form font-color3">
        <el-row>
          <el-col :lg="12" :md="12" :sm="12" :xs="24" class="buy">
            <div class="form-title font16">{{$t('common.buy')}}{{currency}}</div>
            <el-input placeholder="0" v-model="buy.count" @blur="getAds('buy')" v-posNum>
              <template slot="prepend">{{$t('c2c.buyAmount')}}</template>
            </el-input>
            <div class="payType">
              <span>{{$t('c2c.payMethods')}}</span>
              <el-radio-group v-model="buy.payWay" @change="getAds('buy')">
                <el-radio v-for="payType in payWays" :label="payType" :key="payType">{{payType}}</el-radio>
              </el-radio-group>
              <!-- <span class="must-yourself">（必须由本人支付）</span> -->
              <!-- <span class="must-know">《交易须知》</span> -->
            </div>
            <div class="unit-price">
              <div class="estimate input-left">{{$t('c2c.buyEstimate')}}</div>
              <el-select :value="curSellAd.unitPrice | fiatCurrency" :loading="isGettingSellAds" @change="getCurSellAd">
                <el-option v-for="item in sellAds" :key="item._id" :label="item.unitPrice | fiatCurrency" :value="item">
                </el-option>
              </el-select>
            </div>
            <div class="system-price">{{$t('c2c.systemIsNice')}}</div>
            <el-input type="number" disabled :value="countBuy | fiatCurrency">
              <template slot="prepend">{{$t('common.money')}}</template>
            </el-input>
            <el-button type="danger" style="width: 100%;margin-top: 35px;" @click="buyHandle">{{$t('c2c.imBuy')}}</el-button>
            <!-- <div class="needOrget">需要<span class="need"> 6792.30 </span>CNY</div> -->
          </el-col>
          <el-col :lg="12" :md="12" :sm="12" :xs="24" class="sell">
            <div class="form-title font16">{{$t('common.sell')}}{{currency}}</div>
            <el-input placeholder="0" v-model="sell.count" @change="getAds('sell')" @blur="getAds('sell')" v-posNum>
              <template slot="prepend">{{$t('c2c.sellAmount')}}</template>
            </el-input>
            <div class="payType">
              <span>{{$t('c2c.payMethods')}}</span>
              <el-radio-group v-model="sell.payWay" @change="getAds('sell')">
                <el-radio v-for="payType in payWays" :label="payType" :key="payType">{{payType}}</el-radio>
              </el-radio-group>
              <!-- <span class="must-yourself">（必须由本人支付）</span> -->
              <!-- <span class="must-know">《交易须知》</span> -->
            </div>
            <div class="unit-price">
              <span class="estimate input-left">{{$t('c2c.sellEstimate')}}</span>
              <el-select :value="curBuyAd.unitPrice | fiatCurrency" :loading="isGettingBuyAds" @change="getCurBuyAd">
                <el-option v-for="item in buyAds" :key="item._id" :label="item.unitPrice | fiatCurrency" :value="item">
                </el-option>
              </el-select>
            </div>
            <div class="system-price">{{$t('c2c.systemIsNice')}}</div>
            <el-input text="number" disabled :value="countSell | fiatCurrency">
              <template slot="prepend">{{$t('common.money')}}</template>
            </el-input>
            <el-button type="warning" style="width: 100%;margin-top: 35px;" @click="sellHandle">{{$t('c2c.imSell')}}</el-button>
            <!-- <div class="needOrget">可得<span class="get"> 6792.30 </span>CNY</div> -->
          </el-col>
        </el-row>

      </div>
      <el-row class="marqueen-trade" style="margin-top: 40px;">
        <el-col :lg="12" :md="12" :sm="12" :xs="24" class="left-block">
          <my-marqueen style="height: 200px">
            <template v-if="hotBuyOrders.length > 0">
              <li v-for="(item, index) in hotBuyOrders" :key="index">
                <span class="shanghu">
                  <i class="person iconfont icon-shanghu"></i><span>{{item.nickname}}</span>
                </span>
                <span>{{(item.tradeCurrencyAmount) | currency(currency)}} {{currency}}</span>
                <span>{{item.tradeType}}</span>
                <span>成功</span>
              </li>
            </template>

            <noData v-else></noData>
          </my-marqueen>

        </el-col>
        <el-col :lg="12" :md="12" :sm="12" :xs="24" class="right-block">
          <my-marqueen style="height: 200px" :speed="50">
            <template v-if="hotSaleOrders.length > 0">
              <li v-for="(item, index) in hotSaleOrders" :key="index">
                <span class="shanghu">
                  <i class="person iconfont icon-shanghu"></i><span>{{item.nickname}}</span>
                </span>
                <span>{{item.tradeCurrencyAmount}}</span>
                <span>{{item.tradeType | currency(currency)}} {{currency}}</span>
                <span>成功</span>
              </li>
            </template>
            <noData v-else></noData>
          </my-marqueen>
        </el-col>
      </el-row>
      <section class="otcOrders" style="margin-top: 40px;">
        <TradeOrders :pathForMore="`/finance/trade/history-trade`"></TradeOrders>
      </section>
    </el-col>
  </el-row>
  <AlertBuy :data="show.buy" />
  <AlertSell :data="show.sell" />
</div>
</template>

<script>
import getCurrency from "@/mixins/trade/getCurrency.js";
import getPay from "@/mixins/trade/getPay.js";
import { mapState, mapActions } from "vuex";
import { adQueryVip } from "@/apis/c2c-trade.js";
import TradeOrders from "@/components/TradeOrders.vue";
import MyMarqueen from "@/components/marqueen.vue";
import OtcSidebar from "@/components/OtcsideBar.vue";
import AlertBuy from "@/components/c2c-trade/alert/buy.vue";
import AlertSell from "@/components/c2c-trade/alert/sell.vue";

export default {
  mixins: [getCurrency, getPay],
  components: {
    TradeOrders,
    AlertBuy,
    AlertSell,
    MyMarqueen,
    OtcSidebar
  },
  // watch: {
  //   hotBuyOrders: {
  //     handler (val) {
  //       debugger
  //     },
  //     deep: true
  //   }
  // },
  computed: {
    ...mapState({
      token: state => state.user.token,
      common: state => state.common,
      hotBuyOrders: state => state.trade_order.hotBuyOrders,
      hotSaleOrders: state => state.trade_order.hotSaleOrders,
      curOrders: state => state.trade_order.orders,
      quotes: state => state.quotes,
      otc_buy_ads: state => state.trade_order.otc_buy_ads,
      otc_sell_ads: state => state.trade_order.otc_sell_ads,
      vip_status: state => state.c2c_trade.vip_status
    }),
    curQuotes() {
      let data;
      this.quotes.map((item, index) => {
        if (this.currency === item.currencyId) {
          data = this.quotes[index];
        }
      });
      return data;
    },
    countBuy() {
      let count = Number(this.curSellAd.unitPrice) * Number(this.buy.count);
      return isNaN(count) ? 0 : count;
    },
    countSell() {
      let count = Number(this.curBuyAd.unitPrice) * Number(this.sell.count);
      return isNaN(count) ? 0 : count;
    }
  },
  data() {
    return {
      show: {
        buy: {
          bool: false,
          data: {}
        },
        sell: {
          bool: false,
          data: {}
        }
      },
      buy: {
        count: "",
        payWay: "alipay",
        tradeType: "sell"
      },
      sell: {
        count: "",
        payWay: "alipay",
        tradeType: "buy"
      },
      isGettingSellAds: false,
      isGettingBuyAds: false,
      curSellAd: {},
      curBuyAd: {},
      showFlag: false,
      payTypes: [],
      sellAds: [],
      buyAds: [],
      unitPrice: "",
      timmer: "" // 定时器
    };
  },
  watch: {
    'buy.count'(val) {
      console.log('count======', val)
    },
    sellAds: {
      handler (val) {
        if (val.length > 0) {
          this.curSellAd = val[0]
        }
      },
      deep: true
    },
    buyAds: {
      handler (val) {
        if (val.length > 0) {
          this.curBuyAd = val[0]
        }
      },
      deep: true
    }
  },
  methods: {
    ...mapActions("c2c_trade", ["GET_ADS", "GET_VIP_STATUS"]),
    ...mapActions("trade_order", [
      "INIT_HOTORDERS",
      "GET_OTC_ADS",
      "INIT_ORDERS"
    ]),
    ...mapActions(["GET_EXCHANGERATE"]),
    getCurSellAd(da) {
      this.curSellAd = da;
    },
    getCurBuyAd(da) {
      this.curBuyAd = da;
    },
    nextTick() {
      return new Promise((resolve) => {
        this.$nextTick(() => {
          console.log(this.buy.count)
          resolve()
        })
      })
    },
    async getAds(type) {
      await this.nextTick()
      console.log('out=============')
      type === "buy"
        ? (this.curSellAd.unitPrice = "")
        : (this.curBuyAd.unitPrice = "");
      if (!this[type].payWay || this[type].count <= 0) {
        return;
      }
      type === "buy"
        ? (this.isGettingSellAds = true)
        : (this.isGettingBuyAds = true);
      let data = Object.assign(this[type], {
        currencyId: this.currency,
        legalCurrency: this.fiatCurrency
      });
      let result = await this.GET_ADS(data);
      type === 'buy' && (this.isGettingSellAds = false);
      type === 'sell' && (this.isGettingBuyAds = false);
      if (!result.success) {
        return
      }
      //  测试
      // let result = [{id: 1, unitPrice: '6.1'}, {id: 2, unitPrice: '6.2'}]
      if (type === "buy") {
        this.sellAds = result.data.list;
        this.isGettingSellAds = false;
      } else {
        this.buyAds = result.data.list;
        this.isGettingBuyAds = false;
      }
    },
    buyHandle() {
      if (
        !this.buy.payWay ||
        this.buy.count <= 0 ||
        !this.curSellAd.unitPrice
      ) {
        return;
      }
      let data = Object.assign({}, this.buy, this.curSellAd);
      data.countAll = this.countBuy;
      data.fiatCurrency = this.fiatCurrency;
      data.currency = this.currency;
      this.show.buy.bool = true;
      this.show.buy.data = data;
    },
    sellHandle() {
      if (
        !this.sell.payWay ||
        this.sell.count <= 0 ||
        !this.curBuyAd.unitPrice
      ) {
        return;
      }
      let data = Object.assign({}, this.sell, this.curBuyAd);
      data.countAll = this.countSell;
      data.fiatCurrency = this.fiatCurrency;
      data.currency = this.currency;
      this.show.sell.bool = true;
      this.show.sell.data = data;
    }
  },
  mounted() {
    if (this.token) {
      this.GET_VIP_STATUS();
    }
    this.INIT_HOTORDERS(this.currency);
  },
  destroyed() {
    clearInterval(this.timmer)
  },
  async created() {
    process.client && await this.GET_EXCHANGERATE(this.fiatCurrency);
  }
};
</script>

<style lang="scss" scoped>
.c2c-page {
  .shanghu {
    padding-left: 5px;
    box-sizing: border-box;
  }
  .person {
    margin-right: 2px;
    @include notpc {
      display: none;
    }
  }
  .leftSide {
    padding-right: 20px;
    @include phone {
      padding-right: 0px;
    }
  }
  .rightSide {
    padding-top: 30px;
    padding-left: 20px;
    @include pc {
      border-left: 1px solid $line-color;
    }
    @include pad {
      border-left: 1px solid $line-color;
    }
    @include phone {
      padding-left: 0px;
    }
    box-sizing: border-box;
    height: 100%;
    .needOrget {
      color: $font-color5;
      @include fontsize("small");
      margin-top: 10px;
      .need {
        color: $font-color6;
      }
      .get {
        color: $font-color7;
      }
    }
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 10px;
      .left {
        @include fontsize("title1");
      }
    }
    .market-price {
      display: flex;
      & > div {
        margin-right: 20px;
        &:nth-last-of-type(1) {
          margin-right: 0;
        }
      }
      @include xs {
        justify-content: space-between;
        flex-direction: column;
        & > div {
          margin-right: 0px;
          margin-top: 5px;
        }
      }
      .price-title {
        color: $font-color4;
      }
      .price-count {
        color: $font-color2;
      }
      .percent {
        color: $font-color7;
      }
    }
    .trade-form {
      margin-top: 35px;
      .el-select {
        width: 100%;
      }
      .buy {
        @include pad {
          padding-right: 30px;
          border-right: 1px dashed $line-color;
        }
        @include pc {
          padding-right: 30px;
          border-right: 1px dashed $line-color;
        }
      }
      .sell {
        @include pad {
          padding-left: 30px;
        }
        @include pc {
          padding-left: 30px;
        }
        @include phone {
          margin-top: 40px;
        }
      }
      .form-title {
        margin-bottom: 15px;
      }
      .payType {
        margin-top: 15px;
        margin-bottom: 20px;
        @include fontsize("small");
        display: flex;
        justify-content: flex-start;
        align-items: center;
        .el-radio{
          margin-right: 8px;
          margin-left: 0;
        }
        // /deep/ .el-radio+.el-radio{
        //   margin-right: 5px;
        //   margin-left: 0;
        // }
        /deep/ .el-radio__label{
          padding-left: 3px;
        }
        &>span{
          margin-right: 10px;
          min-width: 50px;
          margin-bottom: 3px;
        }
        .must-know {
          color: $font-color5;
        }
        .must-yourself {
          color: $btn-red;
        }
      }
      .unit-price {
        display: flex;
        align-items: center;
      }
      .system-price {
        color: $btn-red;
        margin-top: 15px;
        margin-bottom: 20px;
        @include fontsize("small");
      }
    }
    .marqueen-trade {
      .left-block {
        @include pad {
          padding-right: 30px;
        }
        @include pc {
          padding-right: 30px;
        }
      }
      .right-block {
        @include pad {
          padding-left: 30px;
        }
        @include pc {
          padding-left: 30px;
        }
        @include phone {
          margin-top: 20px;
        }
      }
    }
  }
}
</style>

<style lang="scss">
.c2c-alert {
  .el-dialog__header,
  .el-dialog__body,
  .el-dialog__footer {
    padding: 0;
  }
  .el-dialog {
    width: 500px;
    padding-bottom: 20px;
    @include phone {
      width: 90%;
    }
  }
}
</style>
