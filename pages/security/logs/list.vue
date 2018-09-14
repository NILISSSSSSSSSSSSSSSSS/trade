<template>
  <div class="logs">
    <finance-title :title="$t('finance.security.logs.title')" icon="icon-anquanrizhi"></finance-title>
    <div class="head border-bottom">{{$t('finance.security.logs.subTitle')}}</div>
    <div class="table" style="height: 386px;">
      <!-- height='386' -->
      <el-table
      :header-row-class-name="'header-class'"
      :data="tableData"
      style="width: 100%"
      height="100%"
      :empty-text="$t('el.table.emptyText')"
      class="trade-table scrollbars">
      <el-table-column
        width="100px"
        type="index"
        :label="$t('finance.security.logs.table.index')"
      >
      </el-table-column>
      <el-table-column
        min-width="160px"
        :label="$t('finance.security.logs.table.time')">
        <template slot-scope="scope">
            <span>{{ scope.row.createTime | formatDate }}</span> <em class="col-line">|</em> <span class="dateDiff">{{ scope.row.createTime | getDateDiff }}</span>
        </template>
      </el-table-column>
      <el-table-column
        min-width="50px"
        label="IP">
        <template slot-scope="scope">
          <span href="javascript:void(0)" class="color-primary" @click="see(scope.row.id)">
            {{$t('finance.security.logs.table.see')}}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('finance.security.logs.table.status')">
        <template slot-scope="scope">
          <span>
            {{scope.row.status.toLowerCase() | status}}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="lang"
        :label="$t('finance.security.logs.table.lang')">
      </el-table-column>
    </el-table>

    <!-- <div class="table">
      <div class="head">安全设置日志</div>
      <el-table
        :data="tableData"
        style="width: 100%"
        class="trade-table">
        <el-table-column
          min-width="50px"
          type="index"
          label="序号"
        >
        </el-table-column>
        <el-table-column
          min-width="160px"
          label="时间">
          <template slot-scope="scope">
              <span>{{ scope.row.createTime | formatDate }}</span> <em class="col-line">|</em> <span class="dateDiff">{{ scope.row.createTime | getDateDiff }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <span>
              {{scope.row.status | status}}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          min-width="50px"
          label="IP">
          <template slot-scope="scope">
            <span href="javascript:void(0)" class="color-primary" @click="see()">
              查看
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div> -->
    </div>
    <div class="server-time">
      <div>{{$t('finance.security.logs.warning.warn')}}</div>
      <div>{{$t('finance.security.logs.warning.time')}}</div>
    </div>
  </div>
</template>

<script>
import FinanceTitle from "@/components/FinanceTitle";
import { getLoginLog, getLoginLogDetail } from "@/apis/user";

export default {
  components: {
    FinanceTitle
  },
  computed: {
  },
  data () {
    return {
      tableData: [
        // {no: 1, time: '2018-07-18 10:00:00', ip: '', status: 'success', lang: 'cn'},
        // {no: 2, time: '2018-07-18 10:00:00', ip: '', status: 'success', lang: 'cn'},
        // {no: 3, time: '2018-07-18 10:00:00', ip: '', status: 'success', lang: 'cn'},
        // {no: 4, time: '2018-07-18 10:00:00', ip: '', status: 'success', lang: 'cn'},
        // {no: 5, time: '2018-07-18 10:00:00', ip: '', status: 'success', lang: 'cn'}
      ]
    }
  },
  mounted() {
    this._getLoginLog()
  },
  methods: {
    _getLoginLog() {
      getLoginLog().then((res) => {
        if (res.success) {
          this.tableData = res.data
        } else {
          this.$message.error(res.message)
        }
      })
    },
    see (id) {
      // console.log('sdsa')
      this.$prompt(this.$t('finance.security.logs.prompt.assetsPw'), this.$t('finance.security.logs.prompt.seeIp'), {
        customClass: 'prompt-msgbox',
        confirmButtonClass: 'confirmButtonClass',
        cancelButtonClass: 'cancelButtonClass log-button',
        showClose: false,
        inputType: 'password',
        confirmButtonText: this.$t('el.messagebox.confirm'),
        cancelButtonText: this.$t('el.messagebox.cancel'),
        inputPattern: /^[0-9]{6}$/,
        inputErrorMessage: this.$t('finance.security.logs.prompt.pwError')
      }).then(({ value }) => {
        let postData = {
          id: id,
          assestsPass: Number(value)
        }
        getLoginLogDetail(postData).then((res) => {
          if (res.success) {
            let data = res.data
            this.showIP(data)
          } else {
            this.$message.error(res.message)
          }
        }).catch((err) => {
          console.log(err)
        })
      }).catch(() => {
      });
    },
    showIP (data) {
      this.$alert(`<div class="logs-alert"><div class="flexBox"><span class="key">${this.$t('finance.security.logs.prompt.loginIp')}</span><span class="value">${data.ip}</span></div><div class="flexBox"><span class="key">${this.$t('finance.security.logs.prompt.address')}</span><span class="value">${data.displayAddress}</span></div></div>`, this.$t('finance.security.logs.prompt.nowIp'), {
        dangerouslyUseHTMLString: true,
        customClass: 'alert-msgbox',
        confirmButtonText: this.$t('el.messagebox.confirm'),
        confirmButtonClass: 'confirmButtonClass',
        callback: action => {
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
.logs{
  .server-time{
    color: $font-color2;
    @include fontsize('content3');
  }
  .head{
    margin-bottom: 6px;
    @include fontsize('content2');
    color: $font-color2;
    padding-top: 40px;
    border-color: $font-color5;
    padding-bottom: 15px;
  }
  .table{
    margin-top: 0;
    margin-bottom: 20px;
    color: $font-color2;
    overflow: auto;
    // &:hover{
    //   overflow: auto;
    // }
    .trade-table {
      border: 0;
    }
    @include pc{
      // margin-top: 42px;
    }
    @include notpc{
      // margin-top: 21px;
    }
    .header-class{
      background-color: $table-header-color!important;
      // background-color: red;
    }
    .color-primary{
      color: $primary;
      cursor: pointer;
    }
    .col-line{
      margin: 0 5px;
      color: $font-color2;
    }
    .dateDiff{
      color: $font-color5;
    }
    &::-webkit-scrollbar-button {
        display: none;
    }
    &::-webkit-scrollbar {
        width: 8px;
        height: 60%;
        border-radius: 4px;
        // background-color: #f00;
    }
    &::-webkit-scrollbar-thumb {
        // height: 40px;
        background-color: $line-color;
        // background-color: red;
        border-radius: 4px;
    }
    &::-webkit-scrollbar-track-piece {
        background: $bg-white;
    }
    &::-webkit-scrollbar-corner{
        border-radius: 4px;
    }
    &::-webkit-scrollbar-track{
        border-radius: 4px;
    }
  }
}
</style>
<style lang="scss">
.header-class th{
    background-color: $bg-white!important;
}
.log-button{
  border: none !important;
}
.el-table__body-wrapper{
  ::-webkit-scrollbar{
    width: 7px;
    height: 7px;
  }
  ::-webkit-scrollbar-corner{
    background: rgba(0,0,0,0.2);
    border-color: rgba(0,0,0,0.2);
  }
  ::-webkit-scrollbar-thumb{
    min-height: 10px;
    border-radius: 4px;
    background: rgba(0,0,0,0.2);
  }
  ::-webkit-scrollbar-track{
    background: rgba(77,76,76,0.2);
    border-radius: 4px;
  }
}
</style>

