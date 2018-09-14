<template>
  <div class="fund">
    <section class="border-bottom">
      <div class="convert">{{ $t('finance.property.fund.convert') }}：</div>
      <div class="totalMoney">{{ (totalMoney / currentExchangeRate).toFixed(2) }}{{ fiatCurrency }}</div>
      <div class="totalBTC">≈{{ (totalMoney / BTCExchangeRate) | currency(currency) }}{{ currency }}</div>
      <div class="tip">{{ $t('finance.property.fund.remark') }}</div>
    </section>
    <section>
      <h1 class="title">{{ $t('finance.property.fund.myproperty') }}
        <el-checkbox v-model="checked" class="check">{{ $t('finance.property.fund.showHas') }}</el-checkbox>
      </h1>
      <div class="tables">
        <el-table class="trade-table" :data="records" style="width: 100%"  
          @row-click="expandRow" 
          :row-key="setRowKey"
          :expand-row-keys="expands"
        >
          <el-table-column type="expand"  v-if="show" :key="Math.random()" >
            <template slot-scope="scope"> 
              <el-button @click='$i18n.push(`/finance/property/recharge?type=${scope.row.setting.currency}`)' type="error"  size="small" class="recharge" v-if="scope.row.setting.allowRecharge">{{ $t('finance.property.fund.recharge') }}</el-button>
              <el-button type="error" class="bg-gray" v-if="!scope.row.setting.allowRecharge" size="small">{{ $t('finance.property.fund.stopRecharge') }}</el-button>
              <el-button @click='$i18n.push(`/finance/property/withdraw?type=${scope.row.setting.currency}`)' v-if="scope.row.setting.allowWithdraw"  type="error" size="small" class="withdraw">{{ $t('finance.property.fund.withdraw') }}</el-button>
              <el-button type="error" class="bg-gray" v-if="!scope.row.setting.allowWithdraw" size="small">{{ $t('finance.property.fund.stopWithdraw') }}</el-button>
              <el-button type="error" size="small" class="trade" v-if="scope.row.setting.allowBBTrade">{{ $t('finance.property.fund.trade') }}</el-button>
              <el-button type="error" class="bg-gray" v-if="!scope.row.setting.allowBBTrade" size="small">{{ $t('finance.property.fund.stopTrade') }}</el-button>
            </template>     
          </el-table-column>
          <el-table-column prop="currency" :label="$t('common.currency')" width="100px"></el-table-column>
          <el-table-column prop="balance" :label="$t('common.count')" min-width="70px">
            <template slot-scope="scope"> 
              {{ scope.row.balance | currency(currency) }}
            </template> 
          </el-table-column>
          <el-table-column prop="freeze" :label="$t('finance.property.fund.frezze')">
            <template slot-scope="scope"> 
              {{ scope.row.freeze | currency(currency) }}
            </template> 
          </el-table-column>
          <el-table-column prop="lock" :label="$t('finance.property.fund.unlock')" v-if="!show">
            <template slot-scope="scope"> 
              {{ scope.row.lock | currency(currency) }}
            </template> 
          </el-table-column> 
          <el-table-column prop="availableBalance" :label="$t('finance.property.fund.canuse')" min-width="70px">
            <template slot-scope="scope"> 
              {{ scope.row.availableBalance | currency(currency) }}
            </template> 
          </el-table-column>
          <el-table-column prop="value" :label="$t('finance.property.fund.appraisement')">
            <template slot-scope="scope"> 
              {{ (scope.row.value / currentExchangeRate).toFixed(2) +fiatCurrency }}
            </template> 
          </el-table-column>
          <el-table-column
            :label="$t('common.opreation')"
            v-if="!show"
            align="left"
            width="230">
            <template slot-scope="scope">
              <el-button @click='$i18n.push(`/finance/property/recharge?type=${scope.row.setting.currency}`)' type="error"  size="small" class="recharge" v-if="scope.row.setting.allowRecharge">{{ $t('finance.property.fund.recharge') }}</el-button>
              <el-button type="error" class="bg-gray" v-if="!scope.row.setting.allowRecharge" size="small">{{ $t('finance.property.fund.stopRecharge') }}</el-button>
              <el-button @click='$i18n.push(`/finance/property/withdraw?type=${scope.row.setting.currency}`)' v-if="scope.row.setting.allowWithdraw"  type="error" size="small" class="withdraw">{{ $t('finance.property.fund.withdraw') }}</el-button>
              <el-button type="error" class="bg-gray" v-if="!scope.row.setting.allowWithdraw" size="small">{{ $t('finance.property.fund.stopWithdraw') }}</el-button>
              <el-button type="error" size="small" class="trade" v-if="scope.row.setting.allowBBTrade">{{ $t('finance.property.fund.trade') }}</el-button>
              <el-button type="error" class="bg-gray" v-if="!scope.row.setting.allowBBTrade" size="small">{{ $t('finance.property.fund.stopTrade') }}</el-button>
           </template>
          </el-table-column>
        </el-table>
        <el-pagination class="pagenation trade-pagination" background  @current-change="changePage" layout="prev, pager, next" :total="records.length" :pager-count="5">
        </el-pagination>
      </div>
    </section>
  </div>
