<template>
  <el-dialog
    :visible.sync="data.bool"
    center
    class="c2c-alert remit-alert"
    :show-close="false"
  >
    <section class="content remit">
      <div class="title">
        <em>汇款订单</em>
      </div>
      <div class="body">
        <p class="info">1.请按照提示信息像该卖家汇款；</p>
        <!-- <div class="items">
          <div class="item" v-for="(payWay, i) in data.payways" :key="i">
            <div class="name">收款方姓名</div>
            <div class="val">晓萌</div>
          </div>

          <div class="item">
            <div class="name">收款方姓名</div>
            <div class="val">晓萌</div>
          </div>
          <div class="item">
            <div class="name">收款方开户行</div>
            <div class="val">平安银行中山分行营业部</div>
          </div>
          <div class="item">
            <div class="name">收款方账号</div>
            <div class="val">6348589450919</div>
          </div>
          <div class="item">
            <div class="name">收款方支付宝</div>
            <div class="val">
              <span class="check" @click="visibleAlipay = !visibleAlipay">点击查看支付宝二维码</span>
              <div class="img-box" v-show="visibleAlipay">
                <img src="#" alt="">
              </div>
            </div>
          </div>
          <div class="item">
            <div class="name">收款方微信</div>
            <div class="val">
              <span class="check" @click="visibleWechat = !visibleWechat">点击查看微信二维码</span>
              <div class="img-box" v-show="visibleWechat">
                <img src="#" alt="">
              </div>
            </div>
          </div>
          <div class="item">
            <div class="name">转账金额</div>
            <div class="val">
              <span class="price">{{ data.legalCurrencyAmount | fiatCurrency  }}</span><em>{{ data.legalCurrency }}</em>
            </div>
          </div>
          <div class="item">
            <div class="name">汇款时备注内容</div>
            <div class="val">
              <span class="price">{{ data.remark }}</span><em>(请务必填写)</em>
            </div>
          </div>
          <div class="item">
            <div class="name">状态</div>
            <div class="val">
              {{ data.orderStatus | orderStatus }}
            </div>
          </div>
        </div> -->
        <el-tabs v-model="activeName2"  @tab-click="handleClick">
          <el-tab-pane :label="item.id" name="first" v-for="(item, i) in payWays" :key="i">
            <div v-for="(ele, j) in data.payways" :key="j" v-if="ele.payWay === item.id" class="items">
              <div class="item">
                <div class="name">{{ item.code.title }}</div>
                <div class="val">{{ ele.code }}</div>
              </div>
              <div class="item">
                <div class="name">{{ item.pic.title }}</div>
                <div class="val">点击查看收款码</div>
                <qrcode-vue :value="imgHost+ele.pic" level="H" class="qrcode val"></qrcode-vue>
              </div>
              <div v-if="item.addons.length">
                <div class="item"  v-for="(editlist,editIndex) in item.addons" :key="editIndex">
                  <div class="name">{{editlist.title}}</div>
                  <div class="val">
                    {{ ele.addon[editIndex] }}
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
        <p class="info">2.汇款时请一定要填写备注信息；</p>
        <p class="info">3.卖家确认收到款后，自动充值。如超过24小时未收到币，请及时申诉；</p>
        <p class="info">4.请务必使用本人绑定的银行卡、支付宝或微信进行汇款。</p>
        <div class="line border-bottom"></div>
      </div>

      <div class="warnings">
        <span>温馨提示：如有任何疑问请联系在线客服或查看帮助中心。</span>
      </div>
    </section>
  </el-dialog>
</template>
<script>
import { mapState } from 'vuex'
import QrcodeVue from 'qrcode.vue';
import { imgHost } from "@/plugins/config";

export default {
  props: {
    data: Object
  },
  data() {
    return {
      // centerDialogVisible: true,
      visibleWechat: false,
      visibleAlipay: false,
      activeName2: '',
      imgHost: imgHost
    };
  },
  computed: {
    ...mapState({
      payWays: state => state.common.allLegalCurrency.payWays
    })
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event);
    }
  },
  components: {
    QrcodeVue
  }
};
</script>

<style lang="scss"  >
@import "./base.scss";

.content {
  .title{
    color: $font-color2;
    @include fontsize("title1");
    padding: 30px 20px 10px 20px;
  }
  .body {
    padding: 0 20px;
    .info{
      color: $font-color2;
      @include fontsize("content2");
      line-height: 16px;
    }
    .items{
      border: 1px solid $line-color;
      border-bottom: none;
      .item{
        display: flex;
        min-height: 50px;
        line-height: 50px;
        border-bottom: 1px solid $line-color;
        .name{
          width: 30%;
          padding-left: 20px;
          box-sizing: border-box;
          background-color: $fz-color;
          margin-right: 30px;
        }
        .val{
          flex: 1;
          .check{
            color: $primary;
            cursor: pointer;
          }
          .img-box{
            width: 160px;
            height: 160px;
            background-color: $fz-color;
            padding: 10px;
            box-sizing: border-box;
            margin-bottom: 20px;
            img{
              display: block;
              width: 140px;
              height: 140px;
              // border: 1px solid red;
            } 
          }
          .price{
            color: $font-color6;
            margin-right: 5px;
          }
        }
      }
    }
    .line{
      margin-bottom: 20px;
      height: 1px;
    }
  }
  .warnings{
    padding: 0 20px;
    color: $font-color5;
    @include fontsize("small");
  }
}
</style>
<style lang="scss">
.remit-alert{
  .el-dialog {
    width: 600px;
    padding-bottom: 20px;
    @include phone {
      width: 90%;
    }
  }
}
</style>




