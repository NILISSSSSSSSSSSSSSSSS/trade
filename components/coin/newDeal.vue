<template>
  <div class="new-price">
    <div class="header border-bottom">
      <span class="deal-name">最新成交</span>
      <div class="price">
        <em class="high" v-if="!localFiatFlag" >最高价:{{max | currency(pairNameAfter)}}</em>
        <em class="high" v-if="localFiatFlag" >最高价:{{max | fiatCurrency(pairNameAfter)}}</em>
        <em class="low" v-if="!localFiatFlag" >最低价:{{min | currency(pairNameAfter)}}</em>
        <em class="low" v-if="localFiatFlag">最低价:{{min | fiatCurrency(pairNameAfter)}}</em>
      </div>
    </div>
    <div class="content">
      <div class="lists scrollbars">
        <div class="head list border-bottom">
          <span class="name">时间</span>
          <span class="price">成交价({{!localFiatFlag ? pairNameAfter : fiatCurrency}})</span>
          <span class="amount">成交量({{pairNameBefore}})</span>
          <span class="total">总计({{!localFiatFlag ? pairNameAfter : fiatCurrency}})</span>
        </div>
        <div class="list-wraper">
          <div class="list" v-for="(item, index) in deal" :key="index">
            <span class="name">{{item.createTime | timeCoin}}</span>
            <span class="price" v-if="!localFiatFlag">{{item.billPrice | currency(pairNameAfter)}}</span>
            <span class="price" v-if="localFiatFlag">{{priceFiat({price: item.billPrice, currency: pairNameAfter}) | fiatCurrency(fiatCurrency)}}</span>
            <span class="amount">{{item.billAmount | currency(pairNameBefore)}}</span>
            <span class="total" v-if="!localFiatFlag">{{item.billPrice * item.billAmount | currency(pairNameAfter)}}</span>
            <span class="total" v-if="localFiatFlag">{{priceFiat({currency: pairNameAfter, price: item.billPrice * item.billAmount}) | fiatCurrency(fiatCurrency)}}</span>
            <span class="bac"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import computeFiatPrice from '@/mixins/coin_trade/computeFiatPrice.js'

export default {
  mixins: [computeFiatPrice],
  data() {
    return {
      deal: [],
      max: 0,
      min: 0
    }
  },
  created() {
    // this.pairName = this.$route.params.pairs
  },
  props: {
    // dealData: {
    //   type: Array,
    //   default: function () {
    //     return []
    //   }
    // }
  },
  computed: {
    dealData() {
      return this.pairBills || []
    }
  },
  watch: {
    dealData: {
      handler: function(newVal, old) {
        this.deal = this.dealData
        if (this.deal.length) {
          this.min = this.deal[0].billPrice
          this.deal.forEach((item) => {
            if (item.billPrice >= this.max) {
              this.max = item.billPrice
            }
            if (item.billPrice < this.min) {
              this.min = item.billPrice
            }
          })
        }
      },
      deep: true
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
  // height: 430px;
  box-sizing: border-box;
  .header{
    height: 36px;
    line-height: 36px;
    @include fontsize("content2");
    display: flex;
    justify-content: space-between;
    color: $font-color3;
    overflow: hidden;
    .deal-name{
      min-width: 80px;
    }
    .price{
      color: $font-color6;
      margin: 0 5px 0 13px;
      @include fontsize('small');
      .low{
        margin-left: 20px;
      }
    }
  }
  .content{
    height: calc(100% - 56px);
    overflow: hidden;
    .lists{
      height: 100%;
      overflow: auto;
      .list{
        position: relative;
        @include fontsize('small');
        color: $font-color3;
        height: 24px;
        line-height: 24px;
        overflow:hidden;
        .name{
          width: 23%;
          display: block;
          float: left;
          overflow:hidden;
          text-overflow: ellipsis;
        }
        .price{
          display: block;
          width: 25%;
          float: left;
          // padding-left: 5%;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .amount{
          display: block;
          width: 30%;
          float: left;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .total{
          display: block;
          float: left;
          width: 20%;
          text-align: right;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      .list-wraper{
        .list{
          &:nth-of-type(2n){
            background-color: $line-color;
          }
        }
      }
      .head{
        height: 32px;
        line-height: 32px;
        overflow: hidden;
      }
    }
  }
}
</style>
<style lang="scss">
// .scrollbars{
//   &::-webkit-scrollbar-button {
//     display: none;
//   }
//   &::-webkit-scrollbar {
//     width: 6px;
//     height: 100%;
//     border-radius: 4px;
//     // background-color: #f00;
//   }
//   &::-webkit-scrollbar-thumb {
//     // height: 40px;
//     background-color: #a5a5a5;
//     border-radius: 4px;
//   }
//   &::-webkit-scrollbar-track-piece {
//     background: #eee;
//   }
//   &::-webkit-scrollbar-corner{
//     border-radius: 4px;
//   }
//   &::-webkit-scrollbar-track{
//     border-radius: 4px;
//   }
// }
</style>



