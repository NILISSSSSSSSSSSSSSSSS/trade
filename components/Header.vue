<template>
<div class="fixedHeader">
  <header class="header lrspace lg" style="display:none">
    <div class="left">
      <h6>logo</h6>
      <nuxt-link :to="$i18n.path('/')" exact>{{$t('header.index')}}</nuxt-link>
      <nuxt-link :to="$i18n.path('/c2c-trade')">{{$t('header.c2c')}}</nuxt-link>
      <nuxt-link :to="$i18n.path('/otc')">{{$t('header.otc')}}</nuxt-link>
      <nuxt-link :to="$i18n.path('/coin_coin')">{{$t('header.coin')}}</nuxt-link>
      <nuxt-link :to="$i18n.path('/finance')">{{$t('header.finance')}}</nuxt-link>
      <nuxt-link :to="$i18n.path('/security')">{{$t('header.security')}}</nuxt-link>
    </div>
    <div class="right">
      <a href="javascript:;" @click="toggleNotice($event)">
        <el-badge :value="newNoticeCount" class="notice" style="margin-bottom: 5px;">{{$t('header.msg')}}</el-badge>
      </a>
      <select-theme size="big"></select-theme>
      <!-- <nuxt-link to="/4">{{$t('header.notice')}}</nuxt-link> -->
      <nuxt-link to="/help-center">{{$t('header.helpCenter')}}</nuxt-link>
      <div class="loginReg" v-if="user_info==null">
        <nuxt-link :to="$i18n.path('/user/login')">{{$t('header.login')}}</nuxt-link>
        <span> | </span>
        <nuxt-link :to="$i18n.path('/user/register')">{{$t('header.register')}}</nuxt-link>
      </div>
      <div class="userInfo" v-else>
          <img class="avatar" :src="user_info.avatar | avatarConvert" />
        <a href="javascript:;">
          {{user_info.nickname}}
        </a>
        <a class="logout" href="javascript:;" @click="LOGOUT">
          {{$t('header.logout')}}
        </a>
      </div>
      <el-dropdown @command="changeLang" class-name="lang" class="lang">
        <span class="el-dropdown-link">
            <a href="javascript:;" class="lang">{{lang.displayText}}<i class="el-icon-arrow-down el-icon--right"></i></a>
          </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="item in common.supportLang" :key="item.symbol" :command="item">{{item.displayText}}</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </header>
  <div class="header small" style="display:none">
    <i class="iconfont icon-caidan navBar" @click="toogleSmallNav"></i> {{title}}
    <el-badge class="notice" :is-dot="newNoticeCount>0"><i @click="toggleNotice($event)" class="iconfont icon-xiaoxi"></i></el-badge>
  </div>
  <div class="header smallPanel leftNav" ref="leftNav" :class="smallNav?'on':''">
    <div class="user" v-if="user_info==null">
      <div class="avatar">
        <img src="/img/avatar_128.png" />
      </div>
      <div class="login">
        <nuxt-link :to="$i18n.path('/user/login')">{{$t('header.login')}}</nuxt-link>
        <span> | </span>
        <nuxt-link :to="$i18n.path('/user/register')">{{$t('header.register')}}</nuxt-link>
      </div>
    </div>
    <div class="user" v-else>
      <div class="avatar">
        <img :src="user_info.avatar | avatarConvert" />
      </div>
      <div class="nickname">{{ user_info.nickname }}</div>
    </div>
    <div class="navs">
      <div class="nav">
        <nuxt-link :to="$i18n.path('/')" exact>{{$t('header.index')}}</nuxt-link>
      </div>
      <div class="nav">
        <nuxt-link :to="$i18n.path('/c2c-trade')">{{$t('header.c2c')}}</nuxt-link>
      </div>
      <div class="nav">
        <nuxt-link :to="$i18n.path('/otc')">{{$t('header.otc')}}</nuxt-link>
      </div>
      <div class="nav">
        <nuxt-link :to="$i18n.path('/coin_coin')">{{$t('header.coin')}}</nuxt-link>
      </div>
      <div class="nav">
        <nuxt-link :to="$i18n.path('/finance')">{{$t('header.finance')}}</nuxt-link>
      </div>
      <div class="nav">
        <nuxt-link :to="$i18n.path('/security')">{{$t('header.security')}}</nuxt-link>
      </div>
      <div class="nav">
        <a href="javascript:;">{{$t('header.msg')}}</a>
      </div>
      <div class="nav">
        <nuxt-link to="/help-center">{{$t('header.helpCenter')}}</nuxt-link>
      </div>
      <div class="nav" v-if="user_info!=null">
        <a href="javascript:;" @click="logout">{{$t('header.logoutMobile')}}</a>
      </div>
      <select-theme size="small" @onSelect="()=>smallNav=false"></select-theme>
      <div class="nav">
        <a href="javascript:;" @click="toogleLang">{{lang.displayText}}<i :class="openLang?'el-icon-caret-bottom':'el-icon-caret-top'"></i></a>
        <div class="lang" :class="openLang?'on':''">
          <a href="javascript:;" v-for="item in common.supportLang" :key="item.symbol" @click="changeLang(item)" class="small">{{item.displayText}}</a>
        </div>
      </div>
    </div>
  </div>
  <div class="header smallPanel cover" v-show="smallNav" @click="toogleSmallNav"></div>
  <HeaderNotice></HeaderNotice>
