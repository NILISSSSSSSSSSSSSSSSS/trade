<template>
  <div class="index container">
    <el-carousel>
      <el-carousel-item v-for="item in 4" :key="item">
        <h3>{{ item }}</h3>
      </el-carousel-item>
    </el-carousel>
    <section class="">
      <div class="tradeTable">
        <div class="search-box">
          <div class="search-icon">
            <i class="el-icon-search search-icon"></i>
            <span class="bac"></span>
          </div>
          <input type="text" v-model="searchKey" @keyup="filterByKey" class="input">
        </div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane :label="item" v-for="(item, i) in tabs" :key="i">
            <el-table
              :data="priceArr"
              style="width: 100%"
              >
              <el-table-column
                prop="pairName"
                label="交易对"
                sortable
                width="180">
                <template slot-scope="scope">
                  <span class="select" @click.stop="collect(scope.row)">
                    <i class="iconfont icon-shoucang iconYes" v-if="collectPairs.indexOf(scope.row.pairName) > -1"></i>
                    <i class="iconfont icon-shoucang-no iconNo" v-else></i>
                  </span>
                  {{ scope.row.pairName.split("_")[0] }} / {{ scope.row.pairName.split("_")[1] }}
                </template>
              </el-table-column>
              <el-table-column
                prop="price"
                label="最新价"
                sortable
                width="180">
                <template slot-scope="scope">
                  {{ scope.row.price | fiatCurrency }}({{ fiatCurrency }})
                </template>
              </el-table-column>
              <el-table-column
                prop="rise"
                sortable
                label="涨幅"
              >
                <template slot-scope="scope">
                  <span v-if="rise>=0" class="font-color6">+{{ (scope.row.rise * 100).toFixed(2) }}% ↑</span>
                  <span v-else class="font-color7">-{{ (scope.row.rise * 100).toFixed(2) }}% ↓</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="high"
                label="最高价"
              >
                <template slot-scope="scope">
                  {{ scope.row.high | fiatCurrency }}({{ fiatCurrency }})
                </template>
              </el-table-column>
              <el-table-column
                prop="low"
                label="最低价"
              >
                <template slot-scope="scope">
                  {{ scope.row.low | fiatCurrency }}({{ fiatCurrency }})
                </template>
              </el-table-column>
              <el-table-column
                prop="vol"
                label="24H量"
              >
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <el-tab-pane label="自选" name="collects">
            <el-table
              :data="priceArr"
              style="width: 100%"
              >
              <el-table-column
                prop="pairName"
                label="交易对"
                sortable
                width="180">
                <template slot-scope="scope">
                  <span class="select" @click.stop="collect(scope.row)">
                    <i class="iconfont icon-shoucang iconYes" v-if="collectPairs.indexOf(scope.row.pairName) > -1"></i>
                    <i class="iconfont icon-shoucang-no iconNo" v-else></i>
                  </span>
                  {{ scope.row.pairName.split("_")[0] }} / {{ scope.row.pairName.split("_")[1] }}
                </template>
              </el-table-column>
              <el-table-column
                prop="price"
                label="最新价"
                sortable
                width="180">
                <template slot-scope="scope">
                  {{ scope.row.price | fiatCurrency }}({{ fiatCurrency }})
                </template>
              </el-table-column>
              <el-table-column
                prop="rise"
                sortable
                label="涨幅"
              >
                <template slot-scope="scope">
                  <span v-if="rise>=0" class="font-color6">+{{ (scope.row.rise * 100).toFixed(2) }}% ↑</span>
                  <span v-else class="font-color7">-{{ (scope.row.rise * 100).toFixed(2) }}% ↓</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="high"
                label="最高价"
              >
                <template slot-scope="scope">
                  {{ scope.row.high | fiatCurrency }}({{ fiatCurrency }})
                </template>
              </el-table-column>
              <el-table-column
                prop="low"
                label="最低价"
              >
                <template slot-scope="scope">
                  {{ scope.row.low | fiatCurrency }}({{ fiatCurrency }})
                </template>
              </el-table-column>
              <el-table-column
                prop="vol"
                label="24H量"
              >
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="tips">
        <div class="tip">
          <img src="../assets/img/index1.png" alt="banner1" class="imgRight">
          <div class="text">
            <dl>
              <dt>全球化的数字资产配置及交易服务</dt>
              <dd>遍布全球的项目拓展及运营管理体系</dd>
              <dd>在多个国家和地区设有本地交易服务中心</dd>
              <dd>服务超过130个国家的数百万用户</dd>
            </dl>
          </div>
        </div>
        <div class="tip">
          <img src="../assets/img/index2.png" alt="banner2" class="imgLeft">
          <div class="text">
            <dl>
              <dt>全球化的数字资产配置及交易服务</dt>
              <dd>遍布全球的项目拓展及运营管理体系</dd>
              <dd>在多个国家和地区设有本地交易服务中心</dd>
              <dd>服务超过130个国家的数百万用户</dd>
            </dl>
          </div>
        </div>
        <div class="tip">
          <img src="../assets/img/index3.png" alt="banner3" class="imgRight">
          <div class="text">
            <dl>
              <dt>全球化的数字资产配置及交易服务</dt>
              <dd>遍布全球的项目拓展及运营管理体系</dd>
              <dd>在多个国家和地区设有本地交易服务中心</dd>
              <dd>服务超过130个国家的数百万用户</dd>
            </dl>
          </div>
        </div>
      </div>
    </section>
    <!-- <el-button type="primary" @click="()=>showGroupChat=true">打开群聊</el-button> -->
      <!-- <div>
        <fieldset>
          <legend>聊天室</legend>
          <div>
            <el-row :gutter="24">
              <el-col :lg="8" :md="8" :sm="8">
                <el-input placeholder="用户名" v-model="userid"> </el-input>
              </el-col>
              <el-col :lg="8" :md="8" :sm="8">
                <el-input placeholder="请输入密码" v-model="password">
                </el-input>
              </el-col>
              <el-col :lg="4" :md="4" :sm="4">
                <el-button @click="chatlogin">登录</el-button>
              </el-col>
            </el-row>
            <el-button @click="chatWith('iris','10001')">和IRIS聊天</el-button>
            <el-button @click="chatWith('frank','10002')">和Frank聊天</el-button>
            <el-button @click="chatWith('nick','10003')">和NICK聊天</el-button>
          </div>
        </fieldset>
      </div>
      <groupChat :show="showGroupChat" />
      <c2cChat /> -->
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
import groupChat from "@/components/chat/group";
import c2cChat from "@/components/chat/c2c";
import { setCookie, getCookie, getServiceCookie } from "@/tools/cookie";
import { getPairPrice, configUserPair, getUserConfigPairs } from "@/apis/bbtrade";

