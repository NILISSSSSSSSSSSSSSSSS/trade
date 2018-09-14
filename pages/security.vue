<template>
  <div class="container">
    <el-row :gutter="20">
      <el-col :lg="4">
        <FinanceSide active="1-1"></FinanceSide>
      </el-col>
      <el-col class="right" :lg="20">
        <nuxt-child />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getServiceCookie, getCookie } from "@/tools/cookie";
import {getPhoneAndEmail} from '@/apis/user'
import FinanceSide from "@/components/FinanceSide";
export default {
  middleware: ["userAuth"],
  components: {
    FinanceSide
  },
  async asyncData ({req, store, isServer}) {
    console.log('--------req----------')
    console.log(isServer)
    var headers = {}
    var token
    if (isServer) {
      token = getServiceCookie('token', req)
      if (token) {
        headers = {headers: {token: token}}
      }
      // console.log(headers)
      let res = await getPhoneAndEmail({}, headers)
      // console.log(res)
      if (res.success) {
        store.commit('security/setVertifyData', res.data)
      }
    } else {
      token = getCookie('token')
      if (token) {
        headers = {headers: {token: token}}
      }
      let res = await getPhoneAndEmail({}, headers)
      if (res.success) {
        store.commit('security/setVertifyData', res.data)
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  .right {
    padding-top: 30px;
    padding-bottom: 20px;
  }
}
</style>
<style lang="scss" >
.valicode-input {
  .el-input__inner {
    border-right: none;
    // @include fontsize("content3");
    font-size: 14px;
  }
  .el-input-group__append {
    border-left: none;
    cursor: pointer;
    em {
      color: $primary;
    }
    span {
      color: $font-color5;
    }
  }
  .line {
    width: 1px;
    display: inline-block;
    height: 14px;
    float: left;
    margin: 3px 10px 0 0;
  }
  .click-before {
    background-color: $primary;
    cursor: pointer;
  }
  .click-after {
    background-color: $font-color5;
  }
}
.my-dialog {
  .el-dialog {
    width: 450px;
  }
  .el-dialog__header {
    padding: 0;
  }
  .el-dialog__body {
    padding: 30px 52px;
  }
  .content {
    position: relative;
    padding-bottom: 50px;
    .close-tag {
      position: absolute;
      font-size: 20px;
      right: -40px;
      top: -15px;
    }
    .head {
      height: 36px;
      line-height: 36px;
      margin-bottom: 20px;
    }
    .item {
      /* margin-bottom: 25px; */
      .btn {
        background-color: $primary;
        width: 100%;
      }
      
    }
    .msg-tip {
      position: absolute;
      bottom: 10px;
      left: 0;
      text-align: center;
      width: 100%;
      span {
        @include fontsize("content3");
        color: $fz-color;
        background-color: $font-color4;
        padding: 4px 25px;
      }
    }
  }
  @include phone{
    .el-dialog {
      width: 90%;
      max-width: 450px;
    }
    .el-dialog__body {
      padding: 30px 30px;
    }
    .content{
      .close-tag{
        right: -20px;
      }
    }
  }
}
::-webkit-input-placeholder {
  /* WebKit browsers */
  font-size: 14px;
}
:-moz-placeholder {
  /* Mozilla Firefox 4 to 18 */
  font-size: 14px;
}
::-moz-placeholder {
  /* Mozilla Firefox 19+ */
  font-size: 14px;
}
:-ms-input-placeholder {
  /* Internet Explorer 10+ */
  font-size: 14px;
}
  
.el-button--primary{
  background-color: $primary;
}
.err-tip{
  display: block;
  min-height: 30px;
  line-height: 30px;
  color: $font-color6;
  @include fontsize("small");
}
</style>


