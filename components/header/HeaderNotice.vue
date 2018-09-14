<template>
<div class="headerNotice" @click="noticeClick($event)">
  <div class="lgNotice" :class="showNotice?'on':''">
    <div class="opt">
      <el-badge :is-dot="newNoticeCount>0" class="left">{{$t('header.msg')}}</el-badge>
      <span class="right" @click="CLEAR_ORDER_NOTICE">清空</span>
    </div> 
    <div class="items" v-if="notices.length>0">
      <div class="item" @click="gotoOrder(item)" :class="item.isread?'':'on'" v-for="(item,index) in notices" :key="index">
        {{$t(`msg.${item.messageType}`,{ orderid:item.orderId })}}
      </div>
    </div>
    <div v-else class="empty">
      {{$t('msg.nomsg')}}
    </div>
  </div>
  <div class="smallNotice" :class="showNotice?'on':''">
    <i class="el-icon-close close" @click="TOGGLE_NOTICE"></i>
    <span class="clear" @click="CLEAR_ORDER_NOTICE">{{$t('msg.clear')}}</span>
    <div class="items" v-if="notices.length>0">
      <div class="item" @click="gotoOrder(item)" :class="item.isread?'':'on'" v-for="(item,index) in notices" :key="index">
         {{$t(`${item.messageType}`,{
           orderId:item.orderId
         })}}
      </div>
    </div>
    <div v-else class="empty">
      {{$t('msg.nomsg')}}
    </div>
  </div>
</div>
</template>

<script>
import { mapActions, mapState, mapGetters } from "vuex"
export default {
  computed: {
    ...mapState({
      notices: state => state.notice.order_notices,
      haveNewNotice: state => state.notice.haveNewNotice,
      showNotice: state => state.notice.showNotice
    }),
    ...mapGetters("notice", ["newNoticeCount"])
  },
  methods: {
    ...mapActions("notice", [
      "CLEAR_ORDER_NOTICE",
      "READ_ORDER_NOTICE",
      "TOGGLE_NOTICE"
    ]),
    ...mapActions("group_chat", ["OPEN_CHAT"]),
    noticeClick(e) {
      e.stopPropagation()
    },
    gotoOrder(item) {
      if (item.isC2c) {
        this.$i18n.path("/c2c-trade")
      } else {
        this.$i18n.path("/otc")
      }
      if (item.messageType === "msg_order_waitCoin" && item.isOwner === false) {
        this.OPEN_CHAT({
          orderId: item.orderId,
          usernme: item.usernme
        })
      }
    }
  },
  created() {
    if (!process.server) {
      window.document.body.addEventListener("click", () => {
        if (this.showNotice) {
          this.TOGGLE_NOTICE()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.headerNotice {
  .lgNotice {
    position: absolute;
    width: 300px;
    min-height: 300px;
    max-height: 500px;
    overflow-y: auto;
    background-color: white;
    z-index: 999;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    right: 480px;
    padding: 10px;
    box-sizing: border-box;
    border-radius: 5px;
    display: none;
    transition: all 0.5s;
    @include notphone {
      &.on {
        display: inline-block;
      }
    }
    .opt {
      height: 30px;
      border-bottom: 1px solid $line-color;
      .left {
        @include fontsize("content2");
        color: $font-color2;
        position: absolute;
        left: $space;
        cursor: pointer;
      }
      .right {
        @include fontsize("content3");
        color: $font-color5;
        position: absolute;
        right: $space;
        cursor: pointer;
      }
    }
    .item {
      color: $font-color5;
      @include fontsize("content3");
      cursor: pointer;
      padding: $space 0px;
      &.on {
        color: $font-color2;
        font-weight: bold;
      }
      border-top: 1px solid $line-color;
    }
    .empty {
      padding: $space 0px;
      text-align: center;
      color: $font-color5;
      @include fontsize("content3");
    }
  }
  .smallNotice {
    transform: translateY(101%);
    position: fixed;
    height: 100%;
    width: 100%;
    top: 0;
    z-index: 10000;
    background-color: white;
    padding: $space;
    box-sizing: border-box;
    padding-top: 2.5 * $space;
    transition: all 0.3s;
    overflow-y: auto;
    &.on {
      @include phone {
        transform: translateY(0);
        overflow: auto;
      }
    }
    .close {
      position: absolute;
      left: $space;
      top: $space;
      @include fontsize("content2");
      color: $font-color5;
    }
    .clear {
      position: absolute;
      right: $space;
      top: $space;
      @include fontsize("content2");
      color: $font-color5;
    }
    .item {
      color: $font-color5;
      @include fontsize("content3");
      padding: $space 0px;
      &.on {
        color: $font-color5;
      }
      border-top: 1px solid $line-color;
    }
    .empty {
      padding: $space 0px;
      text-align: center;
      color: $font-color5;
      @include fontsize("content3");
    }
  }
}
</style>
