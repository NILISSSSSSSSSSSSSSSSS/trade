<template>
  <div class="advertising container">
    <el-row>
      <el-col :lg="5" :md="5" :sm="5" :xs="24" class="leftSide">
        <OtcSideBar :currencyCombine="currencyCombine" routeName="publish"></OtcSideBar>
      </el-col>
      <el-col :lg="19" :md="19" :sm="19" :xs="24" class="rightSide">
        <div class="title">
          <div class="coinLogo"></div>
          <span class="left">{{ currency }} 对 {{ fiatCurrency }}</span>
        </div>
        <!-- <div class="market-price">
          <div><span class="price-title">日涨跌：</span><span class="price-count percent">-0.30%</span></div>
          <div><span class="price-title">最高价：</span><span class="price-count">￥6.78</span></div>
          <div><span class="price-title">最低价：</span><span class="price-count">￥6.60</span></div>
        </div> -->

        <div class="operate-box">
          <div class="item">
            <div class="left">
              <span class="input-left">交易类型</span>
              <el-select 
                v-model="adCreatInfo.tradeType" 
                placeholder="请选择" 
                class="input select"
                :disabled="hasId">
                <el-option
                  v-for="item in tradeTypes"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div class="left right">
              <el-checkbox v-model="adCreatInfo.acceptC2C" class="check">是否接受委托交易</el-checkbox>
            </div>
          </div>
          <div class="item">
            <div class="left">
              <span class="input-left">对标交易所</span>
              <el-select v-model="adCreatInfo.quotationSource" :label="quotationSourceName" class="input select" placeholder="请选择" @change="selectQutation">
                <el-option
                  v-for="(item, i) in quotationSources"
                  :key="i"
                  :label="item.name"
                  :value="item">
                </el-option>
              </el-select>
            </div>
            <div class="left right">
              <el-input :value="quotationSourceValue*(adCreatInfo.overPercent/100+1) | fiatCurrency" placeholder="请选择交易所" class="input buy-evaluate append" disabled>
                <template slot="prepend">{{adCreatInfo.tradeType === 'sell' ? '卖出估价' : '买入估价'}}</template>
                <template slot="append">{{ fiatCurrency }}</template>
              </el-input>
            </div>
          </div>

          <div class="item range">
            <div class="left over-range">
              <el-input v-model="adCreatInfo.overPercent" placeholder="请输入内容" class="input append" v-num>
                <template slot="prepend">溢价</template>
                <template slot="append">%</template>
              </el-input>
              <div>溢价范围：
                <span v-if="currency === item.id" v-for="(item,i) in configureCurrencyInfo" :key="i">
                  {{ item.overPercent.low * 100 }}% - {{ item.overPercent.high * 100 }}%
                </span>
              </div>
            </div>
            <div class="left right">
              <el-input v-model="adCreatInfo.priceLimit" placeholder="请输入内容" class="input append" v-posNum>
                <template slot="prepend">{{adCreatInfo.tradeType === 'sell' ? '可接受最低单价' : '可接受最高单价'}}</template>
                <template slot="append">{{ fiatCurrency }}</template>
              </el-input>
            </div>
          </div>
          <div class="item">
            <div class="left">
              <el-input v-model="adCreatInfo.count" placeholder="请输入内容" class="input append" v-posNum>
                <template slot="prepend">{{adCreatInfo.tradeType === 'sell' ? '卖出量' : '购买量'}}</template>
                <template slot="append">{{ currency }}</template>
              </el-input>
            </div>
          </div>
          <div class="item">
            <div class="left">
              <el-input v-model="adCreatInfo.countMinLimit" placeholder="请输入内容" class="input append" v-posNum>
                <template slot="prepend">最小限额</template>
                <template slot="append">{{ currency }}</template>
              </el-input>
            </div>
            <div class="left right">
              <el-input v-model="adCreatInfo.countMaxLimit" placeholder="请输入内容" class="input append" v-posNum>
                <template slot="prepend">最大限额</template>
                <template slot="append">{{ currency }}</template>
              </el-input>
            </div>
          </div>

          <div class="item range">
            <div class="left over-range">
              <el-input v-model.number="adCreatInfo.orderMaxLimit" placeholder="请输入内容" class="input" v-posInt>
                <template slot="prepend">最大处理订单数</template>
              </el-input>
              <div class="">同时最大处理订单数 (0 = 不限制)</div>
            </div>
            <div class="left right pay-type">
              <div></div>
              <div class="payType">
                <span class="name">支付方式:</span>
                <el-checkbox-group v-model="adCreatInfo.payWay">
                  <el-checkbox v-for="payType in payWays" :label="payType" :key="payType">{{payType}}<span class="must-yourself">（必须由本人支付）</span></el-checkbox>
                </el-checkbox-group>
              </div>
            </div>
          </div>
        </div>
        <div class="input-area">
          <el-input
            type="textarea"
            :rows="5"
            placeholder="自动回复消息"
            v-model="adCreatInfo.autoReplyMessage">
          </el-input>
          <div class="area-tip">
            当买家下订单之后，自动回复给买家的消息，比如您接受的收款方式和收款信息等。留空的话就不会自动发送任何消息
          </div>
        </div>
        <div class="btn-box">
          <el-button 
            v-if="hasId" 
            class="btn" 
            type="danger"
            @click="_pubAd(adCreatInfo)">
            上架广告
          </el-button>
          <el-button 
            v-else
            class="btn" 
            type="danger" 
            @click="_pubAd(adCreatInfo)">
            发布交易
          </el-button>
        </div>
        <div class="rules">
          <dl>
            <dt>广告规则和要求：</dt>
            <dd>1.出售 BTC 广告最低可见余额为 0,请确保你的钱包内有足够的 BTC</dd>
            <dd>2.发布 BTC 广告将收取价值0 BTC 的 ETH</dd>
            <dd>3.BTC 广告成交手续费为 0.0005%，广告手续费由发布广告的用户承担。</dd>
            <dd>4.特定付款方式要求您验证身份，然后您的交易广告才会显示。</dd>
            <dd>5.发起交易后，价格就会确定，请谨慎设定您的交易价格。</dd>
            <dd>6.您不能代表其他人（由经纪人处理）购买或出售数字币。</dd>
            <dd>7.您仅可以使用以自己名字注册的付款账户（非第三方付款！）。</dd>
          </dl>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import getCurrency from "@/mixins/trade/getCurrency.js";
