<template>
  <div class="detail">
    <filter-title :title="$t('finance.property.detail.title')" icon="icon-jiaoyijilu" :filterA="filterA" :filterB="filterB" @query="filter"></filter-title>
    <div class="tables">
      <el-table class="trade-table" :data="records" style="width: 100%">
        <el-table-column prop="bizId" :label="$t('common.orderCode')" class="id" v-if='show' :key="Math.random()">
        </el-table-column>
        <el-table-column :label="$t('common.time')">
          <template slot-scope="scope">
            <div>{{ scope.row.createTime | formatDate }}</div>
            {{ scope.row.createTime | getDateDiff }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.opreationType')">
          <template slot-scope="scope">
            {{ scope.row.bizType | enumBizType }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.amount')">
          <template slot-scope="scope">
            <span v-if="scope.row.changeBalance >= 0" class="font-red">
              {{ scope.row.changeBalance | currency(scope.row.currency) }}
            </span>
            <span v-if="scope.row.changeBalance < 0" class="font-green">
              {{ scope.row.changeBalance | currency(scope.row.currency) }}
            </span>
            {{ scope.row.currency }}
          </template>
        </el-table-column>
        <el-table-column :label="$t('common.accountAll')">
          <template slot-scope="scope">
            {{ scope.row.afterBalance | currency(scope.row.currency) }} {{ scope.row.currency }}
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="pagenation trade-pagination" background layout="prev, pager, next" :total="total" :pager-count="5" :v-bind="total"
        @current-change="changePage" :current-page="tableQuery.page" :page-size="tableQuery.limit"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import FilterTitle from "@/components/FilterTitle";
import { accountJournal } from "@/apis/account";
import { mapState, mapActions } from "vuex";

export default {
  data () {
    return {
      show: true,
      clientWidth: 0,
      records: [],
      filterA: {
        name: "币种",
        values: ["BTC", "USDT", "ETH"]
      },
      filterB: {
        name: "类型",
        values: ["_trade_in", "_trade_out", "C2C用户下单"]
      },
      total: 1,
      tableQuery: {
        page: 1,
        limit: 10
      }
    }
  },
  components: {
    FilterTitle
  },
  computed: {
    ...mapState({
      common: state => state.common,
      biz_types: state => state.account.biz_types
    })
  },
  mounted () {
    const that = this;
    if (document.documentElement.clientWidth < 820) {
      that.show = false
      return
    }
    window.onresize = function temp() {
      that.clientWidth = document.documentElement.clientWidth;
      if (that.clientWidth < 820) {
        that.show = false
        return
      }
      that.show = true
    };
  },
  methods: {
    ...mapActions('account', ['SET_BIZ_TYPES']),
    async _accountJournal(params) {
      const res = await accountJournal(params);
      if (res.success) {
        this.records = res.data.list
        this.total = res.data.total
      }
    },
    filter(filter) {
      console.log(filter)
      this.tableQuery = Object.assign({}, this.tableQuery, {
        page: 1,
        bizType: filter.status,
        currency: filter.type,
        startTime: filter.startTime,
        endTime: filter.endTime
      })
      this._accountJournal(this.tableQuery)
    },
    changePage(page) {
      this.tableQuery = Object.assign({}, this.tableQuery, {
        page: page
      })
      this._accountJournal(this.tableQuery)
    }
  },
  created () {
    this.SET_BIZ_TYPES()
    this._accountJournal(this.tableQuery)
  },
  watch: {
    common(val) {
      this.filterA.values = val.currencyList
    },
    biz_types(val) {
      this.filterB.values = val
    }
  }
};
</script>

<style lang="scss" scoped>
  .title {
    @include fontsize("title2");
    margin-bottom: $space;
  }
  .tables {
    padding-top: 15px;
    // /deep/ .pagenation {
    //   text-align: right;
    //   margin-top: $space;
    //   @include phone{
    //     text-align: center;
    //   }
    // }
  }
  .id{
    @include phone{
      display: none;
    }
  }
</style>
