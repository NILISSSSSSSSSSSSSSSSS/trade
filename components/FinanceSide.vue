<template>
<div class="tac">
  <el-menu class="el-menu-vertical-demo big" :router="true" :default-active="$route.fullPath" @open="handleOpen" @close="handleClose" :default-openeds="['0','1','2','3','4','5','6']">
    <el-submenu v-for="(category,index) in menuList" :index="index.toString()" :key="index">
      <template slot="title">
        <span>{{category.name}}</span>
      </template>
      <el-menu-item v-for="(item,index) in category.items" @click.native="updateTitle(item)" :index="$i18n.path(item.url)" :key="index">{{item.title}}</el-menu-item>
    </el-submenu>
  </el-menu>
  <div class="small border-top">
    <div class="title" @click="toogleMenu" v-show="!showMenu">
      {{title}}
      <i class="el-icon-caret-bottom"></i>
    </div>
    <div class="categories" v-show="showMenu">
      <i class="el-icon-caret-top back" @click="toogleMenu"></i>
      <div class="category" v-for="(category,index) in menuList" :key="index">
        <div class="name">
          {{category.name}}
        </div>
        <div class="items">
          <el-tag :class="item.active?'active':''" v-for="(item, index) in category.items" :key="index" @click.native="gotoPage(item)">
            {{item.title}}
          </el-tag>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { SET_STAT } from "@/store/merchant";

export default {
  data() {
    return {
      title: " ",
      showMenu: false,
      menuList: [
        {
          name: this.$t("finance.property.title"),
          items: [
            {
              title: this.$t("finance.property.fund.title"),
              active: false,
              url: "/finance/property/fund"
            },
            {
              title: this.$t("finance.property.detail.title"),
              active: false,
              url: "/finance/property/detail"
            }
          ]
        },
        {
          name: this.$t("finance.recharge.title"),
          items: [
            {
              title: this.$t("finance.recharge.rechargerecord.title"),
              active: false,
              url: "/finance/recharge/rechargerecord"
            },
            {
              title: this.$t("finance.recharge.withdrawalrecord.title"),
              active: false,
              url: "/finance/recharge/withdrawalrecord"
            }
          ]
        },
        {
          name: this.$t("finance.trade.title"),
          items: [
            {
              title: this.$t("finance.trade.historyOtc.title"),
              active: false,
              url: "/finance/trade/history-otc"
            },
            {
              title: this.$t("finance.trade.historyC2c.title"),
              active: false,
              url: "/finance/trade/history-trade"
            },
            {
              title: this.$t("finance.trade.historybb.title"),
              active: false,
              url: "/finance/trade/history-bbtrade"
            },
            {
              title: this.$t("finance.trade.myAdver.title"),
              active: false,
              url: "/finance/trade/myAdver"
            },
            {
              title: this.$t("finance.trade.merchant.title"),
              active: false,
              url: "/finance/trade/merchant-pre"
            }
          ]
        },
        {
          name: this.$t("finance.security.title"),
          items: [
            {
              title: this.$t("finance.security.google.title"),
              active: false,
              url: "/security/google/validate"
            },
            {
              title: this.$t("finance.security.phone.title"),
              active: false,
              url: "/security/phone/validate"
            },
            {
              title: this.$t("finance.security.email.title"),
              active: false,
              url: "/security/email/validate"
            },
            {
              title: this.$t("finance.security.pay.title"),
              active: false,
              url: "/security/pay/setting"
            },
            {
              title: this.$t("finance.security.changeLoginPw.title"),
              active: false,
              url: "/security/modify/loginpw"
            },
            {
              title: this.$t("finance.security.changeAssetspw.title"),
              active: false,
              url: "/security/modify/assetspw"
            },
            {
              title: this.$t("finance.security.logs.title"),
              active: false,
              url: "/security/logs/list"
            }
          ]
        },
        {
          name: this.$t("finance.person.information.title"),
          items: [
            {
              title: this.$t("finance.person.title"),
              active: false,
              url: "/finance/person/information"
            }
          ]
        },
        {
          name: this.$t("finance.feedback.title"),
          items: [
            {
              title: this.$t("finance.feedback.history.title"),
              active: false,
              url: "/finance/feedback/history"
            }
          ]
        }
      ]
    };
  },
  mounted() {
    this.setTitle();
    this.USER_INFO();
    this.SET_Phone_Email();
    this.SET_ACCOUNT_ASSET();
    this.SET_BIZ_TYPES();
    this[SET_STAT]();
  },
  methods: {
    ...mapActions("user", ["USER_INFO", "SET_Phone_Email"]),
    ...mapActions("account", ["SET_ACCOUNT_ASSET", "SET_BIZ_TYPES"]),
    ...mapActions("merchant", [SET_STAT]),
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
    toogleMenu() {
      this.showMenu = !this.showMenu;
    },
    gotoPage(item) {
      this.menuList.map(category => {
        category.items.map(item => {
          item.active = false;
        });
      });
      item.active = true;
      this.title = item.title;
      this.toogleMenu();
      this.$i18n.push(item.url);
    },
    updateTitle(item) {
      // 更新title,用于同步小屏的title
      this.title = item.title;
    },
    setTitle() {
      this.menuList.map(category => {
        category.items.map(item => {
          if (item.url === this.$route.path) {
            item.active = true;
            this.title = item.title;
          }
        });
      });
      switch (this.$route.path) {
        case "/finance/feedback/addorderFeedback":
          this.title = this.$t("finance.feedback.create.title");
          break;
        case "/finance/feedback/detail":
          this.title = this.$t("finance.feedback.detail.title");
          break;
      }
    }
  },
  beforeDestroy() {
    document.body.style.overflow = "auto";
  },
  watch: {
    showMenu(value) {
      if (value) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "auto";
      }
    },
    $route() {
      document.body.style.overflow = "auto";
      this.setTitle();
    }
  }
};
</script>

