<template>
  <div class="trade-history-trade">
    <filter-title 
      :title="title" 
      class="filter"
      :filterA="{ name: '类型', values: tradeType }"
      :filterB="{ name: '状态', values: orderStatus }"
      @query="_queryParams"
      :icon="icon"></filter-title>

    <slot></slot>

    <el-pagination
      background
      class="pagenation trade-pagination"
      layout="prev, pager, next"
      @current-change="tableChange"
      :pager-count="5"
      :page-size="pageSize"
      :total="totalNumber">
    </el-pagination>
  </div>
</template>

<script>
import FilterTitle from "@/components/FilterTitle";
import { userOrders } from "@/apis/order";
import { mapActions, mapGetters } from "vuex";

export default {
  props: {
    title: String,
    type: String,
    icon: String
  },
  data() {
    return {
      tableData: [],
      pageSize: 10,
      pageNumber: 1,
      queryParams: {},
      tradeType: ["buy", "sell"],
      orderStatus: [
        "init",
        "waitCoin",
        "waitPay",
        "success",
        "expire",
        "cancel"
      ]
    };
  },
  computed: {
    ...mapGetters("order", ["history", "otc"]),
    ...mapGetters("account", ["biz_types", "orderEnum"]),
    totalNumber() {
      if (this.type === "history") {
        return this.history.total;
      } else if (this.type === "otc") {
        return this.otc.total;
      }
      return 0;
    }
  },
  mounted() {
    this._userOrders({});
  },
  watch: {
    history(val) {
      if (this.type === "history") {
        this.tableData = this.history.datas;
        this.changeTableData();
      }
    },
    otc(val) {
      if (this.type === "otc") {
        this.tableData = this.otc.datas;
        this.changeTableData();
      }
    },
    pageNumber: {
      handler(val) {
        this._userOrders({});
      }
    }
  },
  methods: {
    ...mapActions("order", ["SET_HistoryData", "SET_OtcData"]),
    async _userOrders(params) {
      const type = this.type === "history" ? "SET_HistoryData" : "SET_OtcData";

      this[type](
        Object.assign(
          params,
          {
            limit: this.pageSize,
            page: this.pageNumber
          },
          this.queryParams
        )
      );
    },
    tableChange(page) {
      this.pageNumber = page;
    },
    _queryParams(params) {
      this.queryParams.orderStatus = params.status;
      this.queryParams.tradeType = params.type;
      this.queryParams.startDate = params.startTime;
      this.queryParams.endDate = params.endTime;

      this._userOrders({});
    },
    changeTableData() {
      this.$emit("tableDataChange", this.tableData);
    }
  },
  components: {
    FilterTitle
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
    color: $font-color8;
  }
}
</style>
