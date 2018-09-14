<template>
  <div class="group-chat-item">
    <div class="name">
      <span class="avatar1">{{item.username| chatName}}</span> {{item.username}}
    </div>
    <div class="msg" ref="msg" v-html="item.msg">
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
export default {
  name: 'chat-item',
  props: {
    item: {
      type: Object,
      default: null
    }
  },
  mounted() {
    let _this = this
    this.$nextTick(function() {
      if (this.$refs.msg) {
        this.$refs.msg.querySelectorAll('img').forEach(e => {
          if (e.src.indexOf('emoji') < 0) {
            e.onclick = function() {
              _this.SHOW_BIG_PIC(e.src)
            }
          }
        })
      }
    })
  },
  methods: {
    ...mapMutations('group_chat', ['SHOW_BIG_PIC'])
  }
}
</script>

<style lang="scss">
.group-chat-item {
  padding: 0px 10px 0px 10px;
  margin-top: 20px;
  box-sizing: border-box;
  .name {
    @include fontsize('content3');
    padding-bottom: 5px;
    color: gray;
    .avatar1 {
      display: inline-block;
      height: 30px;
      width: 30px;
      border-radius: 50%;
      background-color: #9e9e9e;
      text-align: center;
      line-height: 30px;
      color: white;
      font-weight: bold;
      margin-right: 5px;
    }
  }
  .msg {
    @include fontsize('content2');
    padding: 0px 10px 0px 38px;
    word-break: break-all;
    img {
      max-width: 150px !important;
    }
  }
}
</style>
