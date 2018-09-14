<template>
  <div class="new-price" ref="wraper">
    <div class="header border-bottom">
      <span>最新价</span><span v-show="curPairPrice.price"><em class="price">{{curPairPrice.price | currency(pairNameAfter)}} {{pairNameAfter}}</em>
      <em> ≈ {{priceFiat({currency: pairNameBefore}) | fiatCurrency(fiatCurrency)}} {{fiatCurrency}}<i class="price iconfont" :class="curPairPrice.rise >= 0 ? 'icon-jiantouUp' : 'icon-jiantouDown'"></i></em>
    </span>
    </div>
    <div class="content">
      <div class="lists">
        <div class="head list border-bottom">
          <span class="name">档位</span>
          <span class="price">价格({{!localFiatFlag ? pairNameAfter : fiatCurrency}})</span>
          <span class="amount">数量({{pairNameBefore}})</span>
          <span class="total">总计({{!localFiatFlag ? pairNameAfter : fiatCurrency}})</span>
        </div>
        <div class="sell border-bottom scrollbars" ref="sell">
          <div class="list" v-for="(item,index) in sell" :key="index">
            <span class="name">卖{{index + 1}}</span>
            <span class="price" v-if="!localFiatFlag">{{item.price | currency(pairNameAfter)}}</span>
            <span class="price" v-if="localFiatFlag">{{priceFiat({currency: pairNameAfter, price: item.price}) | fiatCurrency(fiatCurrency)}}</span>
            <span class="amount">{{item.count | currency(pairNameBefore)}}</span>
            <span class="total" v-if="!localFiatFlag">{{item.total | currency(pairNameAfter)}}</span>
            <span class="total" v-if="localFiatFlag">{{priceFiat({currency: pairNameAfter, price: item.total}) | fiatCurrency(fiatCurrency)}}</span>
            <span class="bac" :style="`width: ${(item.count / sellMax) * 100}%`" ></span>
          </div>
        </div>
        <div class="line border-bottom"></div>
        <div class="buy border-bottom scrollbars" ref="buy">
          <div class="list" v-for="(item, index) in buy" :key="index">
            <span class="name">买{{index + 1 }}</span>
            <span class="price" v-if="!localFiatFlag">{{item.price | currency(pairNameAfter)}}</span>
            <span class="price" v-if="localFiatFlag">{{priceFiat({currency: pairNameAfter, price: item.price}) | fiatCurrency(fiatCurrency)}}</span>
            <span class="amount">{{item.count | currency(pairNameBefore)}}</span>
            <span class="total" v-if="!localFiatFlag">{{item.total | currency(pairNameAfter)}}</span>
            <span class="total" v-if="localFiatFlag">{{priceFiat({currency: pairNameAfter, price: item.total}) | fiatCurrency(fiatCurrency)}}</span>
            <span class="bac" :style="`width: ${item.count / buyMax * 100}%`"></span>
          </div>
        </div>
      </div>
      <div class="more-box">
        <div class="deep">
          <span>深度合并</span>
          <el-dropdown class="dropdown" trigger="click" @command="selectDepth">
            <span class="el-dropdown-link">
              {{deepType}}<i class="el-icon-caret-bottom el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="item" v-for="(item, index) in deepArr" :key="index" >{{Math.pow(0.1,item).toFixed(item)}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <!-- <div class="more">
          <span>更多</span>
          <i class="el-icon-caret-bottom"></i>
        </div> -->
      </div>
    </div>
  </div>
</template>
<script>
import {mapActions, mapGetters} from 'vuex';
import computeFiatPrice from '@/mixins/coin_trade/computeFiatPrice.js'

