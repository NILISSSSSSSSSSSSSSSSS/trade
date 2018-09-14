<template>
<div class="withdraw-record">
  <FinanceTitle :title="$t('finance.recharge.withdrawalrecord.title')" icon="icon-tibijilu"></FinanceTitle>
  <div class="tables">
    <el-table class="trade-table" :data="records">
      <el-table-column prop="id" :label="$t('finance.recharge.withdrawalrecord.header.order')">
      </el-table-column>
      <el-table-column :label="$t('finance.recharge.withdrawalrecord.header.time')">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | formatDate }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="amount" :label="$t('finance.recharge.withdrawalrecord.header.amount')">
        <template slot-scope="scope">
          <span>{{scope.row.amount}}{{scope.row.currencyName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="money" :label="$t('finance.recharge.withdrawalrecord.header.feeAmount')">
        <template slot-scope="scope">
          <span>{{scope.row.feeAmount}}{{scope.row.feeName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="to" :label="$t('finance.recharge.withdrawalrecord.header.address')">
      </el-table-column>
      <el-table-column :label="$t('finance.recharge.withdrawalrecord.header.status')">
        <template slot-scope="scope">
          <span :class="statusColor(scope.row.withdrawStatus)">{{$t(`enum.withdrawStatus.${scope.row.withdrawStatus}`)}}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="trade-pagination" @current-change="getPage" v-if="pageCount > 0" :current-page.sync="curPage" background layout="prev, pager, next" :page-count='pageCount'>
    </el-pagination>
  </div>
</div>
</template>

<script>
import {
  withdrawRecords
} from '@/apis/finance/transaction'
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
      this.getPage()
    }
  },
  methods: {
    statusColor(status) {
      if (status !== '4') {
        return ''
      } else {
        return 'red'
      }
    },
    getPage() {
      const pageSize = 10;
      withdrawRecords(this.curPage, pageSize).then(res => {
        if (res.data) {
          this.records = res.data.list
          this.pageCount = (res.data.totalCount % pageSize > 0) ? (Math.floor(res.data.totalCount / pageSize) + 1) : (res.data.totalCount / pageSize);
        }
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.withdraw-record {
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
      color: $font-color6
    }
  }
}
</style>
