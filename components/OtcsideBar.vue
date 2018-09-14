<template>
  <div class="otc-side-bar">
    <div class="pc">
      <div class="header " >
        <div class="fiat">法币</div>
        <el-select v-model="fiatCurrency" placeholder="请选择" @change="changeFiat" class="select">
          <el-option
            v-for="item in common.legalCoins"
            :key="item"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
      </div>
      <div class="item title border-bottom">
        <div class="name">币种</div>
        <div class="val">价格</div>
      </div>
      <section class="items">
        <div class="item border-bottom" :class="selected == list.currencyId ? 'selected' : '' " v-for="(list,index) in quotes" :key="index" @click="changeCurrency(list.currencyId)">
          <div class="name">
            <i class="icon">{{list.icon}}</i>
            <em class="currency">{{list.currencyId}}</em>
          </div>
          <div class="val" :class="(list.currentPrice > list.prePrice) ? 'raise' : 'decline'">
            <i class="price">{{list.currentPrice | fiatCurrency}}</i>
            <em class="arrow">{{(list.currentPrice > list.prePrice) ? '↑' : '↓'}}</em>
          </div>
        </div>
      </section>
    </div>
    <div class="phone">
      <div class="header" >
        <div class="fiat">法币</div>
        <el-select v-model="fiatCurrency" placeholder="请选择" @change="changeFiat" class="select">
          <el-option
            v-for="item in common.legalCoins"
            :key="item"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>
      </div>
      <div class="header" >
        <div class="fiat">数字币</div>
        <el-select v-model="currency" placeholder="请选择" @change="changeFiat" class="select">
          <el-option
            v-for="item in quotes"
            :key="item.currencyId"
            :label="item.currencyId"
            :value="item.currencyId"
          >
          </el-option>
        </el-select>
      </div>
    </div>
  </div>
</template>
<script>
import {mapState, mapActions} from 'vuex'
  export default {
    props: {
      currencyCombine: Object,
      routeName: String
    },
    watch: {
      currencyCombine: {
        handler (val) {
          this.currency = val.currency
          this.fiatCurrency = val.fiatCurrency
          this.selected = val.currency
          this.GET_QUOTES(this.$store.state.common.currencies)
          // this.GET_QUOTES(this.fiatCurrency)
        },
        deep: true,
        immediate: true
      }
    },
    fetch({store, params}) {

    },
    data () {
      return {
        selected: "",
        fiatCurrency: '',
        currency: ''
      }
    },
    computed: {
      ...mapState({
        common: state => state.common,
        quotes: state => state.quotes
      })
    },
    methods: {
      ...mapActions(["GET_QUOTES"]),
      changeFiat (val) {
        // console.log(val)
        this.push()
      },
      changeCurrency (item) {
        this.currency = item
        // console.log(item)
        this.push()
      },
      push () {
        this.$router.push(`/${this.routeName}/${this.currency}_${this.fiatCurrency}?lang=${this.$i18n.locale}`)
      }
    },
    mounted() {
    }
  }
</script>
<style lang="scss" scoped>
.otc-side-bar{
  width: 100%;
  margin-top: 40px;
  @include pc{
    .phone{
      display: none;
    }
  }
  @include pad{
    .phone{
      display: none;
    }
  }
  @include phone{
    .pc{
      display: none;
    }
    .phone{
      display: flex;
      justify-content: space-between;
      .header{
        flex: 1;
        &:nth-of-type(1){
          margin-right: 10px;
        }
      }
    }
  }
  .header{
    display: flex;
    .fiat{
      // background: $font-color5;
      background: $line-color;
      @include fontsize("content3");
      height: 32px;
      line-height: 32px;
      width: 40%;
      text-align: center;
    }
    .select{
      flex: 1;
      height: 32px;
      // @include fontsize("content3");
      // color: $primary;
    }
  }
  .item{
    display: flex;
    padding: 0 5px;
    justify-content: space-between;
    height: 34px;
    line-height: 34px;
    @include fontsize("small");
    cursor: pointer;
    .name{
      color: $font-color2;
      .icon{
        display: inline-block;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        margin-right: 3px;
      }
    }
    .val{
      @include fontsize("small");
      .price{
        margin-right: 3px;
      }
      .arrow{
        font-weight: 700;
      }
    }
    .raise{
      color: $font-color6;
    }
    .decline{
      color: $font-color7;
    }
  }
  .selected{
    background-color: $line-color;
  }
}
</style>
<style lang="scss" >
.otc-side-bar{
  .el-input__inner{
    height: 32px;
    line-height: 32px;
    color: $primary;
    @include fontsize("content3");
  }
}
</style>


