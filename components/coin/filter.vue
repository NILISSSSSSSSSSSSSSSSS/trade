<template>
  <div class="filter-box">
    <div class="header border-bottom">
      <div class="currency-list">
        <div>
          <span class="currency" 
            :class="selectedCy === currency ? 'selectedCy' : ''" 
            v-for="(currency,index) in currencyZone " 
            :key="index"
            @click="selectItem(currency)" 
          >{{currency}}</span>
        </div>
        <!-- <span class="currency">ETH</span>
        <span class="currency">USDT</span> -->
        <div class="custom" @click.stop="collects">
          <i class="iconfont " :class="selectedCollect ? 'icon-shoucang iconYes' : 'icon-shoucang-no iconNo' " ></i>
          <em :class="selectedCy === 'collect' ? 'selectedCy' : '' ">自选</em>
        </div>
      </div>
      <div class="search-box">
        <div class="search-icon">
          <i class="el-icon-search search-icon"></i>
          <span class="bac"></span>
        </div>
        <input type="text" v-model="searchKey" @keyup="filterByKey" class="input">
      </div>
    </div>
    <div class="content">
      <div class="lists">
        <div class="list head border-bottom">
          <span class="coin">币种</span>
          <span class="price">最新价格</span>
          <span class="trend">24H涨跌</span>
          <span class="total">24H成交量</span>
          <span class="select">自选</span>
        </div>
        <div class="list-wraper">
          <div class="list border-bottom" :class="pairNameBefore === item.name ? 'selectedPair' : '' " v-for="(item, index) in priceArr" :key="index" @click="selectPair(item)">
            <span class="coin">
              <em>B</em>&nbsp;
              <i>{{item.name}}</i>
            </span>
            <!-- 0.01386 /￥1.19 -->
            <span class="price">{{item.price | currency(item.name)}} <em v-show="item.price && priceFiat({currency: item.name})">/￥{{priceFiat({currency: item.name}) | fiatCurrency(fiatCurrency)}}</em></span>
            <!-- up,down为+ -   的类名    +1.75%-->
            <span class="trend up" :class="item.rise >= 0 ? 'up' : 'down'" >{{rate(item.rise)}}</span> 
            <span class="total">{{item.vol | currency(item.name)}}</span>
            <span class="select" @click.stop="collect(item)">
              <i class="iconfont icon-shoucang iconYes" v-if="collectPairs.indexOf(item.pairName) > -1"></i>
              <i class="iconfont icon-shoucang-no iconNo" v-else></i>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { getPairPrice, configUserPair, getUserConfigPairs } from "@/apis/bbtrade";
import { mapActions, mapGetters } from 'vuex';
import computeFiatPrice from '@/mixins/coin_trade/computeFiatPrice.js';
import { getCookie } from '@/tools/cookie';