export default {
  mixins: [computeFiatPrice],
  data() {
    return {
      buy: [],
      buyMax: 0,
      sellMax: 0,
      sell: [],
      deepType: '',
      pairName: '',
      deepArr: [] // 存取深度的数组
    }
  },
  props: {
  },
  computed: {
    depthData() {
      return this.pairDepth
    },
    fiatCurrency() {
      return this.$store.state.lang.fiatCurrency
    },
    ...mapGetters('coin_trade', ['curPairPrice', 'pairDepth'])
  },
  created() {
    // this.pairName = this.$route.params.pairs
    this.initData(this.depthData, 0)
  },
  watch: {
    depthData: {
      handler: function(val, oldVal) {
        this.depthData.forEach((item) => {
          this.deepArr.push(item.deepType)
        })
        this.initData(val, 0)
      },
      deep: true
    }
  },
  mounted() {
    setTimeout(() => {
      let wraperHeight = this.$refs.wraper.clientHeight - 120 // 100为几个固定字段高度的大概之和(略大一点)
      // console.log(wraperHeight)
      this.$refs.buy.style.height = (wraperHeight / 2) + 'px'
      this.$refs.sell.style.height = (wraperHeight / 2) + 'px'
    }, 20)
  },
  methods: {
    computedbbPrice(curPairPrice) {
      console.log(this.priceFiat({currency: this.pairNameBefore}), this.priceFiat({currency: this.pairNameAfter}))
      let price = this.priceFiat({currency: this.pairNameBefore}) / this.priceFiat({currency: this.pairNameAfter})
      // console.log(price)
      return Number(price) || curPairPrice.price
    },
    changeArr(arr = []) {
      let tmpArr = arr.slice()
      let max = 0
      if (tmpArr.length) {
        tmpArr.forEach((item) => {
          item.total = item.price * item.count
          if (item.count - max > 0) {
            max = item.count
          }
        })
      }
      return {
        arr: tmpArr,
        max: max
      }
    },
    initData(arr, index) {
      let depthData = arr
      if (depthData.length) {
        this.deepType = Math.pow(0.1, depthData[index].deepType).toFixed(depthData[index].deepType)
        let buy = this.changeArr(depthData[index].buy)
        this.buy = buy.arr
        this.buyMax = buy.max
        let sell = this.changeArr(depthData[index].sell)
        this.sell = sell.arr
        this.sellMax = sell.max
      }
    },
    selectDepth(command) {
      // console.log(command)
      let index = this.depthData.findIndex((item) => {
        return item.deepType === command
      })
      if (index === -1) {
        index = 0
      }
      this.initData(this.depthData, index)
    }
  }
}
</script>
<style lang="scss" scoped>
.new-price{
  width: 100%;
  height: 100%;
  background-color: $bg-content;
  padding: 0 10px;
  box-sizing: border-box;
  // min-height: 355px;
  .header{
    height: 36px;
    line-height: 36px;
    @include fontsize("content2");
    color: $font-color3;
    overflow: hidden;
    text-overflow: ellipsis;
    .price{
      color: $font-color6;
      margin: 0 5px 0 2px;
    }
    .iconfont{
      @include fontsize('content3');
    }
  }
  .content{
    overflow: hidden;
    overflow-x: hidden;
    .lists{
      .list{
        position: relative;
        width: 100%;
        @include fontsize('small');
        color: $font-color3;
        height: 24px;
        line-height: 24px;
        overflow: hidden;
        .name{
          width: 10%;
          display: block;
          float: left;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .price{
          display: block;
          width: 30%;
          float: left;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .amount{
          display: block;
          width: 28%;
          overflow: hidden;
          float: left;
          text-overflow: ellipsis;
        }
        .total{
          display: block;
          float: left;
          width: 30%;
          overflow: hidden;
          text-align: right;
          text-overflow: ellipsis;
        }
        .bac{
          position: absolute;
          display: block;
          // width: 50%;
          height: 100%;
          opacity: 0.1;
          right: 0;
        }
      }
      .head{
        height: 32px;
        line-height: 32px;
        span{
          height: 32px;
        }
      }
      .buy{
        // height: 120px;
        // height: 30%;
        overflow-y: auto;
        .name,.price{
          color: $font-color7;
        }
        .list{
          &:nth-of-type(2n){
            background-color: $line-color;
          }
        }
        .bac{
          background-color: $font-color7;
        }
      }
      .line{
        height: 9px;
      }
      .sell{
        // height: 120px;
        // height: 30%;
        overflow-y: auto;
        // &:hover{
        //   overflow-y: scroll;
        // }
        .name, .price{
          color: $font-color6;
        }
        .list{
          &:nth-of-type(2n){
            background-color: $line-color;
          }
        }
        .bac{
          background-color: $font-color6;
        }
      }
    }
    .more-box{
      @include fontsize("small");
      padding-top: 10px;
      color: $font-color3;
      display: flex;
      justify-content: space-between;
      overflow: hidden;
      text-overflow: ellipsis;
      .dropdown{
        margin-left: 20px;
      }
    }
  }
}
</style>