</template>

<script>
import MyButton from '@/components/Button'
import { mapState, mapActions } from "vuex";
import { exchangeRate } from '@/apis/information'

export default {
  data () {
    return {
      fiatCurrency: 'CNY',
      currency: 'BTC',
      show: false,
      checked: false,
      totalMoney: '2,093.98',
      totalBTC: '0.0123',
      expands: [],
      account_asset_money: [],
      records: [],
      currentExchangeRate: '',
      BTCExchangeRate: ''
    }
  },
  components: {
    MyButton
  },
  methods: {
    ...mapActions('account', ['SET_ACCOUNT_ASSET']),
    async _exchangeRate(params) {
      exchangeRate('BTC').then(res => {
        if (res.success) {
          this.BTCExchangeRate = res.data.usdValue
        }
      })

      let res = await exchangeRate(params)
      if (res.success) {
        this.currentExchangeRate = res.data.usdValue
      }
    },
    setRowKey (row) {
      return row.currency
    },
    handleClick(type) {
      this.$route.push({path: "$i18n.path('./finance/property/fund/recharge')", query: {type: type}});
    },
    expandRow(row, event, column) {
      if (document.documentElement.clientWidth < 820) {
        let index = this.expands.indexOf(row.currency)
        if (index < 0) {
          this.expands = []
          this.expands.push(row.currency);
        } else {
          this.expands = []
        }
      }
    },
    changePage(page) {
      this.records.slice((page - 1) * 10, page * 10)
    }
  },
  computed: {
    ...mapState({
      lang: state => state.lang,
      common: state => state.common,
      account_asset: state => state.account.account_asset
    })
  },
  mounted () {
    this.SET_ACCOUNT_ASSET()
    if (this.lang.fiatCurrency) {
      this.fiatCurrency = this.lang.fiatCurrency
      this._exchangeRate(this.lang.fiatCurrency)
    }
    const that = this;
    if (document.documentElement.clientWidth < 820) {
      that.show = true
    }
    window.onresize = function temp() {
      that.clientWidth = document.documentElement.clientWidth;
      if (that.clientWidth < 820) {
        that.show = true
        return
      }
      that.show = false
    };
  },
  watch: {
    checked(val) {
      if (val) {
        this.records = this.account_asset_money
      } else {
        this.records = this.account_asset
      }
    },
    account_asset(val, old) {
      console.log('​account_asset -> val', val);
      this.records = val
      this.totalMoney = 0
      this.account_asset_money = []
      val.forEach(item => {
        this.totalMoney += Number(item.value)
        if (item.availableBalance > 0) {
          this.account_asset_money.push(item)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.fund{
  .convert{
    font-size: 14px;
    color: $font-color2;
    padding-bottom: 20px;
  }
  .totalMoney{
    font-size: 24px;
    color: $font-color2;
    padding-bottom: 20px;
  }
  .totalBTC{
    font-size: 14px;
    color: $font-color2;
    padding-bottom: 16px;
  }
  .tip{
    font-size: 12px;
    color: $font-color5;
    padding-bottom: 19px;
  }
  .title {
    font-size: 18px;
    margin-bottom: 15px;
    margin-top: 19px;
  }
  .tables {
    /deep/ .pagenation {
      text-align: right;
      margin-top: $space;
      @include phone{
        text-align: center;
      }
    }
  }
  .el-button{
    color: $font-color1;
    border: 0;
  }
  .recharge{
    background: $btn-red;
  }
  .withdraw{
    background: $btn-green;
  }
  .trade{
    background: $btn-blue;
  }
  .check{
    /deep/ .el-checkbox__label{
      font-size: 12px;
      color: $font-color5;
    }
    /deep/ .el-checkbox__input{
      height: 14px;
    }
    float: right;
  }
  /deep/ .el-table__expand-column{
    color: red;
  }
  /deep/ .el-table__expanded-cell{
    text-align: right;
    padding: $space;
  }
  /deep/ .cell{
    @include phone{
      padding: 2px;
    }
  }
  /deep/ .el-button--small, .el-button--small.is-round {
    width: 56px;
    padding: 8px 0px;
  }
  .bg-gray{
    background: $font-color5;
  }
}
</style>