export default {
  data() {
    return {
      token: '',
      priceArr: [],
      userid: "@chat.chainexcloud.net",
      password: "123456",
      showGroupChat: false,
      num: '1',
      bbPairs: '',
      tabs: [],
      activeName: '0',
      searchKey: '',
      collectPairs: [] // 自选的交易对(服务器)
    };
  },
  components: {
    groupChat,
    c2cChat
  },
  computed: {
    ...mapGetters('coin_trade', ['pairPrice']),
    ...mapState({
      fiatCurrency: state => state.lang.fiatCurrency
    })
  },
  watch: {
    pairPrice: {
      handler: function (newVal, old) {
        this.priceArr = newVal
        this.filterByKey() // 搜索条件过滤掉的一些
      },
      deep: true
    }
  },
  methods: {
    ...mapActions('coin_trade', ['GET_PAIRPRICE']),
    ...mapActions(['GET_EXCHANGERATE']),
    async _getUserConfigPairs() {
      let res = await getUserConfigPairs()
      if (res.success) {
        this.collectPairs = res.data || []
      } else {
        // this.$message.error(res.message)
      }
    },
    filterByKey() {
      if (!this.searchKey) {
        return
      }
      let tmpArr = this.priceArr.filter((item) => {
        return item.pairName.includes(this.searchKey)
      })
      this.priceArr = tmpArr
    },
    chatlogin() {
      this.CHAT_LOGIN({
        userid: this.userid,
        password: this.password
      });
    },
    async chatWith(user, order) {
      await this.OPEN_CHAT({
        orderId: order,
        username: user
      });
    },
    handleClick(tab, event) {
      console.log(tab, event);
      if (tab.name === 'collects') {
        this.collects()
      }
      this.bbPairs.forEach(ele => {
        if (ele.zone === tab.label) {
          this.GET_PAIRPRICE(ele.pairs)
        }
      })
    },
    collects() {
      this.selectedCollect = true
      // this.selectedCy = 'collect' // 代表选中自选eArr = []
      if (!this.token) {
        this.priceArr = []
        this.$message.error('请先登录');
        return
      }
      if (this.collectPairs.length) {
        this.GET_PAIRPRICE(this.collectPairs)
      } else {
        this.priceArr = []
      }
    },
    collect(item) {
      if (!this.token) {
        this.$message.error('请先登录');
        return
      }
      let index = this.collectPairs.indexOf(item.pairName)
      let postObj = {
        pairName: item.pairName,
        marked: index === -1
      }
      configUserPair(postObj).then((res) => {
        if (res.success) {
          this._getUserConfigPairs()
        } else {
          // this.$message.error(res.message)
        }
      })
    },
    computedbbPrice(item) {
      let pairName = item.pairName
      let price = this.priceFiat({currency: pairName.split("_")[0]}) / this.priceFiat({currency: pairName.split("_")[1]})
      // console.log(price)
      if (Number(price)) {
        return price
      }
      return item.price
    }
  },
  created () {
    this.bbPairs = this.$store.state.bbPairs
    this.bbPairs.forEach((element, i) => {
      if (i === 0) {
        this.GET_PAIRPRICE(element.pairs)
      }
      if (i > 2) {
        return false
      }
      this.tabs.push(element.zone)
    });
    console.log(this.bbPairs)
  },
  mounted () {
    this.token = getCookie('token')
    this.GET_EXCHANGERATE(this.fiatCurrency)
  }
};
</script>

