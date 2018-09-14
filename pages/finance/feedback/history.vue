<template>
<div class="feedback-history-record">
  <div class="title">{{$t('finance.feedback.history.title')}}</div>
  <div class="tables">
    <!--PC端口-->
    <el-table class="trade-table" :data="records" v-if="osType!='phone'">
      <el-table-column prop="orderId" :label="$t('finance.feedback.history.header.order')">
      </el-table-column>
      <el-table-column :label="$t('finance.feedback.history.header.createTime')">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | formatDate}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('finance.feedback.history.header.appealType')">
        <template slot-scope="scope">
          <span>{{$t(`enum.appealType.${scope.row.appealType}`)}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('finance.feedback.history.header.appealStatus')">
        <template slot-scope="scope">
          <span>{{$t(`enum.appealStatus.${scope.row.appealStatus}`)}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('finance.feedback.history.header.opt')" align="left" class-name="optBtn">
        <template slot-scope="scope">
          <el-button @click='$i18n.push(`/finance/feedback/detail?order=${scope.row.orderId}`)' type="primary" size="small" class="show">{{$t('finance.feedback.history.show')}}</el-button>
          <el-button type="error" v-if="scope.row.appealStatus==='processing'" size="small" @click="voidFeedback(scope.row.orderId)" class="void">{{$t('finance.feedback.history.void')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--移動端-->
    <el-table class="trade-table" :data="records" v-else>
      <el-table-column label="" type="expand">
        <template slot-scope="scope">
          <el-button @click='$i18n.push(`/finance/feedback/detail?order=${scope.row.orderId}`)' type="primary" size="small" class="show">{{$t('finance.feedback.history.show')}}</el-button>
          <el-button type="error" v-if="scope.row.appealStatus==='processing'" size="small" @click="voidFeedback(scope.row.orderId)" class="void">{{$t('finance.feedback.history.void')}}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="orderId" :label="$t('finance.feedback.history.header.order')">
      </el-table-column>
      <el-table-column :label="$t('finance.feedback.history.header.createTime')">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | formatDate}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('finance.feedback.history.header.appealType')">
        <template slot-scope="scope">
          <span>{{$t(`enum.appealType.${scope.row.appealType}`)}}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('finance.feedback.history.header.appealStatus')">
        <template slot-scope="scope">
          <span>{{$t(`enum.appealStatus.${scope.row.appealStatus}`)}}</span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="pagenation" v-model="curPage" :total="total" v-if="total>0" :page-size="pagSize" background layout="prev, pager, next">
    </el-pagination>
  </div>
</div>
</template>

<script>
import {
  getAppeals,
  appealCancel
} from "@/apis/finance/feedback";

export default {
  data() {
    return {
      records: [],
      pageCount: 0,
      curPage: 1,
      pagSize: 20,
      total: 0,
      osType: "pc"
    };
  },
  created() {
    if (process.client) {
      if (this.os) {
        if (this.os.phone) {
          this.osType = "phone";
        }
      }
      this.getPage()
    }
  },
  methods: {
    voidFeedback(orderId) {
      appealCancel(orderId).then(res => {
        if (res.success) {
          this.records.find(x => x.orderId === orderId).appealStatus = 'cancel'
          this.$message.success(this.$t('finance.feedback.history.cancel_success'))
        } else {
          this.$message.error(res.message)
        }
      })
    },
    getPage() {
      getAppeals(this.curPage - 1, this.pagSize).then(res => {
        if (res.data) {
          if (res.data.total > 0) {
            this.total = res.data.total
            this.records = res.data.list
          }
        }
      })
    }
  },
  watch: {
    curPage() {
      this.getPage();
    }
  }
};
</script>

<style lang="scss">
.feedback-history-record {
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
    /deep/ .optBtn {
      text-align: left !important;
    }
  }
}
</style>