import getPay from "@/mixins/trade/getPay.js";
import OtcSideBar from "@/components/OtcsideBar";
import { mapState, mapActions } from "vuex";
import { adsSave, queryOneAd } from "@/apis/adver";
import { getCurrencyPriceAll } from "@/apis/common";
import { exchangeRate } from "@/apis/information";
import { getConfigureCurrencyInfo } from "@/apis/configure";

export default {
  mixins: [getCurrency, getPay],
  middleware: ["userAuth"],
  data() {
    return {
      currencyCombine: {},
      quotationSourceName: "",
      tradeTypes: [
        {
          value: "sell",
          label: "卖出"
        },
        {
          value: "buy",
          label: "买入"
        }
      ],
      value: "",
      textarea: "",
      quotationSources: [],
      quotationSourceValue: "",
      adCreatInfo: {
        acceptC2C: false,
        quotationSource: "",
        tradeType: "",
        payWay: [],
        orderMaxLimit: "",
        countMaxLimit: "",
        countMinLimit: "",
        count: "",
        priceLimit: "",
        overPercent: "",
        autoReplyMessage: ""
      },
      id: null,
      configureCurrencyInfo: {}
    };
  },
  components: {
    OtcSideBar
  },
  computed: {
    ...mapState({
      common: state => state.common
    }),
    hasId() {
      return !!this.id;
    }
  },
  mounted() {
    this.id = this.$route.query.id;
    if (this.hasId) {
      this._queryOneAd();
    }
    this._getCurrencyPriceAll([this.currency]);
    this._getConfigureCurrencyInfo()
  },
  methods: {
    ...mapActions(["GET_EXCHANGERATE"]),
    async _getConfigureCurrencyInfo() {
      let res = await getConfigureCurrencyInfo({ids: this.common.currencies});
      if (res.success) {
        this.configureCurrencyInfo = res.data
      }
      console.log('TCL: async_getConfigureCurrencyInfo -> res', res);
    },
    async _getCurrencyPriceAll(params) {
      let res = await getCurrencyPriceAll(params);
      console.log("​async_getCurrencyPriceAll -> res", res);
      if (res.success && res.data.count > 0) {
        this.quotationSources = res.data.list[0].quotations;
      }
    },
    async _pubAd(params) {
      console.log(params)
      if (!params.tradeType) {
        this.$message.error("请选择交易类型");
        return;
      } else if (!params.quotationSource) {
        this.$message.error("请选择对标交易所");
        return;
      } else if (!params.overPercent) {
        this.$message.error("请输入溢价");
        return;
      } else if (!params.priceLimit) {
        this.$message.error("请输入可接受最高单价");
        return;
      } else if (!params.count) {
        this.$message.error("请输入购买数量");
        return;
      } else if (!params.countMinLimit) {
        this.$message.error("请输入最小限额");
        return;
      } else if (!params.countMaxLimit) {
        this.$message.error("请输入最大限额");
        return;
      } else if (!params.orderMaxLimit) {
        this.$message.error("请输入最大处理订单数");
        return;
      } else if (params.payWay.length === 0) {
        this.$message.error('请选择支付方式')
        return
      } else if (Number(params.countMaxLimit) < Number(params.countMinLimit)) {
        this.$message.error('最大限额要大于等于最小限额')
        return
      } else if (Number(params.count) < Number(params.countMaxLimit)) {
        this.$message.error('交易量要大于等于最大限额')
        return
      }
      // params.overPercent = params.overPercent / 100;
      // 修改广告
      if (this.hasId) {
        const resData = await adsSave({
          ...params,
          currencyId: this.currency,
          legalCurrency: this.fiatCurrency,
          overPercent: params.overPercent / 100,
          id: this.id
        });
        if (resData.success) {
          this.$message.success("广告上架成功!");
          this.$i18n.push("/finance/trade/myAdver");
        }
        return;
      }
      const resData = await adsSave({
        ...params,
        currencyId: this.currency,
        legalCurrency: this.fiatCurrency,
        overPercent: params.overPercent / 100
      });
      if (resData.success) {
        this.$message.success("广告发布成功!");
        this.clear();
      }
    },
    clear() {
      this.adCreatInfo = {
        acceptC2C: false,
        quotationSource: "",
        tradeType: "",
        payWay: [],
        orderMin: "",
        orderMax: "",
        maxOrderLimit: "",
        overPercent: "",
        limitPrice: "",
        description: "",
        adType: "C2C",
        currencyId: "" || "BTC",
        legalCurrency: "" || "CNY"
      };
    },
    selectQutation(data) {
      this.adCreatInfo.quotationSource = data.name;
      this.quotationSourceValue = data.usdValue;
    },
    async _queryOneAd() {
      const resData = await queryOneAd(this.id);
      if (resData.success) {
        this.adCreatInfo = Object.assign({}, this.adCreatInfo, resData.data, {
          overPercent: resData.data.overPercent * 100
        });
      }
    }
  },
  async created() {
    process.client && (await this.GET_EXCHANGERATE(this.fiatCurrency));
  }
};
</script>