<style lang="scss" scoped>
.tac {
  > .big {
    @include small {
      display: none;
    }
  }
  > .small {
    @include big {
      display: none !important;
    }
  }
  /deep/ .el-submenu {
    border-bottom: 1px solid $line-color;
    .el-submenu__title {
      color: $font-color2;
      font-weight: bold;
      @include fontsize("content2");
      padding-left: 10px !important;
    }
    .el-menu-item {
      padding: 0 0 0 20px !important;
      @include fontsize("content3");
      min-width: 100px;
      height: 34px;
      line-height: 34px;
    }
    .is-active {
      background-color: $primary;
      color: $font-color1;
    }
  }
  /deep/ .small {
    margin-left: -$space;
    margin-right: -$space;
    box-sizing: border-box;
    .title {
      background-color: $bg-header;
      line-height: 40px;
      height: 40px;
      box-sizing: border-box;
      color: white;
      text-align: center;
      i {
        position: absolute;
        right: 20px;
        line-height: 40px;
        color: white;
      }
    }
    .categories {
      padding: 0 $space $space $space;
      box-sizing: border-box;
      position: fixed;
      top: 0px;
      width: 100%;
      height: 100%;
      background-color: white;
      z-index: 50;
      top: 40px;
      overflow: auto;
      padding-bottom: 60px;
      box-sizing: border-box;
      .back {
        position: absolute;
        right: $space;
        top: $space;
        @include fontsize("title2");
        color: $font-color4;
      }
      .categories:first-child {
        margin-top: 0px;
      }
      .category {
        margin-top: $space;
        .name {
          @include fontsize("content3");
          color: $font-color5;
        }
        .items {
          .el-tag {
            color: $font-color2;
            background-color: $line-color;
            border: none;
            margin-right: $space;
            margin-top: $space;
          }
          .el-tag.active {
            color: $btn-blue;
          }
        }
      }
    }
  }
}
</style>

<style lang="scss">
// 如果需要隐藏title的请加此样式
.finance-page-title {
  @include notpc {
    display: none;
  }
}
</style>