</div>
</template>

<script>
import selectTheme from './header/selectTheme'
import HeaderNotice from "./header/HeaderNotice";
import socket from '@/mixins/socket/socket'
import {
  mapState,
  mapMutations,
  mapActions,
  mapGetters
} from "vuex";
export default {
  mixins: [socket],
  data() {
    return {
      smallNav: false, // 是否展示侧边栏
      title: "", // 移动端标题
      openLang: false
    };
  },
  components: {
    HeaderNotice,
    selectTheme
  },
  computed: {
    ...mapState({
      lang: state => state.lang,
      common: state => state.common,
      token: state => state.user.token
    }),
    newNoticeCount() {
      const count = this.$store.getters["notice/newNoticeCount"];
      return count === 0 ? "" : count;
    },
    user_info() {
      const userInfo = this.$store.state.user.user_info;
      return Object.keys(userInfo).length > 0 ? userInfo : null;
    }
  },
  mounted() {
    let activeLink = this.$el.querySelector(".nuxt-link-active");
    if (activeLink) {
      this.title = activeLink.innerText;
    }
  },
  watch: {
    $route() {
      this.$nextTick(function () {
        let activeLink = this.$el.querySelector(".nuxt-link-active");
        if (activeLink) {
          this.title = activeLink.innerText;
        }
        this.smallNav = false;
      });
    }
  },
  methods: {
    ...mapMutations(["SET_LANG", "SET_COMMON"]),
    ...mapActions("notice", ["TOGGLE_NOTICE"]),
    ...mapActions("user", ["USER_INFO", "SET_TOKEN", "LOGOUT"]),
    toogleLang() {
      this.openLang = !this.openLang;
      if (this.openLang) {
        setTimeout(() => {
          this.$refs.leftNav.scrollTo(0, 10000);
        }, 500);
      }
    },
    changeLang(lang) {
      this.smallNav = false;
      if (JSON.stringify(this.lang) === JSON.stringify(lang)) {
        return;
      }
      this.SET_LANG(lang.symbol);
      this.$router.replace({
        path: `${this.$router.currentRoute.path}?lang=${lang.symbol}`
      });
      location.reload();
    },
    toogleSmallNav() {
      this.smallNav = !this.smallNav;
      if (!this.smallNav) {
        this.$refs.leftNav.scrollTo(0, 0);
      }
    },
    toggleNotice(e) {
      this.TOGGLE_NOTICE();
      e.stopPropagation();
    },
    logout() {
      this.smallNav = false;
      this.LOGOUT();
    }
  }
};
</script>

<style lang="scss" scoped>
.fixedHeader{
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 9999;
}
.header.lg {
  @include big {
    display: flex !important;
  }
}

.header.small {
  @include small {
    display: block !important;
  }
}

