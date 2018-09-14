<template>
  <div class="trade-adver">
    <div class="table-1">
      <adver-title
        class="adver-title"
        :title="$t('finance.trade.myAdver.title')"
        icon="icon-wodeguanggao">
        <my-button
          @click="$i18n.push(`/publish/BTC_CNY`)"
          :text="$t('finance.trade.myAdver.publish')"></my-button>
      </adver-title>
      <el-table
        :data="tableData"
        style="width: 100%"
        class="trade-table">
        <el-table-column
          :label="$t('finance.trade.pubTime')">
          <template slot-scope="scope">
            {{ scope.row.createTime | formatDate }}
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('finance.trade.overTime')">
          <template slot-scope="scope">
            {{ scope.row.expireTime | formatDate }}
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
          prop="limitPrice"
          :label="$t('finance.trade.tradePrice')">
          <template slot-scope="scope">
            {{ scope.row.unitPriceUSD | fiatCurrency }}
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('finance.trade.tradeLimit')">
          <template slot-scope="scope">
            {{ scope.row.countMinLimit | currency(scope.row.currencyId) }}
             ~ 
            {{ scope.row.countMaxLimit | currency(scope.row.currencyId) }}
            {{ scope.row.currencyId }}
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('finance.trade.amount')">
          <template slot-scope="scope">
            {{ scope.row.count | currency(scope.row.currencyId) }}
            {{ scope.row.currencyId }}
          </template>
        </el-table-column>
        <el-table-column
          prop="allowPay"
          :label="$t('finance.trade.payType')">
          <template slot-scope="scope">
            <div
              v-for="(item, i) in scope.row.payWay"
              :key="i">
              <span v-if="item">{{ item }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('finance.trade.oprate')">
          <template slot-scope="scope">
            <el-button 
              size="small"
              type="success"
              @click="_adUnpub({id: scope.row.id, status: Down})">
              {{ $t('finance.trade.down') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        class="pagenation trade-pagination"
        @current-change="tableChange"
        :pager-count="5"
        layout="prev, pager, next"
        :page-size="tableQuery.pageSize"
        :total="tableCount">
      </el-pagination>
    </div>

    <div class="table-2">
      <adver-title
        class="exceed"
        :title="$t('finance.trade.downed')"
        icon="">
          <span class="delete font-color6" @click="deleteAll">
            <i class="el-icon-delete"></i>
            {{ $t('finance.trade.deleteAll') }}
          </span>
      </adver-title>
      <el-table
        :data="tableData2"
        style="width: 100%"
        class="trade-table"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="expand"
          v-if="smallScreen" 
          :key="Math.random() + 1"
          width="40">
          <template slot-scope="scope">
            <el-button 
              @click="$i18n.push(`/publish/${scope.row.currencyId}_${scope.row.legalCurrency}?id=${scope.row.id}`)"
              size="small"
              type="primary">{{ $t('finance.trade.up') }}</el-button>
            <el-button 
              size="small"
              @click="handleDelete(scope.row.id)"
              type="danger">{{ $t('finance.trade.delete') }}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          type="selection"
          width="55">
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
          prop="limitPrice"
          :label="$t('finance.trade.tradePrice')">
          <template slot-scope="scope">
            {{ scope.row.unitPriceUSD | fiatCurrency }}
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('finance.trade.tradeLimit')">
          <template slot-scope="scope">
            {{ scope.row.countMinLimit | currency(scope.row.currencyId) }}
             ~ 
            {{ scope.row.countMaxLimit | currency(scope.row.currencyId) }}
            {{ scope.row.currencyId }}
          </template>
        </el-table-column>
        <el-table-column
          prop="currencyAmount"
          :label="$t('finance.trade.amount')">
          <template slot-scope="scope">
            {{ scope.row.count | currency(scope.row.currencyId) }}
            {{ scope.row.currencyId }}
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('finance.trade.payType')">
          <template slot-scope="scope">
            <div
              v-for="(item, i) in scope.row.payWay"
              :key="i">
              <span v-if="item">{{ item }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          v-if="!smallScreen"
          width="180"
          :key="Math.random()"
          :label="$t('finance.trade.oprate')">
          <template slot-scope="scope">
            <el-button 
              @click="$i18n.push(`/publish/${scope.row.currencyId}_${scope.row.legalCurrency}?id=${scope.row.id}`)"
              size="small"
              type="primary">{{$t('finance.trade.up')}}</el-button>
            <el-button 
              size="small"
              type="danger"
              @click="handleDelete(scope.row.id)">{{$t('finance.trade.delete')}}</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        background
        class="pagenation trade-pagination"
        @current-change="table2Change"
        :pager-count="5"
        layout="prev, pager, next"
        :page-size="table2Query.pageSize"
        :total="tableCount2">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import AdverTitle from "@/components/trade/adverTitle"
import MyButton from "@/components/Button"
import { mapActions, mapGetters } from "vuex"
import { adQuery, adCancel, adUnpub, adCancelAll } from "@/apis/adver.js"

const Down = "offline"
const Del = "delete"

export default {
  data() {
    return {
      tableData: [],
      tableData2: [],
      tableQuery: {
        pageNumber: 1,
        pageSize: 5
      },
      table2Query: {
        pageNumber: 1,
        pageSize: 5
      },
      tableCount: 0,
      tableCount2: 0,
      smallScreen: false,
      deleteArr: []
    }
  },
  created() {
    this.Down = Down
    this.Del = Del
  },
  mounted() {
    const w = this.utils.getWindowW()
    if (w < 1000) {
      this.smallScreen = true
    }
    this.updataData()
  },
  methods: {
    // 操作后更新数据
    updataData() {
      this._adQuery({
        status: "online",
        type: 1
      })
      this._adQuery({
        status: "offline",
        type: 2
      })
    },
    tableChange(page) {
      this.tableQuery = Object.assign({}, this.tableQuery, {
        pageNumber: page
      })
      this._adQuery({
        status: "online",
        type: 1
      })
    },
    table2Change(page) {
      this.table2Query = Object.assign({}, this.table2Query, {
        pageNumber: page
      })
      this._adQuery({
        status: "offline",
        type: 2
      })
    },
    handleSelectionChange(arr) {
      this.deleteArr = arr.map(item => {
        return item.id
      })
    },
    // 删除弹框
    deleteAlert() {
      return this.$confirm(
        this.$t("finance.trade.myAdver.confirm"),
        this.$t("finance.trade.myAdver.hint"),
        {
          confirmButtonText: this.$t("common.confirm"),
          cancelButtonText: this.$t("common.cancel"),
          type: "warning",
          customClass: "prompt-msgbox",
          confirmButtonClass: "confirmButtonClass",
          cancelButtonClass: "cancelButtonClass"
        }
      )
    },
    handleDelete(id) {
      this.deleteAlert()
        .then(() => {
          this._adCancle({ id, status: this.Del })
        })
        .catch(() => {})
    },
    // 广告删除
    async _adCancle({ id, status }) {
      const resData = await adCancel({ id, status })
      if (resData.success) {
        this.updataData()
        this.$message.success(this.$t("finance.trade.myAdver.success1"))
      }
    },
    // 广告下架
    async _adUnpub({ id, status }) {
      const resData = await adUnpub({ id, status })
      if (resData.success) {
        this.updataData()
        this.$message.success(this.$t("finance.trade.myAdver.success2"))
      }
    },
    // 广告查询
    async _adQuery({ status, type }) {
      let page = 1
      let limit = 5
      if (type === 1) {
        page = this.tableQuery.pageNumber
        limit = this.tableQuery.pageSize
      } else {
        page = this.table2Query.pageNumber
        limit = this.table2Query.pageSize
      }
      const resData = await adQuery({ status, page, limit })
      if (resData.success) {
        const data = resData.data
        if (type === 1) {
          this.tableData = data.list
          this.tableCount = data.total
        } else {
          this.tableData2 = data.list
          this.tableCount2 = data.total
        }
      }
    },
    // 批量删除
    async deleteAll() {
      this.deleteAlert().then(async () => {
        const resData = await adCancelAll(this.deleteArr)
        if (resData.success) {
          this.updataData()
          this.$message.success("删除成功")
        }
      })
    }
  },
  components: {
    AdverTitle,
    MyButton
  }
}
</script>

<style lang="scss" scoped>
.trade-adver {
  .adver-title {
    margin-bottom: 16px;
  }
  .filter {
    margin-bottom: 16px;
  }
  .exceed {
    .delete {
      @include fontsize("content3");
      cursor: pointer;
    }
  }
  .table-2 {
    margin-top: 16px;
  }
}
</style>