<style lang="scss" scoped>
.index{
  .iconNo{
    font-size: 12px;
  }
  .iconYes{
    font-size: 14px;
    color: $font-color8;
  }
  .el-carousel{
    height: 300px;
    margin-left: $space2;
    margin-right: $space2;
    /deep/ .el-carousel__container{
      @include pc{
        height: 300px;
      }
      @include notpc{
        height: 200px;
      }
    }
    @include notpc{
      height: 200px;
    }
  }
  .el-carousel__item h3 {
    color: #475669;
    font-size: 18px;
    opacity: 0.75;
    line-height: 300px;
    text-align: center;
    margin: 0;
    @include notpc{
      line-height: 200px;
    }
  }
  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }
  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }
    .tradeTable{
      position: relative;
      margin-top: 30px;
      /deep/ .el-table th {
        background-color: $primary;
        color: $bg-content;
      }
      /deep/ .el-tabs__item{
        background-color: $line-color;
        width: 190px;
        height: 40px;
        text-align: center;
        padding: 0px;
        margin-right: 2px;
      }
      /deep/ .el-tabs__header {
        margin: 0px;
      }
      /deep/ .el-tabs__item.is-active {
        height: 60px;
        padding-top: 20px;
        color: $font-color3;
      } 
      /deep/ .el-tabs__active-bar{
        display: none;
      }
      /deep/ .el-tabs__nav-wrap{
        margin: 0px;
      }
      /deep/ .el-table .sort-caret.ascending {
        border-bottom-color: $bg-content;
      }
      /deep/ .el-table .sort-caret.descending {
        border-top-color: $bg-content;
      }
    }
    .search-box{
      width: 150px;
      height: 30px;
      line-height: 30px;
      margin-top: 25px;
      z-index: 9;
      // background-color: $line-color;
      position: absolute;
      right: 5px;
      border: 1px solid $line-color;
      display: flex;
      flex-direction: row-reverse;
      .input{
        border: none;
        outline: none;
        background-color: transparent;
        flex: 1;
        display: flex;
        min-width: 126px;
        padding-left: 12px;
        box-sizing: border-box;
      }
      .search-icon{
        width: 30px;
        // display: flex;
        // justify-content: center;
        // align-items: center;
        text-align: center;
        position: relative;
        .bac{
          display: block;
          width: 100%;
          height: 100%;
          position: absolute;
          left: 0;
          top: 0;
          // background-color: $font-color4;
          opacity: 0.25;
        }
      }
    }
    .tip{
      overflow: hidden;
      .imgRight{
        @include notpc{
          display: none;
        }
        display: block;
        float: right;
        height: 100%;
      }
      .imgLeft{
        @include notpc{
          display: none;
        }
        display: block;
        float: left;
        height: 100%;
        margin-right: 140px;
      }
      .text{
        dt{
          @include notpc{
            margin:40px 0px 20px 0px;
            font-size: 20px;
            color: $font-color2;
          }
          margin:100px 0px 50px 0px;
          font-size: 35px;
          color: $font-color2;
        }
        dd{
          @include notpc{
            font-size: 13px;
            color: $font-color2;
            margin-left: 0px;
          }
          font-size: 16px;
          color: $font-color2;
          margin-left: 0px;
        }
      }
    }
}
</style>
