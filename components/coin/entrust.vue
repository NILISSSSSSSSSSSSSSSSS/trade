<template>
  <div class="entrust">
    <div class="header border-bottom">
      <ul class="head-left">
        <li :class="selected === item.val ? 'selected' : '' " v-for="(item , index) in headList" :key="index" @click="selectedStatus(item.val)">{{item.name}}</li>
        <!-- <li></li> -->
        <!-- <nuxt-link :to="$i18n.path('/finance/property/fund')" tag="li">我的资金</nuxt-link> -->
      </ul>
      <div class="look-all" v-if="selected === 'normal'">
        <el-dropdown @command="selectTypes" trigger="click">
          <span class="el-dropdown-link">
            {{queryTypeText}}<i class="el-icon-caret-bottom el-icon--right"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="(item, i) in options" :key="i" :command="item.value" >{{item.label}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <div class="content" >
      <el-table
        v-show="selected === 'normal'"
        style="width: 100%"
        class="table scrollbars"
        :data="tableData"
        >
        <TableEmpty slot="empty" />
        <el-table-column
          prop="createTime"
          label="委托时间"
          >
          <template slot-scope="scope">
            {{scope.row.createTime | formatDate}}
          </template>
        </el-table-column>
        <el-table-column
          prop="pairName"
          label="交易对">
        </el-table-column>
        <el-table-column
          prop="type"
          label="方向">
          <template slot-scope="scope">
            {{scope.row.type === 'BUY' ? '买入' : '卖出'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="price"
          label="价格">
          <template slot-scope="scope">
            {{scope.row.price | currency(scope.row.pairName.split("_")[1])}}{{scope.row.pairName.split("_")[1]}}
          </template>
        </el-table-column>
        <el-table-column
          prop="fullCount"
          label="数量">
        </el-table-column>
        <el-table-column
          label="委托总额">
          <template slot-scope="scope">
            {{(scope.row.fullCount * scope.row.price) | currency(scope.row.pairName.split("_")[1])}}{{scope.row.pairName.split("_")[1]}}
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          align="right">
          <template slot-scope="scope">
            {{scope.row.status === 'normal' ? '处理中' : ''}}
          </template>
        </el-table-column>
        <el-table-column
          v-if="selected === 'normal'"
          label="操作" align="right">
          <template slot-scope="scope">
            <div type="primary" class="entrustBtn" @click="cancel(scope.row.id)">撤单</div>
          </template>
        </el-table-column>
      </el-table>

      <el-table
        v-show="selected === 'over'"
        style="width: 100%"
        class="table normalTable scrollbars"
        :data="overData"
        >
        <TableEmpty slot="empty"></TableEmpty>
        <el-table-column
          prop="createTime"
          label="委托时间"
          >
          <template slot-scope="scope">
            {{scope.row.createTime | formatDate}}
          </template>
        </el-table-column>
        <el-table-column
          prop="pairName"
          label="交易对">
        </el-table-column>
        <el-table-column
          prop="type"
          label="方向">
          <template slot-scope="scope">
            {{scope.row.type === 'BUY' ? '买入' : '卖出'}}
          </template>
        </el-table-column>
        <el-table-column
          prop="billPrice"
          label="价格">
          <template slot-scope="scope">
            {{scope.row.billPrice | currency(scope.row.pairName.split("_")[1])}}{{scope.row.pairName.split("_")[1]}}
          </template>
        </el-table-column>
        <el-table-column
          prop="billAmount"
          label="数量"
          width="70">
        </el-table-column>
        <el-table-column
          label="委托总额"
          align="right">
          <template slot-scope="scope">
            {{(scope.row.billAmount * scope.row.billPrice) | currency(scope.row.pairName.split("_")[1])}}{{scope.row.pairName.split("_")[1]}}
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { querybbEntrust, entrustCancel, bbEntrustHistory } from "@/apis/bbtrade";
import { mapGetters, mapMutations, mapActions } from "vuex";
import computeFiatPrice from '@/mixins/coin_trade/computeFiatPrice.js'
import TableEmpty from "@/components/tableEmpty.vue";

export default {
  mixins: [computeFiatPrice],
  data() {
    return {
      options: [
        {
          value: 'buy',
          label: '买入'
        },
        {
          value: 'sell',
          label: '卖出'
        },
        {
          value: 'all',
          label: '查看全部'
        }
      ],
      buyorsell: 'all',
      headList: [
        {name: '当前委托', val: 'normal'},
        {name: '历史委托', val: 'over'}
        // {name: '我的资金', val: '3'}
      ],
      selected: 'normal',
      tableData: []
      // overData: []
    }
  },
  components: {
    TableEmpty
  },
  mounted() {
    // this.pairs = this.$route.params.pairs
    this.tableData = this.normalData
  },
  computed: {
    queryTypeText() {
      let index = this.options.findIndex((item) => {
        return item.value === this.buyorsell
      })
      if (index > -1) {
        return this.options[index].label
      }
      return ''
    },
    normalData() {
      this.filterArr()
    },
    overData() {
      return this.$store.state.coin_trade.historyBills
    },
    ...mapGetters('coin_trade', ['curEntrustOrders'])
  },
  watch: {
    curEntrustOrders: {
      handler: function(newVal, old) {
        if (this.selected === 'normal') {
          this.tableData = this.filterArr()
        }
      },
      deep: true
    },
    buyorsell: {
      handler: function(newval, old) {
        this.tableData = this.filterArr()
      }
    }
  },
  methods: {
    filterArr() {
      let resultArr = []
      if (this.buyorsell === 'all') {
        resultArr = this.curEntrustOrders || []
      } else {
        resultArr = this.curEntrustOrders.filter((item) => {
          return item.type.toLowerCase() === this.buyorsell
        })
      }
      console.log(resultArr)
      return resultArr
    },
    _querybbEntrust() {
      let postObj = {
        pairName: this.pairName,
        status: [this.selected] // 'normal', //over
        // pageCount: 20,
        // page: 1,
        // isBuy: true
      }
      if (this.buyorsell === 'buy') {
        postObj.isBuy = true
      } else if (this.buyorsell === 'sell') {
        postObj.isBuy = false
      }
      // console.log(postObj)
      querybbEntrust(postObj).then((res) => {
        if (res.success) {
          this.tableData = res.data.list || []
        } else {

        }
      })
    },
    _bbEntrustHistory() {
      this.GET_HISTORYBILLS()
      // bbEntrustHistory().then((res) => {
      //   if (res.success) {
      //     // this.$message.success
      //     this.overData = res.data.list || []
      //   } else {
      //     this.$message.error(res.message)
      //   }
      // })
    },
    selectTypes(command) {
      // console.log(command)
      this.buyorsell = command
      // if (this.selected === 'normal') {
      //   if (command === 'all') {
      //     this.tableData = this.normalData
      //   } else {
      //     this.tableData = this.normalData.filter((item) => {
      //       return item.type === command.toUpperCase()
      //     })
      //   }
      // }
    },
    selectedStatus(status) {
      this.selected = status
      if (status === 'normal') {
        this.tableData = this.normalData
      } else {
        this._bbEntrustHistory()
      }
    },
    cancel(id) {
      entrustCancel({id}).then((res) => {
        if (res.success) {
          this.$message.success(res.message || '操作成功')
          this.REMOVE_CUR_ENTRUSORDERS(id)
          // this._querybbEntrust()
        } else {
          this.$message.error(res.message)
        }
      })
    },
    ...mapMutations('coin_trade', ['REMOVE_CUR_ENTRUSORDERS']),
    ...mapActions('coin_trade', ['GET_HISTORYBILLS'])
  }
}
</script>
<style lang="scss" scoped>
.entrust{
  width: 100%;
  background-color: $bg-content;
  height: 100%;
  // min-height: 120px;
  // max-height: 355px; //348px;
  .header{
    display: flex;
    height: 39px;
    line-height: 40px;
    justify-content: space-between;
    padding: 0 10px;
    // margin-bottom: 10px;
    .head-left{
      display: flex;
      color: $font-color3;
      @include fontsize("content2");
      height: 40px;
      li{
        margin-right: 30px;
        transition: border-bottom 0.2s;
        cursor: pointer;
      }
      .selected{
        border-bottom: 2px solid $font-color8;
      }
    }
  }
  .content{
    padding: 0 10px;
    height: calc(100% - 40px);
    .table{
      height: 100%;
      overflow: auto;
      // /deep/ .el-table td, .el-table th{
      //   padding: 3px 0;
      // }
      .entrustBtn{
        width: 80px;
        height: 30px;
        line-height: 30px;
        cursor: pointer;
        text-align: center;
        // overflow: hidden;
        background-color: $primary;
        @include fontsize("small");
        color: $font-color1;  
        border-radius: 2px;
        display: inline-block;
      }
    }
    
  }
}
</style>
<style lang="scss">
.entrust{
  .el-table td, .el-table th{
    padding: 7px 0;
    line-height: 23px;
  }
  .el-table th div{
    color: $font-color3;
    @include fontsize('small');
    font-weight: 500;
  }
  .el-table .cell{
    color: $font-color4;
    @include fontsize('content3');
    line-height: 16px;
  }
  .el-table .el-table__header tr > th:first-child,.el-table .el-table__body tr > td:first-child{
    padding-left: 0px ;
  }
  .el-table .el-table__body tr > td:last-child{
    padding-right: 0;
  }
  .el-table__body-wrapper{
    height: calc(100% - 40px);
  }
}
</style>


