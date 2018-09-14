<template>
<div class="otc container">
  <el-row>
    <el-col :lg="5" :md="5" :sm="5" :xs="24" class="leftSide">
      <OtcSideBar :currencyCombine="currencyCombine" routeName="otc"></OtcSideBar>
    </el-col>
    <el-col :lg="19" :md="19" :sm="19" :xs="24" class="rightSide" v-if="otc_sell_ads.total !== undefined">
      <section class="otcTrade">
        <el-button class="advert" @click="$i18n.push(`/publish/${currency}_${fiatCurrency}`)">{{ $t('common.adver.publish') }}</el-button>
        <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
          <el-tab-pane :label="$t('common.buy')+currency" name="buy">
            <div class="tables">
              <!-- 买入广告 -->
              <el-table class="trade-table" :data="otc_sell_ads.list" style="width: 100%">
                <el-table-column :label="$t('common.user')" :render-header="userLabel" width="175px">
                  <template slot-scope="scope">
                    <img class="avatar" :src="imgHost + scope.row.avatar" alt="avatar">
                    <div class="user">
                      <span>{{ scope.row.nickName }}</span>
                      <img src="@/assets/img/vip.png" class="vip" v-show="scope.row.acceptC2C" />
                    </div>
                    <div class="userDetail">({{ scope.row.tradeCount }} | {{ (((scope.row.count - scope.row.remainCount) / scope.row.count) * 100).toFixed(0) }}%)</div>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('common.leftAmount')+'('+currency+')'">
                  <template slot-scope="scope">
                    {{ scope.row.remainCount | currency(currency) }}
                  </template>
                </el-table-column>
                <el-table-column :label="$t('common.price')+'('+fiatCurrency+')'">
                  <template slot-scope="scope"> 
                    {{ scope.row.unitPriceUSD | fiatCurrency }}
                  </template>
                </el-table-column>
                <el-table-column :label="$t('common.adver.tradeLimit')+'('+currency+')'">
                  <template slot-scope="scope">
                    {{ scope.row.countMinLimit | currency(currency) }} ~ {{ scope.row.countMaxLimit | currency(currency) }}
                  </template>
                </el-table-column>
                <el-table-column :label="$t('common.onlineStatus')" sortable width="120px">
                  <template slot-scope="scope">
                    <span v-if="scope.row.isOnline">{{ $t('common.online') }}</span>
                    <span v-else>{{ $t('common.offline') }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="payWay" :label="$t('common.adver.payMethods')" width="120px">
                  <template slot-scope="scope">
                    <img class="payType" :src="item.icon" alt="logo" v-if="scope.row.payWay.indexOf(item)" v-for="(item, i) in payWays" :key="i">
                  </template>
                </el-table-column>
                <el-table-column :label="$t('common.opreation')" width="100px">
                  <template slot-scope="scope">
                    <el-button type="error" size="small" class="buyBtn" @click="buyDialog(scope.row)">{{ $t('common.buy') }}</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <el-pagination v-model="sell_page" @current-change="sell_pagechange" class="pagenation trade-pagination" background layout="prev, pager, next" :page-count="Math.ceil(otc_sell_ads.total / pageSize)">
            </el-pagination>
          </el-tab-pane>

          <el-tab-pane :label="$t('common.sell')+currency" name="sell">
            <el-table class="trade-table" :data="otc_buy_ads.list" style="width: 100%">
              <el-table-column :label="$t('common.user')" :render-header="userLabel" width="175px">
                  <template slot-scope="scope">
                    <img class="avatar" :src="imgHost + scope.row.avatar" alt="avatar">
                    <div class="user">
                      <span>{{ scope.row.nickName }}</span>
                      <img src="@/assets/img/vip.png" class="vip" v-show="scope.row.acceptC2C" />
                    </div>
                    <div class="userDetail">({{ scope.row.tradeCount }} | {{ (((scope.row.count - scope.row.remainCount) / scope.row.count) * 100).toFixed(0) }}%)</div>
                  </template>
                </el-table-column>
                <el-table-column :label="$t('common.leftAmount')+'('+currency+')'">
                  <template slot-scope="scope">
                    {{ scope.row.remainCount | currency(currency) }}
                  </template>
                </el-table-column>
                <el-table-column :label="$t('common.price')+'('+fiatCurrency+')'">
                  <template slot-scope="scope"> 
                    {{ scope.row.unitPriceUSD | fiatCurrency }}
                  </template>
                </el-table-column>
                <el-table-column :label="$t('common.adver.tradeLimit')+'('+currency+')'">
                  <template slot-scope="scope">
                    {{ scope.row.countMinLimit | currency(currency) }} ~ {{ scope.row.countMaxLimit | currency(currency) }}
                  </template>
                </el-table-column>
                <el-table-column :label="$t('common.onlineStatus')" sortable width="120px">
                  <template slot-scope="scope">
                    <span v-if="scope.row.isOnline">{{ $t('common.online') }}</span>
                    <span v-else>{{ $t('common.offline') }}</span>
                  </template>
                </el-table-column>
              <el-table-column prop="payType" :label="$t('common.adver.payMethods')" width="120px">
                <template slot-scope="scope">
                  <img class="payType" :src="item.icon" alt="logo" v-if="scope.row.payWay.indexOf(item)" v-for="(item, i) in payWays" :key="i">
                </template>
              </el-table-column>
              <el-table-column :label="$t('common.opreation')" width="100px">
                <template slot-scope="scope">
                  <el-button type="error" size="small" class="saleBtn" @click="sellDialog(scope.row)">{{ $t('common.sell') }}</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination v-model="buy_page" @current-change="buy_pagechange" class="pagenation trade-pagination" background layout="prev, pager, next" :page-count="Math.ceil(otc_buy_ads.total / pageSize)">
            </el-pagination>
          </el-tab-pane>
        </el-tabs>
      </section>
      <section class="otcOrders">
        <TradeOrders :pathForMore="`/finance/trade/history-otc`"></TradeOrders>
      </section>
    </el-col>
  </el-row>

  <el-dialog :visible.sync="buyDialogFormVisible" class="buyDialog dialogStyle">
    <div slot="title">
      <span class="font-red">{{ $t('common.buy') }}</span>{{ $t('otc.plzConfirm') }}
    </div>
    <el-form :model="orderForm">
      <el-form-item :label="$t('otc.price')">
        <span class="font-blue">{{ selectAd.unitPriceUSD | fiatCurrency }}</span> 
        {{ fiatCurrency }}
      </el-form-item>
      <el-form-item :label="$t('otc.buyAmount')">
        <el-input v-model="orderForm.tradeCurrencyAmount" class="buyNumber" placeholder="0.00" v-posNum></el-input>
        {{ currency }}
      </el-form-item>
      <el-form-item :label="$t('otc.amount')">
         <span class="font-blue">{{ ((selectAd.unitPriceUSD * orderForm.tradeCurrencyAmount) || 0) | fiatCurrency}}</span>
        {{ fiatCurrency }}
      </el-form-item>
      <el-form-item :label="$t('otc.quota')">
        <span class="font-blue">{{ selectAd.countMinLimit | currency(currency) }} ~ {{ selectAd.countMaxLimit | currency(currency) }}</span> 
        {{ currency }}
      </el-form-item>
      <el-form-item :label="$t('otc.tradeType')">
        <span v-for="(item, i) in selectAd.payWay" :key="i">
          {{ item }}
          <span v-if="i!==0">/</span>
        </span>
      </el-form-item>
    </el-form>
    <div class="line border-bottom"></div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="buyDialogConfirm">{{ $t('otc.confirm') }}</el-button>
      <el-button @click="buyDialogFormVisible = false" class="btn-cancel">{{ $t('otc.cancel') }}</el-button>
    </div>
  </el-dialog>

  <el-dialog :visible.sync="sellDialogFormVisible" class="sellDialog dialogStyle">
    <div slot="title">
      <span class="font-green">{{ $t('common.sell') }}</span>{{ $t('otc.plzConfirm') }}
    </div>
    <el-form :model="orderForm">
      <el-form-item :label="$t('otc.price')">
        <span class="font-blue">{{ selectAd.unitPriceUSD | fiatCurrency }}</span> 
        {{ fiatCurrency }}
      </el-form-item>
      <el-form-item :label="$t('otc.sellAmount')">
        <el-input v-model="orderForm.tradeCurrencyAmount" class="buyNumber" placeholder="0.00" v-posNum></el-input>
        {{ currency }}
      </el-form-item>
      <el-form-item :label="$t('otc.amount')">
         <span class="font-blue">{{ ((selectAd.unitPriceUSD * orderForm.tradeCurrencyAmount) || 0) | fiatCurrency}}</span>
        {{ fiatCurrency }}
      </el-form-item>
      <el-form-item :label="$t('otc.quota')">
        <span class="font-blue">{{ selectAd.countMinLimit | currency(currency) }} ~ {{ selectAd.countMaxLimit | currency(currency) }}</span> 
        {{ currency }}
      </el-form-item>
      <el-form-item :label="$t('otc.tradeType')">
        <span v-for="(item, i) in selectAd.payWay" :key="i">
          {{ item }}
          <span v-if="i!==0">/</span>
        </span>
      </el-form-item>
    </el-form>
    <div class="line border-bottom"></div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="sellDialogConfirm">{{ $t('otc.confirm') }}</el-button>
      <el-button @click="sellDialogFormVisible = false" class="btn-cancel">{{ $t('otc.cancel') }}</el-button>
    </div>
  </el-dialog>
</div>
</template>

<script>
import getCurrency from '@/mixins/trade/getCurrency.js'
import OtcSideBar from "@/components/OtcsideBar"
import TradeOrders from "@/components/TradeOrders"
import { otcBuyIn, otcSellOut } from "@/apis/otc"
import { mapState, mapActions } from "vuex"
import { imgHost } from "@/plugins/config";

export default {
  mixins: [getCurrency],
  components: {
    OtcSideBar,
    TradeOrders
  },
  data() {
    return {
      activeName: 'buy',
      imgHost: imgHost,
      selectAd: {},
      orderForm: {},
      buyDialogFormVisible: false,
      sellDialogFormVisible: false,
      pageSize: 10,
      totalRecords: 1,
      buy_page: 1,
      sell_page: 1
    };
  },
  computed: {
    ...mapState({
      common: state => state.common,
      otc_buy_ads: state => state.adver.otc_buy_ads,
      otc_sell_ads: state => state.adver.otc_sell_ads,
      quotes: state => state.quotes, // 数字币行情
      payWays: state => state.common.allLegalCurrency.payWays
    })
  },
  methods: {
    ...mapActions('adver', ['GET_OTC_ADS']),
    ...mapActions('trade_order', ['CREATE_ORDER']),
    ...mapActions(['GET_EXCHANGERATE']),
    handleClick(tab, event) {
      // 买入取的是卖出广告的数据,卖出出的是买入的数据。
      this.GET_OTC_ADS({
        currencyId: this.currency,
        legalCurrency: this.fiatCurrency,
        tradeType: tab.name === 'buy' ? 'sell' : 'buy',
        page: tab.name === 'buy' ? this.sell_page : this.buy_page,
        limit: this.pageSize
      })
    },
    userLabel(h, data) {
      return h("span", [
        h("span", this.$t('common.user')),
        h("span", {
          'style': 'font-size: 12px;color: #999999;'
        }, ["(" + this.$t('common.successTradeCount') + "|" + this.$t('common.tradeRatio') + ")"])
      ])
    },
    buyDialog(data) {
      this.$set(this.orderForm, 'tradeCurrencyAmount', '')
      this.selectAd = data
      this.orderForm.adId = data.id
      this.orderForm.isC2C = false
      this.buyDialogFormVisible = true
    },
    buyDialogConfirm() {
      if (this.orderForm.tradeCurrencyAmount <= 0) {
        this.$message.error('交易量不能小于0')
        return false
      }
      otcBuyIn(this.orderForm).then(res => {
        this.$set(this.orderForm, 'tradeCurrencyAmount', '')
        if (res.success) {
          this.$message.success(this.$t('otc.msgOrderSuccess'))
          this.buyDialogFormVisible = false
        }
      })
    },
    sellDialog(data) {
      this.$set(this.orderForm, 'tradeCurrencyAmount', '')
      this.selectAd = data
      this.orderForm.adId = data.id
      this.orderForm.isC2C = false
      this.sellDialogFormVisible = true
    },
    sellDialogConfirm() {
      if (this.orderForm.tradeCurrencyAmount <= 0) {
        this.$message.error('交易量不能小于0')
        return false
      }
      otcSellOut(this.orderForm).then(res => {
        this.$set(this.orderForm, 'tradeCurrencyAmount', '')
        if (res.success) {
          this.$message.success(this.$t('otc.msgOrderSuccess'))
          this.sellDialogFormVisible = false
        }
      })
    },
    buy_pagechange(page) {
      this.buy_page = page
      this.GET_OTC_ADS({
        currencyId: this.currency,
        legalCurrency: this.fiatCurrency,
        tradeType: 'buy',
        page: page,
        limit: this.pageSize
      })
    },
    sell_pagechange(page) {
      this.sell_page = page
      this.GET_OTC_ADS({
        currencyId: this.currency,
        legalCurrency: this.fiatCurrency,
        tradeType: 'sell',
        page: page,
        limit: this.pageSize
      })
    },
    getPrice(item) {
      // 都是返回的USD,需要进行换算
      let exchangeRate = this.$store.state.exchangeRate;
      let quotes = this.quotes;
      if (exchangeRate != null && quotes.length > 0) {
        let curQuote = quotes.find(x => x.currencyId === this.currency)
        if (curQuote !== null && (exchangeRate.legalCurrencyType === this.fiatCurrency)) {
          console.log(item.unitPriceUSD / exchangeRate.usdValue)
          return item.unitPriceUSD / exchangeRate.usdValue
        } else {
          return ''
        }
      } else {
        return ''
      }
    }
  },
  mounted() {
    console.log('​ asyncmounted -> this.currency ', this.currency);
    this.GET_EXCHANGERATE(this.fiatCurrency)
    this.GET_OTC_ADS({
      currencyId: this.currency,
      legalCurrency: this.fiatCurrency,
      tradeType: 'sell',
      page: 1,
      limit: this.pageSize
    })
  }
}
</script>

<style lang="scss" scoped>
.otc {
  padding-left: 20px;
  padding-right: 20px;
  @include phone {
    padding: 10px;
  }
  .vip {
    vertical-align: middle;
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
  }
  .otcTrade {
    .el-table{
      /deep/ .cell{
        &:nth-of-type(1) {
          padding-left: 20px;
        }
      }
    }
    .advert {
      border: 0;
      right: 0;
      width: 140px;
      position: absolute;
      z-index: 9;
      background: $btn-blue;
      @include fontsize("content2");
      color: $font-color1;
      @include phone {
        width: 90px;
        text-align: center;
        padding: 12px 0px;
      }
    }
    /deep/ .el-tabs__header {
      border: 0;
    }
    /deep/ .el-tabs__item {
      width: 400px;
      text-align: center;
      @include fontsize("content2");
      color: $font-color3;
      border-bottom: 1px solid #e4e7ed;
      @include pad {
        width: 200px;
      }
      @include phone {
        width: 100px;
        padding: 0px;
      }
    }
    /deep/ .el-tabs--card>.el-tabs__header .el-tabs__item.is-active {
      border-bottom-color: #e4e7ed;
    }
    /deep/ #tab-buy.is-active {
      color: $font-color1;
      background: $font-color6;
    }
    /deep/ #tab-sell.is-active {
      color: $font-color1;
      background: $font-color7;
    }
    /deep/ .trade-table thead .cell {
      color: $font-color3;
    }
    /deep/ .el-table__header{
      @include fontsize('content3')
    }
    .avatar {
      width: 30px;
      height: 30px;
      border-radius: 50%;
      background: $primary;
      float: left;
      margin: 5px auto;
    }
    .user {
      font-size: 14px;
      color: $font-color3;
      height: 20px;
      padding-left: 45px;
      white-space: nowrap;
    }
    .userDetail {
      font-size: 12px;
      color: $font-color5;
      height: 12px;
      padding-left: 45px;
    }
    .buyBtn {
      background: $btn-red;
      color: $font-color1;
    }
    .saleBtn {
      background: $btn-green;
      color: $font-color1;
    }
    .payType {
      display: inline-block;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      margin-right: 5px;
      vertical-align: middle;
    }
    .trade-pagination {
      margin: 40px 0;
      @include phone {
        margin: 20px 0;
      }
    }
    /deep/ .el-tabs--card>.el-tabs__header .el-tabs__nav{
      border-radius: $radius-small
    }
  }
  .dialogStyle {
    /deep/ .el-dialog {
      width: 500px;
      @include phone {
        width: 300px;
      }
    }
    /deep/ .el-dialog__header {
      background: $table-header-color;
      padding: 15px 20px 15px 15px;
    }
    /deep/ .el-dialog__body {
      padding: 20px;
      padding-bottom: 0px;
      @include phone {
        padding: 10px;
      }
    }
    /deep/ .el-form-item {
      margin-bottom: 8px;
    }
    /deep/ .el-form-item__label {
      width: 80px;
      text-align: right;
      padding-right: 7px;
      @include fontsize('content3')
    }
    .buyNumber {
      max-width: 300px;
      margin-right: 20px;
      @include phone {
        max-width: 120px;
      }
      /deep/ .el-input__inner {
        color: $primary;
        font-size: 14px;
      }
    }
    .dialog-footer {
      .el-button {
        width: 220px;
        @include phone {
          width: 120px;
        }
      }
      .el-button+.el-button {
        margin-left: 20px;
      }
    }
  }
  /deep/ .trade-table thead th{
    background: $table-header-color;
  }
  /deep/ .el-table__header-wrapper{
    background: $table-header-color;
  }
  /deep/ .el-dialog__footer{
    padding-top: 20px;
  }
  .btn-cancel{
    background: $line-color;
  }
}
</style>
