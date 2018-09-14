<template>
  <div class="trade-history-trade">

    <FinanceTitle 
      :title="$t('finance.trade.historybb.title')" 
      class="filter"
      :icon="'icon-weituojiaoyi'"
    ></FinanceTitle>

    <!--  <filter-title 
      :title="'币币交易委托记录'" 
      class="filter"
      @query="_queryParams"
      :icon="icon-weituojiaoyi"></filter-title>
      :filterA="{ name: '类型', values: tradeType }"
      :filterB="{ name: '状态', values: orderStatus }" -->

      <el-table
        style="width: 100%"
        class="table scrollbars trade-table"
        :data="tableData"
        >
        <!-- <TableEmpty slot="empty"></TableEmpty> -->
        <el-table-column
          prop="createTime"
          :label="$t('finance.trade.historybb.time')"
          >
          <template slot-scope="scope">
            {{scope.row.createTime | formatDate}}
          </template>
        </el-table-column>
        <el-table-column
          prop="pairName"
          :label="$t('finance.trade.historybb.pair')">
        </el-table-column>
        <el-table-column
          prop="type"
          :label="$t('finance.trade.historybb.direction')">
          <template slot-scope="scope">
            {{scope.row.type === 'BUY' ? $t('common.buy') : $t('common.sell')}}
          </template>
        </el-table-column>
        <el-table-column
          prop="billPrice"
          :label="$t('finance.trade.historybb.price')">
          <template slot-scope="scope">
            {{scope.row.billPrice | currency(scope.row.pairName.split("_")[1])}}{{scope.row.pairName.split("_")[1]}}
          </template>
        </el-table-column>
        <el-table-column
          prop="billAmount"
          :label="$t('finance.trade.historybb.amount')"
          width="70">
        </el-table-column>
        <el-table-column
          :label="$t('finance.trade.historybb.total')"
          align="right">
          <template slot-scope="scope">
            {{(scope.row.billAmount * scope.row.billPrice) | currency(scope.row.pairName.split("_")[1])}}{{scope.row.pairName.split("_")[1]}}
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        background
        class="pagenation trade-pagination"
        layout="prev, pager, next"
        :current-change.sync="page.pageIndex"
        :page-size="page.pageSize"
        :total="page.total"
        @current-change="changePageIndex">
    </el-pagination>
  </div>
</template>

<script>
import HistoryWrap from "@/components/trade/historyWrap";
import FinanceTitle from "@/components/FinanceTitle";
import { bbEntrustHistory } from "@/apis/bbtrade";

export default {
  data() {
    return {
      tableData: [],
      show: true,
      page: {
        pageSize: 10,
        pageIndex: 0,
        total: 0
      }
    };
  },
  computed: {},
  beforeMount() {
    this._bbEntrustHistory()
  },
  mounted() {
    const windowWidth = document.documentElement.clientWidth;
    if (windowWidth <= 820) {
      this.show = false;
    }
  },
  methods: {
    // tableDataChange(tableData) {
    //   console.log(tableData);
    //   this.tableData = tableData;
    // },
    _bbEntrustHistory() {
      let postObj = {
        page: this.page.pageIndex,
        pageCount: this.page.pageSize
      }
      bbEntrustHistory(postObj).then((res) => {
        if (res.success) {
          // this.$message.success
          this.tableData = res.data.list || []
          this.page.total = res.data.totalCount || 0
        } else {
          this.$message.error(res.message)
        }
      })
    },
    changePageIndex(pageIndex) {
      // console.log(pageIndex)
      this.page.pageIndex = pageIndex - 1
      this._bbEntrustHistory()
    }
  },
  components: {
    FinanceTitle,
    HistoryWrap
  }
};
</script>

<style lang="scss" scoped>
.trade-history-trade {
  .filter {
    margin-bottom: 16px;
  }
  .buy {
    color: $font-color6;
  }
  .sell {
    color: $font-color7;
  }
  .operate {
    cursor: pointer;
    color: $font-color8;
  }
}

</style>
