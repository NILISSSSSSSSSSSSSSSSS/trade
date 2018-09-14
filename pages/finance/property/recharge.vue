<template>
  <div>
    <section v-for="(item, i) in list" :key="i">
      <div class="addressLabel">
        <span class="type">{{ item.primaryChain }}</span>
        {{ $t('finance.property.recharge.title') }}（{{ i+1 }}）
      </div>
      <el-input placeholder="" class="address" :disabled="true" :value="item.address"></el-input>
      <MyButton :text="$t('finance.property.recharge.copy')" class="copy" 
        v-clipboard:copy="item.address"
        v-clipboard:success="onCopy"
        v-clipboard:error="onError"></MyButton>
      <div class="qrcodeLabel">{{ $t('finance.property.recharge.qrcode') }}：</div>
      <qrcode-vue :value="item.address" :size="size" level="H" class="qrcode"></qrcode-vue>
    </section>
    <div class="tips">
      <div>{{ $t('common.warmPrompt') }}</div>
      <ul>
        <li>{{ $t('finance.property.recharge.tip1') }}</li>
        <li>{{ $t('finance.property.recharge.tip2') }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
import MyButton from '@/components/Button'
import QrcodeVue from 'qrcode.vue';
import { depositsAddress } from '@/apis/account.js'

export default {
  data () {
    return {
      type: '',
      size: 160,
      list: []
    }
  },
  components: {
    MyButton,
    QrcodeVue
  },
  created () {
    this.type = this.$route.query.type || 'USDT'
    this._depositsAddress(this.type)
  },
  methods: {
    async _depositsAddress(params) {
      const res = await depositsAddress(params);
      this.list = res.data
    },
    onCopy: function (e) {
      this.$message.success('你刚刚复制了: ' + e.text)
    },
    onError: function (e) {
      this.$message.error('复制失败')
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
  max-width: 580px;
  margin-right: 20px;
  @include phone{
    margin-right: 0px;
  }
}
.copy{
  max-width: 200px;
  display: inline-block;
  /deep/ .el-button{
    font-size: 14px;
    @include phone{
      margin-top: $space;
    }
  }
}
.address{
  /deep/ .el-input__inner{
    background: $line-color;
    border: 0;
  }
}
.qrcodeLabel{
  font-size: 14px;
  color: $font-color2;
  margin: 20px 0;
}
.qrcode{
  margin-bottom: 50px;
}
.tips{
  font-size: 14px;
  color: $font-color2;
  ul{
    padding-left: 17px;
    margin: 0;
  }
}
</style>