<style lang="scss" scoped>
.advertising {
  padding-left: 20px;
  padding-right: 20px;
  dl,
  dt,
  dd {
    margin: 0;
    padding: 0;
  }
  @include phone {
    padding: 10px;
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
  .title {
    margin-bottom: 30px;
    .left {
      @include fontsize("title1");
      color: $font-color2;
    }
  }
  .market-price {
    display: flex;
    @include fontsize("content3");
    color: $font-color4;
    margin-bottom: 20px;
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

  .operate-box {
    .item {
      width: 100%;
      margin-bottom: 20px;
      display: flex;
      flex-wrap: wrap;
      @include phone {
        margin-bottom: 0px;
      }
      .left {
        width: 48%;
        margin-right: 2%;
        display: flex;
        align-items: center;
        @include phone {
          width: 96%;
          margin: 0 2%;
          margin-right: 0;
          margin-bottom: 20px;
        }
        .input-left {
          min-width: 116px;
          border-radius: 2px;
          border: 1px solid $line-color;
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
          @include fontsize("content3");
          padding: 0 12px;
          height: 38px;
          line-height: 38px;
          background-color: $line-color;
          display: inline-block;
          position: relative;
          white-space: nowrap;
          border-right: 0;
          width: 1px;
        }
        .input {
          flex: 1;
        }
        .append {
          /deep/ .el-input__inner {
            border-right: none;
          }
        }
        .select {
          /deep/ .el-input__inner {
            background-color: $table-header-color;
          }
        }
      }
      .right {
        margin-right: 0;
        .check {
          color: $font-color2;
          font-weight: 600;
        }
      }
      .pay-type {
        line-height: 40px;
        @include phone {
          line-height: 20px;
        }
      }
      .buy-evaluate {
        /deep/ .el-input__inner {
          color: $font-color6;
        }
      }
    }
    .range {
      align-items: flex-start;
      .over-range {
        flex-direction: column;
        align-items: flex-end;
        color: $font-color5;
        @include fontsize("small");
        min-height: 20px;
        line-height: 26px;
        @include phone {
          width: 96%;
          margin: 0 2%;
        }
      }
    }
  }

  .input-area {
    width: 100%;
    @include fontsize("small");
    color: $font-color5;
    margin-bottom: 50px;
    .area-tip {
      padding-top: 10px;
      line-height: 12px;
    }
  }
  .btn-box {
    max-width: 580px;
    margin: 0 auto;
    margin-bottom: 60px;
    @include phone {
      width: 96%;
    }
    .btn {
      width: 100%;
    }
  }
  .rules {
    @include fontsize("content3");
    margin-bottom: 50px;
    dt {
      color: $font-color2;
      margin-bottom: 10px;
      font-weight: 600;
    }
    dd {
      color: $font-color3;
      line-height: 24px;
    }
  }
  /deep/ .el-input-group__prepend {
    @include fontsize("content3");
    background-color: $line-color;
    border-color: $line-color;
    border-radius: $radius-small;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    color: $font-color3;
    min-width: 116px;
    padding: 0 12px;
  }
  /deep/ .el-checkbox__label {
    @include fontsize("small");
    @include phone {
      padding-left: 3px;
    }
  }
  /deep/ .el-input__inner {
    border-color: $line-color;
    outline: none;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    &:focus {
      border-color: $line-color !important;
    }
  }
  /deep/ .el-checkbox + .el-checkbox {
    @include pad {
      margin-left: 5px;
    }
    @include phone {
      margin-left: 5px;
    }
  }
  /deep/ .el-checkbox__label {
    padding-left: 3px;
  }
  /deep/ .el-input-group__append {
    background: none;
    border-radius: 0;
  }

  .unit-price {
    display: flex;
    align-items: center;
  }
  .payType {
    display: inline-block;
    @include fontsize("small");
    .name {
      margin-right: 10px;
    }
    /deep/ .el-checkbox-group {
      display: inline-block;
    }
    .must-yourself {
      color: $btn-red;
    }
  }
  ::-webkit-input-placeholder {
    /* WebKit browsers */
    font-size: 14px;
  }
  :-moz-placeholder {
    /* Mozilla Firefox 4 to 18 */
    font-size: 14px;
  }
  ::-moz-placeholder {
    /* Mozilla Firefox 19+ */
    font-size: 14px;
  }
  :-ms-input-placeholder {
    /* Internet Explorer 10+ */
    font-size: 14px;
  }
}
</style>

