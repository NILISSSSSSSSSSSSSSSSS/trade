<template>
  <div class="trade-history-trade">
    <history-wrap
      :title="$t('finance.trade.historyC2c.title')"
      type="history"
      @tableDataChange="tableDataChange"
      icon="icon-weituojiaoyi">

    <el-table
      :data="tableData"
      style="width: 100%"
      class="trade-table">
      <el-table-column
        v-if="show"
        prop="adId"
        :label="$t('finance.trade.tradeId')">
      </el-table-column>
      <el-table-column
        :label="$t('finance.trade.time')">
        <template slot-scope="scope">
          {{ scope.row.createTime | formatDate }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('finance.trade.tradeType')">
        <template slot-scope="scope">
          <span class="font-color6" v-if="scope.row.tradeType == 'buy'">
            {{scope.row.tradeType | tradeType}}
          </span>
          <span class="font-color7" v-else>
            {{scope.row.tradeType | tradeType}}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('finance.trade.currencyType')">
        <template slot-scope="scope">
          {{ scope.row.currencyId }} /
          {{ scope.row.legalCurrency }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('finance.trade.price')">
        <template slot-scope="scope">
          {{ scope.row.unitPrice | fiatCurrency }}
        </template>
      </el-table-column>
      <el-table-column
        prop="tradeCurrencyAmount"
        :label="$t('finance.trade.number')">
        <template slot-scope="scope">
          {{ scope.row.tradeCurrencyAmount }}
          {{ scope.row.currencyDisplay }}
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('finance.trade.total')">
        <template slot-scope="scope">
          {{ scope.row.legalCurrencyAmount | fiatCurrency }}
        </template>
      </el-table-column>
      <el-table-column
        prop="orderStatus"
        :label="$t('finance.trade.orderStatus')">
        <template slot-scope="scope">
          {{ scope.row.orderStatus | orderStatus }}
        </template>
      </el-table-column>
      <el-table-column
        v-if="show"
        prop="adMasterPin"
        :label="$t('finance.trade.otherName')">
      </el-table-column>
      <el-table-column
        :label="$t('finance.trade.oprate')">
        <template slot-scope="scope">
          <span 
            class="operate font-color8"
             @click="$i18n.push(`/finance/feedback/addorderFeedback?order=${scope.row._id}`)">{{$t('finance.trade.appeal')}}</span>
        </template>
      </el-table-column>
    </el-table>

    </history-wrap>
  </div>
</template>

<script>
import HistoryWrap from "@/components/trade/historyWrap"

export default {
  data() {
    return {
      tableData: [],
      show: true
    }
  },
  computed: {},
  mounted() {
    const windowWidth = document.documentElement.clientWidth
    if (windowWidth <= 820) {
      this.show = false
    }
  },
  methods: {
    tableDataChange(tableData) {
      this.tableData = tableData
    }
  },
  components: {
    HistoryWrap
  }
}
</script>

<style lang="scss" scoped>
.trade-history-trade {
  .filter {
    margin-bottom: 16px;
  }
  .operate {
    cursor: pointer;
  }
}
</style>