.header.lg {
  height: 60px;
  line-height: 60px; // background-color:bg-header;
  display: flex;
  align-items: center;
  justify-content: space-between; //color: $font-color1;
  box-sizing: border-box;
  .left {
    display: flex;
    height: 60px;
    &>h6,
    a {
      //color: $font-color1;
      @include fontsize("content3");
      @include pc {
        padding: 0 17px;
      }
      @include pad {
        padding: 0 10px;
      }
    }
    &>h6 {
      padding-left: 0;
    }
  }
  .right {
    display: flex;
    height: 60px;
    a {
      //color: $font-color1;
      @include fontsize("content3");
    }
    &>a {
      //color: $font-color1;
      @include fontsize("content3");
      @include pc {
        padding: 0 17px;
      }
      @include pad {
        padding: 0 10px;
      }
    }
    .loginReg {
      // color: $font-color1;
      background-color: transparent !important;
      @include fontsize("content3");
      a {
        display: inline-block;
        &:nth-of-type(1) {
          padding: 0 0px 0 17px;
        }
        &:nth-of-type(2) {
          padding: 0 17px 0 0px;
        }
      }
    }
    .lang{
      padding-left:8px;
    }
    .loginReg {
      .nuxt-link-exact-active {
        background-color: transparent;
      }
      .nuxt-link-active {
        background-color: transparent;
      }
    }
    .userInfo {
      // color:$font-color1;
      @include fontsize("content3");
      padding-left: 50px;
      position: relative;
      margin-right: 17px;
      .avatar {
        height: 28px;
        width: 28px;
        border-radius: 50%;
        position: absolute;
        top: 17px;
        left: 15px;
      }
      .logout {
        margin-left: 16px;
      }
    }
  }
}

.header.small {
  //background-color: $bg-header;
  height: 40px;
  line-height: 40px;
  text-align: center; //color: $font-color1;
  .navBar {
    font-size: 30px; //color: $font-color1;
    line-height: 40px;
    display: block;
    left: 10px;
    position: absolute;
  }
  .notice {
    position: absolute;
    right: 10px;
    height: 40px;
    width: 40px;
    margin-right: 16px;
    i {
      font-size: 25px;
    }
    /deep/ sup {
      top: 10px;
      right: 15px;
    }
  }
}

.header.smallPanel {
  &.cover {
    position: fixed;
    top: 0px;
    left: 0px;
    background-color: black;
    opacity: 0.6;
    z-index: 99;
    width: 100vw;
    height: 100vh;
  }
  &.leftNav {
    &.on {
      transform: translateX(0);
    }
    position: fixed;
    top: 0;
    left: 0;
    width: 230px;
    z-index: 999;
    height: 100%;
    background-color: white;
    padding-top: 20px;
    box-sizing: border-box;
    overflow: auto;
    transform: translateX(-100%);
    transition: all 0.5s;
    .login {
      // a {
      //   color: $font-color2;
      // }
      .nuxt-link-active {
        background-color: transparent;
      }
    }
    .user {
      padding-bottom: 20px;
      .avatar {
        width: 75px;
        border-radius: 50%;
        margin: 0 auto;
        text-align: center;
        height: 75px;
        img {
          width: 100%;
          border-radius: 50%;
          height: 100%;
        }
      }
      .login {
        text-align: center;
        margin-top: $space; // color: $font-color2;
        @include fontsize("title2");
      }
      .nickname {
        text-align: center;
        margin-top: 5px;
      }
    }
    /deep/ .navs {
      margin: 0 auto;
      .nav {
        .lang {
          height: 0px;
          transform: scale(0, 0);
          transition: all 0.5s;
          &.on {
            height: 60px;
            transform: scale(1, 1) !important;
          }
        }
        a {
          // color: $font-color2;
          line-height: 40px;
          font-size: 14px;
          display: block;
          text-align: left;
          /* &.nuxt-link-active {
            background-color: $primary;
            color: $font-color1;
          } */
          padding-left: 70px;
          &.small {
            font-size: 12px;
            line-height: 30px;
          }
        }
      }
    }
  }
}
</style>

<style lang="scss">
.header.lg {
  .notice {
    .el-badge__content.is-fixed {
      top: 20px !important;
    }
    .el-badge__content {
      font-size: 12px;
      border-radius: 10px;
      height: 14px;
      line-height: 14px;
      padding: 0 4px;
      right: 5px;
    }
  }
  /*.nuxt-link-active {
    background-color: $primary;
  }*/
}
</style>