export default {
  mixins: [computeFiatPrice],
  data() {
    return {
      searchKey: '',
      token: '',
      collectPairs: [], // 自选的交易对(服务器)
      selectedCollect: false, // 控制自选图标
      collections: [], // 收藏的交易对(本地)
      currencyZone: [], // 为交易对基准的数字币
      selectedCy: '', // 选中的交易对基准数字币
      priceArr: [] // 交易对的详细数据
    }
  },
  computed: {
    // priceArr() {
    //   return this.pairPrice
    // },
    // ...mapGetters(['bbPairs', 'quotes', 'exchangeRate']),
    ...mapGetters('coin_trade', ['pairPrice'])
  },
  mounted() {
    this.token = getCookie('token')
    let pairName = this.$route.params.pairs
    if (pairName.indexOf("_") > -1) {
      this.selectedCy = pairName.split("_")[1]
    }
    // let bbCollection = localStorage.getItem('bbCollection')
    // bbCollection = bbCollection || '[]'
    // localStorage.setItem('bbCollection', bbCollection)
    this._getUserConfigPairs()
    this.initData()
  },
  watch: {
    pairPrice: {
      handler: function (newVal, old) {
        this.priceArr.forEach((item) => {
          let index = newVal.findIndex((list) => {
            return list.pairName === item.pairName
          })
          if (index > -1) {
            item = Object.assign(item, newVal[index])
          }
        })
        console.log(this.priceArr)
        // this.priceArr = newVal
        this.filterByKey() // 搜索条件过滤掉的一些
      },
      deep: true
    },
    collectPairs: {
      handler: function (newVal, old) {
        if (this.selectedCollect) {
          this.initPriceArr()
        }
      },
      deep: true
    }
  },
  methods: {
    filterByKey() {
      if (!this.searchKey) {
        return
      }
      let tmpArr = this.priceArr.filter((item) => {
        return item.pairName.includes(this.searchKey)
      })
      this.priceArr = tmpArr
    },
    // computedbbPrice(item) {
    //   let pairName = item.pairName
    //   let price = this.priceFiat({currency: pairName.split("_")[0]}) / this.priceFiat({currency: pairName.split("_")[1]})
    //   if (Number(price)) {
    //     return price
    //   }
    //   return item.price
    // },
    rate(rise) {
      let tmpRise = (rise * 100).toFixed(2) + '%'
      if (rise >= 0) {
        return `+${tmpRise}`
      } else {
        return tmpRise
      }
    },
    collects() {
      this.selectedCollect = true
      this.selectedCy = 'collect' // 代表选中自选
      // let pairs = localStorage.getItem('bbCollection') || '[]'
      // pairs = JSON.parse(pairs)
      // if (pairs.length > 0) {
      //   this._getPairPrice(pairs)
      // } else {
      //   this.priceArr = []
      // }
      if (!this.token) {
        this.$message.error('请先登录');
        return
      }
      // this._getUserConfigPairs()
      if (this.collectPairs.length) {
        this._getPairPrice(this.collectPairs)
      } else {
        this.priceArr = []
      }
    },
    collect(item) {
      if (!this.token) {
        this.$message.error('请先登录');
        return
      }
      let index = this.collectPairs.indexOf(item.pairName)
      let postObj = {
        pairName: item.pairName,
        marked: index === -1
      }
      configUserPair(postObj).then((res) => {
        if (res.success) {
          this._getUserConfigPairs()
        } else {
          // this.$message.error(res.message)
        }
      })
      // this.collection = !this.collection
      // let collections = localStorage.getItem('bbCollection') || '[]'
      // collections = JSON.parse(collections)
      // if (collections.length) {
      //   let index = collections.findIndex((pairName) => {
      //     return pairName === item.pairName
      //   })
      //   if (index > -1) {
      //     if (this.selectedCollect) {
      //       let priceIndex = this.priceArr.findIndex((list) => {
      //         return collections[index] === list.pairName
      //       })
      //       this.priceArr.splice(priceIndex, 1)
      //     }
      //     collections.splice(index, 1)
      //   } else {
      //     collections.push(item.pairName)
      //   }
      // } else {
      //   collections.push(item.pairName)
      // }
      // this.collections = collections
      // localStorage.setItem('bbCollection', JSON.stringify(this.collections))
    },
    initData() {
      let bbPairs = this.bbPairs
      let pairs = []
      if (bbPairs.length) {
        bbPairs.forEach((item) => {
          this.currencyZone.push(item.zone)
        })
        if (this.selectedCy) {
          pairs = this.findPairs(this.selectedCy)
          this._getPairPrice(pairs)
        } else {
          this.selectedCy = this.currencyZone[0]
          pairs = bbPairs[0].pairs
          this._getPairPrice(pairs)
        }
        this.initPriceArr(pairs)
      }
      // let collections = localStorage.getItem('bbCollection') || "[]"
      // collections = JSON.parse(collections)
      // if (collections.length) {
      //   this.collections = collections
      // } else {
      //   this.collections = []
      // }
    },
    initPriceArr(pairs = []) {
      let tmpArr = []
      pairs.forEach((item) => {
        let obj = {}
        obj.pairName = item
        obj.name = item.split("_")[0]
        obj.price = 0
        obj.rise = 0
        obj.vol = 0
        tmpArr.push(obj)
      })
      this.priceArr = tmpArr
    },
    _getPairPrice(pairs) {
      this.GET_PAIRPRICE(pairs)
      // let postObj = {
      //   time: new Date().toISOString(),
      //   pairs: pairs
      // }
      // getPairPrice(postObj).then((res) => {
      //   if (res.success) {
      //     this.priceArr = res.data || []
      //     this.priceArr.forEach((item) => {
      //       item.name = item.pairName.split("_")[0]
      //     })
      //   }
      // })
    },
    selectItem(currency) {
      this.searchKey = ''
      this.selectedCy = currency
      this.selectedCollect = false
      let index = this.bbPairs.findIndex((item) => {
        return item.zone === currency
      })
      let pairs = []
      if (index > -1) {
        pairs = this.bbPairs[index].pairs
      }
      this.initPriceArr(pairs)
      this._getPairPrice(pairs)
    },
    findPairs(currency) {
      let index = this.bbPairs.findIndex((item) => {
        return item.zone === currency
      })
      let pairs = []
      if (index > -1) {
        pairs = this.bbPairs[index].pairs
      }
      return pairs
    },
    selectPair(item) {
      let lang = this.$route.query.lang
      this.$router.push(`/coin_coin/${item.pairName}?lang=${lang}`)
    },
    async _getUserConfigPairs() {
      let res = await getUserConfigPairs()
      if (res.success) {
        this.collectPairs = res.data || []
      } else {
        // this.$message.error(res.message)
      }
    },
    ...mapActions(['GET_EXCHANGERATE']),
    ...mapActions('coin_trade', ['GET_PAIRPRICE'])
  }
}
</script>
<style lang="scss" scoped>
.filter-box{
  background-color: $bg-content;
  width: 100%;
  // max-height: 440px;
  // height: 440px;
  box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
  @include fontsize("content3");
  color: $font-color3;
  overflow-x: auto;
  .iconNo{
    font-size: 12px;
  }
  .iconYes{
    font-size: 14px;
    color: $font-color8;
  }
  .header{
    padding: 0 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 30px;
    line-height: 30px;
    .currency-list{
      display: flex;
      cursor: pointer;
      // align-items: center;
      .currency{
        margin-right: 20px;
      }
      .selectedCy{
        color: $font-color8;
      }
      .custom{
        display: flex;
        // align-items: center;
        i{
          margin-right: 3px;
        }
      }
    }
    .search-box{
      width: 150px;
      height: 24px;
      line-height: 24px;
      background-color: $line-color;
      display: flex;
      flex-direction: row-reverse;
      .input{
        border: none;
        outline: none;
        background-color: transparent;
        flex: 1;
        display: flex;
        min-width: 126px;
        padding-left: 5px;
        box-sizing: border-box;
      }
      .search-icon{
        width: 24px;
        // display: flex;
        // justify-content: center;
        // align-items: center;
        text-align: center;
        position: relative;
        .bac{
          display: block;
          width: 100%;
          height: 100%;
          position: absolute;
          left: 0;
          top: 0;
          background-color: $font-color4;
          opacity: 0.25;
        }
      }
    }
  }
  .content{
    // padding: 0 10px;
    .lists{
      .list{
        padding: 0 10px;
        cursor: pointer;
        position: relative;
        @include fontsize('small');
        color: $font-color3;
        height: 34px;
        line-height: 34px;
        overflow: hidden;
        .coin{
          width: 15%;
          display: block;
          float: left;
          overflow: hidden;
          word-break:break-all;
          text-overflow: ellipsis;
        }
        .price{
          display: block;
          width: 35%;
          float: left;
          overflow: hidden;
        }
        .trend{
          display: block;
          width: 15%;
          float: left;
          overflow: hidden;
        }
        .up{
          color: $font-color7;
        }
        .down{
          color: $font-color6;
        }
        .total{
          display: block;
          width: 25%;
          float: left;
          overflow: hidden;
        }
        .select{
          display: block;
          float: left;
          width: 10%;
          text-align: right;
          cursor: pointer;
        }
      }
      .list-wraper{
        .list{
          &:hover{
            background-color: $table-header-color;  
          }
        }
        .selectedPair{
          background-color: $table-header-color;
        }
      }
      .head{
        height: 24px;
        line-height: 24px;
      }
    }
  }
}
</style>


