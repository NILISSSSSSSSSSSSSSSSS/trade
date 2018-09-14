<template>
<div class="recharge-record">
  <FinanceTitle :title="$t('finance.recharge.rechargerecord.title')" icon="icon-chongzhijilu"></FinanceTitle>
  <div class="tables">
    <el-table class="trade-table" :data="records">
      <el-table-column prop="id" :label="$t('finance.recharge.rechargerecord.header.order')">
      </el-table-column>
      <el-table-column :label="$t('finance.recharge.rechargerecord.header.time')">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | formatDate}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="amount" :label="$t('finance.recharge.rechargerecord.header.amount')">
        <template slot-scope="scope">
          <span>{{scope.row.amount}}{{scope.row.currencyName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="from" :label="$t('finance.recharge.rechargerecord.header.address')">
      </el-table-column>
      <el-table-column :label="$t('finance.recharge.rechargerecord.header.status')">
        <template slot-scope="scope">
          <span :class="statusColor(scope.row.withdrawStatus)" >{{$t(`enum.depositsStatus.${scope.row.depositsStatus}`)}}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="trade-pagination" @current-change="getPage" v-if="pageCount>0" :current-page.sync="curPage"  background layout="prev, pager, next" :page-count='pageCount'>
    </el-pagination>
  </div>
</div>
</template>

<script>
import { depositRecords } from "@/apis/finance/transaction.js";
import FinanceTitle from "@/components/FinanceTitle";
export default {
  components: {
    FinanceTitle
  },
  data() {
    return {
      records: [],
      pageCount: 0,
      curPage: 1
    };
  },
  created() {
    if (!process.server) {
      this.getPage();
    }
  },
  methods: {
    statusColor(status) {
      if (status !== '3') {
        return ''
      } else {
        return 'red'
      }
    },
    getPage() {
      const pageSize = 20;
      depositRecords(this.curPage - 1, pageSize).then(res => {
        if (res.data) {
          this.records = res.data.list;
          let totalCount = res.data.totalCount;
          this.pageCount =
            totalCount % pageSize > 0
              ? Math.floor(totalCount / pageSize) + 1
              : totalCount / pageSize;
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.recharge-record {
  .title {
    @include fontsize("title2");
    margin-bottom: $space;
  }
  .tables {
    .pagenation {
      margin-top: 10px;
      float: right;
      max-width: 100%;
      overflow-x: auto;
    }
    .red {
      color: $font-color6;
    }
  }
}
</style>
