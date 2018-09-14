<template>
  <div>
    <section>
      <div class="addressLabel">
        <span class="type">{{ withdraw.currencyId }}</span>
        {{ $t('finance.property.withdraw.title') }}
      </div>
      <el-input placeholder="" class="address" v-model="withdraw.to"></el-input>
    </section>
    <section>
      <div class="numberLabel">
        <span class="num">{{ $t('common.amount') }}</span>
        <span class="min">{{ $t('finance.property.withdraw.min') }}：
          <span v-for="(item, i) in list" :key="i">
            <span class="font-blue">{{ item.primaryChain }} </span>
            {{ item.withdrawMin }}
            <span v-show="i<list.length-1"> / </span>
          </span>
        </span>
        <span class="balance">{{ $t('finance.property.withdraw.balance') }}：{{ availableBalance }}</span>
      </div>
      <el-input placeholder="" class="number" v-model="withdraw.amount"></el-input>
    </section>
    <section>
      <div class="passwordLabel">{{ $t('finance.property.withdraw.password') }}</div>
      <el-input placeholder="" type="password" class="password" v-model="withdraw.assestsPass"></el-input>
    </section>
    <section>
      <div class="googleLabel">{{ $t('finance.property.withdraw.google') }}</div>
      <el-input placeholder="" class="google" v-model="withdraw.code"></el-input>
      <span class="tip">{{ $t('finance.property.withdraw.tip') }}</span>
      <span class="setting" @click="$i18n.push('/security/google/validate')">{{ $t('finance.property.withdraw.setting') }}</span>
    </section>
    <div class="charge">{{ $t('finance.property.withdraw.charge') }}：
      <div class="chargeBg">
        <span v-for="(item, i) in list" :key="i" class="chargeBlock">
          <span class="font-blue">{{ item.primaryChain }}</span> 
          <span class="chargeMargin"> ({{ item.withdrawFeePercent * 100 }}% + {{ item.withdrawFeeFixed }} {{ withdraw.currencyId }})</span>
        </span>
      </div>
    </div>
    <MyButton :text="$t('finance.property.withdraw.confirm')" class="confirm" @click="_withdraw(withdraw)"></MyButton>
  </div>
</template>

<script>
import MyButton from '@/components/Button'
import { preWithdraw, withdraw } from "@/apis/finance/transaction.js";

export default {
  data () {
    return {
      availableBalance: '0',
      list: [],
      withdraw: {
        currencyId: '',
        amount: '',
        to: '',
        assestsPass: '',
        code: '',
        desc: ''
      }
    }
  },
  components: {
    MyButton
  },
  created () {
    this.withdraw.currencyId = this.$route.query.type || 'USDT'
  },
  mounted () {
    this._preWithdraw(this.withdraw.currencyId)
  },
  methods: {
    async _preWithdraw(params) {
      const resData = await preWithdraw(params)
      if (resData.success) {
        this.availableBalance = resData.data.availableBalance
        this.list = resData.data.list
      }
      console.log(resData)
    },
    async _withdraw(params) {
      const resData = await withdraw(params)
      console.log(resData)
      if (resData.success) {
        this.$message.success('提币成功')
      }
      // this.withdraw = {
      //     currencyId: this.withdraw.currencyId,
      //     amount: '',
      //     to: '',
      //     assestsPass: '',
      //     code: '',
      //     desc: ''
      //   }
    }
  }
}
</script>

<style lang="scss" scoped>
.addressLabel{
  font-size: 14px;
  height: 28px;
  margin-bottom: 8px;
  .type{
    font-size: 20px;
    color: $btn-blue;
    position: relative;
    bottom: -1px;
  }
}
.el-input{
  max-width: 800px;
}
.numberLabel{
  margin-top: 30px;
  margin-bottom: 10px;
  font-size: 14px;
  color: $font-color2;
  max-width: 800px;
  .balance{
    float: right;
    @include fontsize('small');
    color: $font-color5;
  }
  .min{
    float: right;
    margin-left: 35px;
    @include fontsize('small');
    color: $font-color5;
    @include phone{
      margin-left: 0px;
      margin-top: 3px;
    }
  }
}
.passwordLabel{
  font-size: 14px;
  color: $font-color2;
  margin-top: 24px;
  margin-bottom: 10px;
}
.googleLabel{
  font-size: 14px;
  color: $font-color2;
  margin-top: 30px;
  margin-bottom: 10px;
}
.google{
  max-width: 580px;
  margin-right: 20px;
  @include phone{
    margin-right: 0px;
    margin-bottom: 5px;
    display: block;
  }
}
.tip{
  margin-right: 10px;
  font-size: 14px;
  color: $font-color2;
}
.setting{
  font-size: 14px;
  color: $primary;
  cursor: pointer;
}
.charge{
  @include fontsize('small');
  color: $font-color5;
  margin-top: 24px;
  margin-bottom: 68px;
  @include phone{
    margin-bottom: 24px;
  }
  .chargeMargin{
    margin-right: 30px;
    @include phone{
      margin: 0px;
    }
  }
  .chargeBlock{
    @include phone{
      display: block;
      margin-left: 50px;
      margin-bottom: 5px;
    }
  }
  .chargeBg{
    display: inline;
    @include phone{
      display: block;
      margin-top: -15px;
    }
  }
}
.confirm{
  max-width: 580px;
  /deep/ .el-button{
    background: $btn-green;
    font-size: 14px;
  }
}
</style>
