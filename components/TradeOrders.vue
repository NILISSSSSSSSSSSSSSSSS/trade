<template>
  <div class="tradeOrders">
    <div class="more">
      <div class="moreBtn">
        <nuxt-link :to="$i18n.path(pathForMore)"> {{ $t('common.more') }} >></nuxt-link>
      </div>
      <div class="moreFilter">
        <el-select v-model="value" :placeholder="$t('common.seeAll')">
          <el-option
            v-for="(item, i) in options"
            :key="i"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
    </div>
    <el-tabs class="tabStyle">
      <!-- 我的当前订单 -->
      <el-tab-pane :label="$t('common.orderComponent.current')">
        <el-table
          :data="a_curOrders"
          style="width: 100%">
            <TableEmpty slot="empty"></TableEmpty>
            <el-table-column type="expand">
              <template slot-scope="props">
                <div class="orderUserInfo">
                  <span>{{ $t('common.code.oppoNickname') }}：{{ props.row.nickname }}</span>
                  <div class="orderInfoR">
                    <span class="orderStatus">{{ props.row.orderStatus | orderStatus2 }}</span> | <i class="el-icon-time"></i>还剩
                    <TimeDown :endTime="props.row.expireTime"></TimeDown>
                  </div>
                  <div>
                    <div class="orderAppeal" @click="toAppealHandle(props.row)" >
                      <i class="iconfont icon-woyaoshensu"></i> {{ $t('common.code.appealAgainst') }}
                    </div>
                    <div class="orderBtn">
                      <el-button
                        class="orderBtns bg-btn-gray"
                        @click="orderRemitHandle(props.row)"
                      >
                        {{ $t('common.code.paymentInformation') }}
                      </el-button>

                      <!-- v-if="props.row.tradeType === 'buy' &amp;&amp; ((props.row.isAdMaster &amp;&amp; props.row.isC2C) || !props.row.isC2C)" -->
                      <el-button
                        class="orderBtns bg-btn-blue"
                        @click="orderPayHandle(props.row)"
                        v-if="props.row.orderStatus === 'waitPay' &amp;&amp; ((!props.row.isC2C &amp;&amp; !props.row.isOwner &amp;&amp; props.row.tradeType === 'buy') || (!props.row.isC2C &amp;&amp; props.row.isOwner &amp;&amp; props.row.tradeType === 'sell') || (props.row.isC2C &amp;&amp; props.row.isOwner &amp;&amp; props.row.tradeType === 'sell'))"
                      >
                        {{ $t('common.code.paid') }}
                      </el-button>

                      <el-button
                        class="orderBtns bg-btn-red"
                        @click="orderRevokeHandle(props.row)"
                        v-if="(!props.row.isC2C &amp;&amp; props.row.orderStatus === 'waitPay') || (props.row.isC2C &amp;&amp; props.row.waitPayTime > currentTimeDate)"
                      >
                        {{ $t('common.code.revoke') }}
                      </el-button>

                      <!-- v-if="props.row.tradeType === 'sell' &amp;&amp; ((props.row.isAdMaster &amp;&amp; props.row.isC2C) || !props.row.isC2C)" -->
                      <el-button
                        class="orderBtns bg-btn-blue"
                        @click="orderReceiveHandle(props.row)"
                        v-if="props.row.orderStatus === 'waitCoin' &amp;&amp; ((!props.row.isC2C &amp;&amp; !props.row.isOwner &amp;&amp; props.row.tradeType === 'sell') || (!props.row.isC2C &amp;&amp; props.row.isOwner &amp;&amp; props.row.tradeType === 'buy') || (props.row.isC2C &amp;&amp; props.row.isOwner &amp;&amp; props.row.tradeType === 'buy'))"
                      >
                        {{ $t('common.code.receipt') }}
                      </el-button>
                    </div>
                    
                    <div v-if="warning" class="orderWarning">
                      {{ $t('common.code.warning') }}
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              prop="id"
              :label="$t('common.orderCode')">
              <template slot-scope="props">
                <svg class="icon" aria-hidden="true" v-if="props.row.isC2C">
                    <use xlink:href="#icon-CC"></use>
                </svg>
                <svg class="icon" v-else>
                    <use xlink:href="#icon-OTC"></use>
                </svg>
                {{ props.row.id }}
              </template>
            </el-table-column>
            <el-table-column
              prop="tradeType"
              width="70"
              :label="$t('common.type')">
              <template slot-scope="props">
                <span v-if="props.row.tradeType === 'buy' && !props.row.isOwner" class="font-red">{{ $t('common.buy') }}</span>
                <span v-else-if="props.row.tradeType === 'buy' && props.row.isOwner" class="font-green">{{ $t('common.sell') }}</span>
                <span v-else-if="props.row.tradeType === 'sell' && props.row.isOwner" class="font-red">{{ $t('common.buy') }}</span>
                <span v-else class="font-green">{{ $t('common.sell') }}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="unitPrice"
              :label="$t('common.price')">
              <template slot-scope="props">
                {{ props.row.unitPrice | fiatCurrency }}({{ props.row.legalCurrency }})
              </template>
            </el-table-column>
            <el-table-column
              prop="tradeCurrencyAmount"
              :label="$t('common.amount')">
              <template slot-scope="props">
                {{ props.row.tradeCurrencyAmount | currency(props.row.currencyId) }}({{ props.row.currencyId }})
              </template>
            </el-table-column>
            <el-table-column
              prop="legalCurrencyAmount"
              :label="$t('common.legalAmount')">
              <template slot-scope="props">
                {{ props.row.legalCurrencyAmount | fiatCurrency }}({{ props.row.legalCurrency }})
              </template>
            </el-table-column>
            <el-table-column
              width="100px"
              :label="$t('common.status')">
              <template slot-scope="props">
                {{ props.row.orderStatus | orderStatus }}
              </template>
            </el-table-column>
            <el-table-column
              prop="createTime"
              width="150"
              :label="$t('common.orderComponent.createTime')">
              <template slot-scope="props">
                {{ props.row.createTime | formatDate }}
              </template>
            </el-table-column>
        </el-table>
      </el-tab-pane>
      <!-- 已完成订单 -->
      <el-tab-pane :label="$t('common.orderComponent.complete')">
        <el-table
          :data="a_successOrders"
          style="width: 100%">
          <TableEmpty slot="empty"></TableEmpty>
          <el-table-column type="expand">
            <template slot-scope="props">
              <div class="orderUserInfo">
                <span>{{ $t('common.code.oppoNickname') }}：{{ props.row.nickname }}</span>
                <div class="orderInfoR">
                  <span class="orderStatus">{{ props.row.orderStatus | orderStatus2 }}</span> | <i class="el-icon-time"></i>还剩
                  <TimeDown :endTime="props.row.expireTime"></TimeDown>
                </div>
                <div>
                  <div class="orderAppeal" @click="toAppealHandle(props.row)" >
                    <i class="iconfont icon-woyaoshensu"></i> {{ $t('common.code.appealAgainst') }}
                  </div>
                  <div class="orderBtn">
                    <el-button
                      class="orderBtns bg-btn-gray"
                      @click="orderRemitHandle(props.row)"
                    >
                      {{ $t('common.code.paymentInformation') }}
                    </el-button>
                    <!-- <el-button
                      class="orderBtns bg-btn-blue"
                      @click="orderPayHandle(props.row)"
                      v-if="props.row.tradeType === 'buy' &amp;&amp; ((props.row.isAdMaster &amp;&amp; props.row.isC2C) || !props.row.isC2C)"
                    >
                      {{ $t('common.code.paid') }}
                    </el-button>
                    <el-button
                      class="orderBtns bg-btn-red"
                      @click="orderRevokeHandle(props.row)"
                      v-if="(!props.row.isC2C &amp;&amp; props.row.orderStatus === 'waitPay') || (props.row.tradeType === 'sell' &amp;&amp; props.row.isC2C &amp;&amp; props.row.durationTime > 1 * 60 * 60 * 1000)"
                    >
                      {{ $t('common.code.revoke') }}
                    </el-button>
                    <el-button
                      class="orderBtns bg-btn-blue"
                      @click="orderReceiveHandle(props.row)"
                      v-if="props.row.tradeType === 'sell' &amp;&amp; ((props.row.isAdMaster &amp;&amp; props.row.isC2C) || !props.row.isC2C)"
                    >
                      {{ $t('common.code.receipt') }}
                    </el-button> -->
                  </div>
                  <!-- <div v-if="warning" class="orderWarning">
                    {{ $t('common.code.warning') }}
                  </div>  -->
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="id"
            :label="$t('common.orderCode')">
            <template slot-scope="props">
              <svg class="icon" aria-hidden="true" v-if="props.row.isC2C">
                  <use xlink:href="#icon-CC"></use>
              </svg>
              <svg class="icon" v-else>
                  <use xlink:href="#icon-OTC"></use>
              </svg>
              {{ props.row.id }}
            </template>
          </el-table-column>
          <el-table-column
            prop="tradeType"
            width="70"
            :label="$t('common.type')">
            <template slot-scope="props">
              <span v-if="props.row.tradeType === 'buy' && !props.row.isOwner" class="font-red">{{ $t('common.buy') }}</span>
              <span v-else-if="props.row.tradeType === 'buy' && props.row.isOwner" class="font-green">{{ $t('common.sell') }}</span>
              <span v-else-if="props.row.tradeType === 'sell' && props.row.isOwner" class="font-red">{{ $t('common.buy') }}</span>
              <span v-else class="font-green">{{ $t('common.sell') }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="unitPrice"
            :label="$t('common.price')">
            <template slot-scope="props">
              {{ props.row.unitPrice | fiatCurrency }}({{ props.row.legalCurrency }})
            </template>
          </el-table-column>
          <el-table-column
            prop="tradeCurrencyAmount"
            :label="$t('common.amount')">
            <template slot-scope="props">
              {{ props.row.tradeCurrencyAmount | currency(props.row.currencyId) }}({{ props.row.currencyId }})
            </template>
          </el-table-column>
          <el-table-column
            prop="legalCurrencyAmount"
            :label="$t('common.legalAmount')">
            <template slot-scope="props">
              {{ props.row.legalCurrencyAmount | fiatCurrency }}({{ props.row.legalCurrency }})
            </template>
          </el-table-column>
          <el-table-column
            width="100px"
            :label="$t('common.status')">
            <template slot-scope="props">
              {{ props.row.orderStatus | orderStatus }}
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            width="150"
            :label="$t('common.orderComponent.createTime')">
            <template slot-scope="props">
              {{ props.row.createTime | formatDate }}
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <!-- 已取消订单 -->
      <el-tab-pane :label="$t('common.orderComponent.cancel')">
        <el-table
          :data="a_cancelOrders"
          style="width: 100%">
          <TableEmpty slot="empty"></TableEmpty>
          <el-table-column type="expand">
            <template slot-scope="props">
              <div class="orderUserInfo">
                <span>{{ $t('common.code.oppoNickname') }}：{{ props.row.nickname }}</span>
                <div class="orderInfoR">
                  <span class="orderStatus">{{ props.row.orderStatus | orderStatus2 }}</span> | <i class="el-icon-time"></i>还剩
                  <TimeDown :endTime="props.row.expireTime"></TimeDown>
                </div>
                <div>
                  <div class="orderAppeal" @click="toAppealHandle(props.row)" >
                    <i class="iconfont icon-woyaoshensu"></i> {{ $t('common.code.appealAgainst') }}
                  </div>
                  <div class="orderBtn">
                    <el-button
                      class="orderBtns bg-btn-gray"
                      @click="orderRemitHandle(props.row)"
                    >
                      {{ $t('common.code.paymentInformation') }}
                    </el-button>
                    <!-- <el-button
                      class="orderBtns bg-btn-blue"
                      @click="orderPayHandle(props.row)"
                      v-if="props.row.tradeType === 'buy' &amp;&amp; ((props.row.isAdMaster &amp;&amp; props.row.isC2C) || !props.row.isC2C)"
                    >
                      {{ $t('common.code.paid') }}
                    </el-button>
                    <el-button
                      class="orderBtns bg-btn-red"
                      @click="orderRevokeHandle(props.row)"
                      v-if="(!props.row.isC2C &amp;&amp; props.row.orderStatus === 'waitPay') || (props.row.tradeType === 'sell' &amp;&amp; props.row.isC2C &amp;&amp; props.row.durationTime > 1 * 60 * 60 * 1000)"
                    >
                      {{ $t('common.code.revoke') }}
                    </el-button>
                    <el-button
                      class="orderBtns bg-btn-blue"
                      @click="orderReceiveHandle(props.row)"
                      v-if="props.row.tradeType === 'sell' &amp;&amp; ((props.row.isAdMaster &amp;&amp; props.row.isC2C) || !props.row.isC2C)"
                    >
                      {{ $t('common.code.receipt') }}
                    </el-button> -->
                  </div>
                  <!-- <div v-if="warning" class="orderWarning">
                    {{ $t('common.code.warning') }}
                  </div> -->
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="id"
            :label="$t('common.orderCode')">
            <template slot-scope="props">
              <svg class="icon" aria-hidden="true" v-if="props.row.isC2C">
                  <use xlink:href="#icon-CC"></use>
              </svg>
              <svg class="icon" v-else>
                  <use xlink:href="#icon-OTC"></use>
              </svg>
              {{ props.row.id }}
            </template>
          </el-table-column>
          <el-table-column
            prop="tradeType"
            width="70"
            :label="$t('common.type')">
            <template slot-scope="props">
              <span v-if="props.row.tradeType === 'buy' && !props.row.isOwner" class="font-red">{{ $t('common.buy') }}</span>
              <span v-else-if="props.row.tradeType === 'buy' && props.row.isOwner" class="font-green">{{ $t('common.sell') }}</span>
              <span v-else-if="props.row.tradeType === 'sell' && props.row.isOwner" class="font-red">{{ $t('common.buy') }}</span>
              <span v-else class="font-green">{{ $t('common.sell') }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="unitPrice"
            :label="$t('common.price')">
            <template slot-scope="props">
              {{ props.row.unitPrice | fiatCurrency }}({{ props.row.legalCurrency }})
            </template>
          </el-table-column>
          <el-table-column
            prop="tradeCurrencyAmount"
            :label="$t('common.amount')">
            <template slot-scope="props">
              {{ props.row.tradeCurrencyAmount | currency(props.row.currencyId) }}({{ props.row.currencyId }})
            </template>
          </el-table-column>
          <el-table-column
            prop="legalCurrencyAmount"
            :label="$t('common.legalAmount')">
            <template slot-scope="props">
              {{ props.row.legalCurrencyAmount | fiatCurrency }}({{ props.row.legalCurrency }})
            </template>
          </el-table-column>
          <el-table-column
            width="100px"
            :label="$t('common.status')">
            <template slot-scope="props">
              {{ props.row.orderStatus | orderStatus }}
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            width="150"
            :label="$t('common.orderComponent.createTime')">
            <template slot-scope="props">
              {{ props.row.createTime | formatDate }}
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <!-- 已申诉订单 -->
      <el-tab-pane :label="$t('common.orderComponent.appeal')">
        <el-table :data="a_appealOrders">
          <TableEmpty slot="empty"></TableEmpty>
          <el-table-column prop="id" :label="$t('common.orderCode')">
          </el-table-column>
          <el-table-column :label="$t('common.code.appealTime')">
            <template slot-scope="scope">
              <span>{{scope.row.createTime | formatDate}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('common.code.appealType')">
            <template slot-scope="scope">
              <span>{{scope.row.appealType | appealStatus}}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('common.code.appealStatus')">
            <template slot-scope="scope">
              <span>{{ scope.row.appealStatus | appealStatus }}</span>
            </template>
          </el-table-column>
          <el-table-column :label="$t('common.opreation')">
            <template slot-scope="scope">
              <el-button @click='$i18n.push(`/finance/feedback/detail?order=${scope.row.orderId}`)' type="primary" size="small" class="show">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>

    <AlertAssets :data="show.assets" />
    <AlertReceive :data="show.receive" />
    <AlertCancel :data="show.cancel" />
    <AlertRevoke :data="show.revoke" />
    <AlertRemit :data="show.remit" />
  </div>
</template>

<script>
import TimeDown from "@/components/TimeDown"
import AlertAssets from "@/components/c2c-trade/alert/assets.vue";
import AlertReceive from "@/components/c2c-trade/alert/receive.vue";
import AlertCancel from "@/components/c2c-trade/alert/cancel.vue";
import AlertRevoke from "@/components/c2c-trade/alert/revoke.vue";
import AlertRemit from "@/components/c2c-trade/alert/remit.vue";
import TableEmpty from "@/components/tableEmpty.vue";

import { mapState, mapActions } from "vuex"
import { getCookie } from '@/tools/cookie'

import { orderPay, orderReceiverPay, orderCancle } from "@/apis/order";
import { getPayway } from "@/apis/receipt";

export default {
  data () {
    return {
      currentTimeDate: new Date(),
      show: {
        assets: {
          bool: false,
          data: {}
        },
        receive: {
          bool: false,
          data: {}
        },
        cancel: {
          bool: false,
          data: {}
        },
        revoke: {
          bool: false,
          data: {}
        },
        remit: {
          bool: false,
          data: {}
        }
      },
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
      value: '',
      a_curOrders: [],
      a_successOrders: [],
      a_cancelOrders: [],
      a_appealOrders: []
    }
  },
  props: {
    warning: Boolean,
    pathForMore: String
  },
  components: {
    TimeDown,
    AlertAssets,
    AlertReceive,
    AlertCancel,
    AlertRevoke,
    AlertRemit,
    TableEmpty
  },
  methods: {
    ...mapActions("trade_order", ["INIT_ORDERS", "SUCCESS_ORDERS", "CANCEL_ORDERS", "APPEAL_ORDERS"]),
    filterHandler(value, row, column) {
      const type = column['type'];
      return row[type] === value;
    },
    orderPayHandle(data) {
      this.show.assets.bool = true
      this.show.assets.orderId = data.id
      this.show.assets.isC2C = data.isC2C
    },
    orderReceiveHandle(data) {
      this.show.receive.bool = true
      this.show.receive.orderId = data.id
    },
    orderRevokeHandle(data) {
      this.show.revoke.bool = true
      this.show.revoke.orderId = data.id
      this.show.revoke.currency = data.currencyId
      this.show.revoke.fiatCurrency = data.legalCurrency
      this.show.revoke.legalCurrencyAmount = data.legalCurrencyAmount
    },
    orderRemitHandle(data) {
      getPayway({orderId: data.id}).then(res => {
        console.log(res);
        if (res.success) {
          this.show.remit.payways = res.data
          this.show.remit.legalCurrencyAmount = data.legalCurrencyAmount
          this.show.remit.legalCurrency = data.legalCurrency
          this.show.remit.orderStatus = data.orderStatus
          this.show.remit.remark = data.id.slice(-6)
          this.show.remit.bool = true
        }
      })
    },
    toAppealHandle(data) {
      console.log('TCL: toAppealHandle -> data', data);
      if (data.appealStatus === "normal") {
        if (data.orderStatus === "cancel" || data.orderStatus === "success") {
          this.$i18n.push(`/finance/feedback/addorderFeedback?order=${data.id}`)
        } else {
          this.$message.error('此订单不符合申诉条件')
        }
      } else {
        this.$message.error('此订单不符合申诉条件')
      }
    }
  },
  computed: {
    ...mapState({
      common: state => state.common,
      user: state => state.user,
      curOrders: state => state.trade_order.orders,
      successOrders: state => state.trade_order.successOrders,
      cancelOrders: state => state.trade_order.cancelOrders,
      appealOrders: state => state.trade_order.appealOrders,
      payWays: state => state.common.allLegalCurrency.payWays
    })
  },
  mounted() {
    if (getCookie('token') && getCookie('token') !== '') {
      this.INIT_ORDERS()
      this.SUCCESS_ORDERS()
      this.CANCEL_ORDERS()
      this.APPEAL_ORDERS()
      this.$root.$on('receipt_order', function(orderId) {
        this.show.receive.bool = true
        this.show.receive.orderId = orderId
      })
    }
  },
  watch: {
    value(val) {
      if (val === 'all') {
        this.a_curOrders = this.curOrders
        this.a_successOrders = this.successOrders
        this.a_cancelOrders = this.cancelOrders
        this.a_appealOrders = this.appealOrders
      } else {
        this.a_curOrders = []
        this.a_successOrders = []
        this.a_cancelOrders = []
        this.a_appealOrders = []
        this.curOrders.forEach(item => {
          if (item.tradeType === val) {
            this.a_curOrders.push(item)
          }
        });
        this.successOrders.forEach(item => {
          if (item.tradeType === val) {
            this.a_successOrders.push(item)
          }
        });
        this.cancelOrders.forEach(item => {
          if (item.tradeType === val) {
            this.a_cancelOrders.push(item)
          }
        });
        this.appealOrders.forEach(item => {
          if (item.tradeType === val) {
            this.a_appealOrders.push(item)
          }
        });
      }
    },
    curOrders(val) {
      if (val) {
        this.a_curOrders = val
      }
    },
    successOrders(val) {
      if (val) {
        this.a_successOrders = val
      }
    },
    cancelOrders(val) {
      if (val) {
        this.a_cancelOrders = val
      }
    },
    appealOrders(val) {
      if (val) {
        this.a_appealOrders = val
      }
    }
  }
}
</script>


<style lang="scss" scoped>
.tradeOrders{
  .orderUserInfo{
    color: $font-color5;
    text-align: left;
  }
  .orderStatus{
    color: $font-color3;
  }
  .orderInfoR{
    float: right;
  }
  .orderBtns{
    width: 80px;
    height: 30px;
    font-size: 12px;
    padding: 0px;
    line-height: 30px;
    border-radius: 2px;
  }
  .orderAppeal{
    padding-top: 15px;
    float: left;
  }
  .orderBtn{
    float: right;
    padding-top: 10px;
  }
  .orderWarning{
    margin-top: 10px;
    float: right;
    width: 100%;
    text-align: right;
    color: $font-color6;
    @include fontsize("small")
  }
  .gray{
    background: $font-color3;
    color: $font-color1;
  }
  .blue{
    background: $btn-blue;
    color: $font-color1,
  }
  .lightGray{
    background: $font-color5;
    color: $font-color1;
  }
  .more{
    position: relative;
    z-index: 2;
    @include phone{
      position: unset;
      width: 100%;
    }
    .moreFilter{
      right: 0px;
      position: absolute;
      font-size: 12px;
      color: $font-color5;
      line-height: 42px;
      cursor: pointer;
      @include phone{
        position: unset;
        margin-left: 0px;
        margin: 0;
        text-align: right;
      }
    }
    .moreBtn{
      position: absolute;
      margin-left: 400px;
      line-height: 42px;
      font-size: 12px;
      color: $btn-blue;
      cursor: pointer;
      @include phone{
        position: unset;
        margin: 0px;
        width: 100px;
        float: left;
      }
    }
    /deep/ .el-input__inner{
      border: 0px;
      background: transparent;
      font-size: 12px;
      text-align: right;
      color: $font-color4;
    }
  }
  /deep/ .el-tabs__item{
    padding: 0 10px;
    color: $font-color3!important;
    @include phone{
      padding: 0 10px;
      font-size: 12px!important;
    }
  }
  /deep/ .el-tabs__item:nth-child(2){
    @include phone{
      padding-left: 10px;
    }
  }
  /deep/ .el-table td, .el-table th.is-leaf{
    border-color: $line-color;
  }
  /deep/ .el-table thead th>.cell{
    font-weight: normal!important;
    color: $font-color3;
  }
  /deep/ .el-table__expanded-cell{
    background: $table-header-color!important;
    padding: 15px!important;
  }
  .orderAppeal{
    cursor: pointer;
  }
  .orderAppeal:hover{
    color: $primary;
  }
  .icon-woyaoshensu{
    position: relative;
    top: 1px;
  }
  .tabStyle{
    border: 1px solid $line-color;
    margin-bottom: 20px;
    border-bottom: 0;
  }
  /deep/ .el-tabs__nav-wrap::after{
    height: 0;
  }
  /deep/ .el-tabs__header{
    padding-left: 16px;
    background-color: $table-header-color;
    margin: 0;
  }
  /deep/ .el-table td,/deep/ .el-table th{
    padding: 8px 0;
  }
}
</style>
