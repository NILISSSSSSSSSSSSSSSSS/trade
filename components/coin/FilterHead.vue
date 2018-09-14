<template>
  <div class="filter-head">
    <div class="left">
      <i class="el-icon-info"></i>
      <span class="b1">
        {{ currency }} 
        <i></i>
      </span>
      <span class="b2"> 对 </span>
      <span class="b3">{{ zoneCurrency }}</span>
    </div>

    <div class="center">
      <span class="p1">
        ${{ USDPrice | fiatCurrency }} 
        或
        ￥{{ CNYPrice | fiatCurrency }}
      </span>
      <span class="pp p2">涨幅 <i>{{config.rise | floatTopercent}}</i></span>
      <span class="pp p3">高 {{config.high | currency(currency)}}</span>
      <span class="pp p4">低 {{config.low | currency(currency)}}</span>
    </div>

    <div class="right">
      <!--<el-select 
        v-model="tradePair" 
        placeholder="请选择"
        ref="select"
        @visible-change="handleVisible">
      </el-select>-->
      <div 
        @click="handleVisible"
        class="el-select">
        <div class="el-input el-input--suffix">
          <input 
            type="text" 
            autocomplete="off" 
            placeholder="请选择" 
            readonly="readonly" 
            class="el-input__inner"
            :value="tradePair">
          <span class="el-input__suffix"><span class="el-input__suffix-inner"><i class="el-select__caret el-input__icon el-icon-arrow-up"></i><!----></span><!----></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex"

export default {
  props: {
    tradePair: ""
  },
  data() {
    return {
      visible: false
    }
  },
  computed: {
    ...mapGetters("coin_trade", ["pairPrice"]),
    ...mapGetters("information", ["USDTRate"]),
    ...mapGetters(["quotes"]),
    config() {
      if (this.pairPrice[0]) {
        return this.pairPrice[0]
      }
      return {
        low: 0,
        high: 0
      }
    },
    currency() {
      return this.tradePair.split("_")[0]
    },
    zoneCurrency() {
      return this.tradePair.split("_")[1]
    },
    currencyPrice() {
      return this.config.price ? this.config.price : 1
    },
    zoneUSDPrice() {
      const arr = this.quotes.filter(quote => {
        return quote.currencyId === this.zoneCurrency
      })
      if (arr[0]) {
        return arr[0].currentPrice
      }
      return 1
    },
    CNYRate() {
      return this.USDTRate["CNY"] ? this.USDTRate.CNY.usdValue : 1
    },
    CNYPrice() {
      return this.zoneUSDPrice / this.currencyPrice / this.CNYRate
    },
    USDPrice() {
      return this.zoneUSDPrice / this.currencyPrice
    }
  },
  mounted() {
    if (!this.USDTRate.CNY) {
      this.GET_USDR_RATE("CNY")
    }
  },
  watch: {
    tradePair: {
      handler(val) {
        if (val) {
          this.GET_PAIRPRICE([val])
        }
      },
      immediate: true
    },
    CNYRate(val) {},
    USDRate(val) {}
  },
  methods: {
    ...mapActions("coin_trade", ["GET_PAIRPRICE"]),
    ...mapActions("information", ["GET_USDR_RATE"]),
    handleVisible() {
      this.visible = !this.visible
      this.$emit("visible", this.visible)
    }
  }
}
</script>

<style lang="scss" scoped>
.filter-head {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  background-color: $bg-content;
  border-bottom: 1px solid $line-color;
  border-top-left-radius: 4px;
  border-top-right-radius: 4px;
  .left {
    width: 30%;
  }
  .right {
    width: 20%;
    text-align: right;
  }
  .center {
    width: 50%;
    color: $font-color4;
    @include fontsize("content3");
    .pp {
      margin-left: 10px;
    }
  }
  .b1,
  .b3 {
    @include fontsize("title2");
    font-weight: bold;
    color: $font-color2;
  }

  @media screen and (max-width: 840px) {
    flex-direction: column;
    .left {
      text-align: center;
      width: 100%;
    }
    .right {
      text-align: center;
      width: 100%;
    }
    .center {
      text-align: center;
      margin-top: 10px;
      margin-bottom: 10px;
      width: 100%;
      .p1 {
        display: block;
      }
    }
  }
}
</style>
