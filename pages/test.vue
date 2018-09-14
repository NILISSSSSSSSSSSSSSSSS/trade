<template>
<section class="container">
  <img src="~assets/img/logo.png" alt="Nuxt.js Logo" class="logo" />
  <h1 class="title">
    {{$t('common.index')}}
  </h1>
  {{token}}
 <!-- <el-button type="primary" @click="()=>showGroupChat=true">打开群聊</el-button> -->
  <nuxt-link :to="$i18n.path('/test')">测试</nuxt-link>
  <el-input v-num v-model="num"></el-input>
  <div class="text border-bottom" v-if="os.phone" @click="$i18n.push('/test')">手机</div>
  <div class="text border-bottom" v-if="os.pc" @click="$i18n.push('/test')">PC</div>
  <div>
    <fieldset>
      <legend>皮肤切换</legend>
      <el-button @click="CHANGE_THEME('light')">深色</el-button>
      <el-button @click="CHANGE_THEME('red')">红色</el-button>
    </fieldset>
  </div>
  <div>
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
  <c2cChat />
</section>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex"
import groupChat from "@/components/chat/group"
import c2cChat from "@/components/chat/c2c"
import { setCookie, getCookie, getServiceCookie } from "@/tools/cookie"
// const {mapState, mapMutations} = createNamespacedHelpers('test')
export default {
  data() {
    return {
      userid: "@chat.chainexcloud.net",
      password: "123456",
      showGroupChat: false,
      num: "1"
    }
  },
  async asyncData({ app, store, os, link }) {
    return {
      os: os,
      link: link
    }
  },
  components: {
    groupChat,
    c2cChat
  },
  computed: {
    ...mapState({
      token: state => state.user.token,
      lang: state => state.lang
    })
  },
  head() {
    return {
      title: "前端开发"
    }
  },
  methods: {
    ...mapMutations("test", ["SET_TOKEN"]),
    ...mapMutations(["SET_LANG", "CHANGE_THEME"]),
    ...mapActions(["GET_QUOTES", "GET_EXCHANGERATE"]),
    ...mapActions("c2c_chat", ["CHAT_LOGIN", "OPEN_CHAT"]),
    ...mapActions("account", ["SET_ACCOUNT_ASSET"]),
    ...mapActions("coin_trade", [
      "GET_CUR_ENTRUSORDERS",
      "GET_PAIRBILLS",
      "GET_PAIRPRICE",
      "GET_PAIRDEPTH",
      "GET_PAIRPRICE",
      "GET_CUR_PAIRPRICE"
    ]),
    chatlogin() {
      this.CHAT_LOGIN({
        userid: this.userid,
        password: this.password
      })
    },
    async chatWith(user, order) {
      await this.OPEN_CHAT({
        orderId: order,
        username: user
      })
    }
  },
  async mounted() {
    this.$message.success({
      message: '测试成功',
      duration: 0
    })
    // this.GET_CUR_ENTRUSORDERS('BTC_ETH')
    // this.GET_PAIRBILLS('BTC_USDT')
    // this.GET_PAIRDEPTH('USDT_BTC')
    // await this.GET_CUR_PAIRPRICE('USDT_ETH')
    // this.GET_PAIRPRICE(this.$store.state.bbPairs[0].pairs)
    // this.GET_QUOTES(this.$store.state.common.currencies)
    // this.SET_ACCOUNT_ASSET()
    // this.GET_EXCHANGERATE('CNY')
  }
}
</script>

<style lang="scss" scoped>
.container {
  .title {
    margin: 30px 0;
  }
  .users {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .user {
    margin: 10px 0;
  }
  .text {
    @include fontsize("small");
  }
}
</style>
