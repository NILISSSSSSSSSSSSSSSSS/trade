<template>
  <div class="groupchat" id="BB-GROUP-CHAT" :class="show?'on':''">
    <div class="header">
      聊天室
      <i class="el-icon-arrow-down" @click="OPEN_CHAT(false)" />
      <i class="iconfont icon-exit" @click="EXIT_CHAT" />
    </div>
    <div class="message" ref="chat_message" id="group_chat_message">
      <div class="loadmore" v-if="isHaveHistory" @click="LOAD_HISTORY">查看更多消息</div>
      <message-item v-for="(item,key) in historyMessages" :key="key" :item="item"></message-item>
      <message-item v-for="(item,key) in messages" :key="10000+key" :item="item"></message-item>
    </div>
    <div class="input">
      <div class="opt">
        <i class="iconfont icon-biaoqing" @click="showEmoji=!showEmoji" :class="showEmoji?'on':''" />
        <el-upload :show-file-list="false" class="upload" :on-success="onUploadSuccess" :action="uploadAction">
          <i class="iconfont icon-tupian" />
        </el-upload>
        <i @click="CLEAR_MESSAGE" class="iconfont icon-qingping1" />
      </div>
      <div class="newMsg_num" v-show="newMsgCount>0" @click="gotoMsgBottom">{{this.newMsgCount | chatMsgCount}}
        <i class="caret"></i>
      </div>
      <vue-emoji class="emoji-menu" v-show='showEmoji' ref='emoji' @select='onSelect'></vue-emoji>
      <div class="textarea" @keyup.enter="onSend" ref="message_input" contenteditable="true"></div>
      <el-button type="primary" @click="onSend" class="send" size="small">发送</el-button>
    </div>
    <div class="neegLogin" v-show="!connect_room || !isLogin">
      <el-button type="primary" v-if="!isLogin" size="small" @click="$i18n.path('/user/login')">登录后查看</el-button>
      <el-button type="primary" v-else @click="CONNECT_CHAT" size="small">加入聊天室</el-button>
    </div>
    <big-pic></big-pic>
  </div>
</template>

<script>
import TradeButton from '@/components/Button.vue'
import VueEmoji from './emoji'
import messageItem from './messageItem'
import bigPic from './bigPic'
import { mapState, mapMutations, mapActions } from 'vuex'
import { url, chatRoomID } from '@/plugins/config'
import { getCookie } from '@/tools/cookie'
import { sendMessage } from '@/apis/rocket.chat'
export default {
  name: 'group-chat',
  data() {
    return {
      showEmoji: false,
      uploadAction: `${url}/common/img/upload`,
      isLogin: process.client ? !!getCookie('token') : false
    }
  },
  components: {
    TradeButton,
    VueEmoji,
    messageItem,
    bigPic
  },
  computed: {
    ...mapState({
      show: state => state.group_chat.openChat,
      connect_room: state => state.group_chat.connect_room,
      messages: state => state.group_chat.messages,
      historyMessages: state => state.group_chat.historyMessages,
      newMsgCount: state => state.group_chat.newMsgCount,
      isHaveHistory: state => state.group_chat.isHaveHistory,
      isAutoBottom: state => state.group_chat.isAutoBottom
    })
  },
  mounted() {
    if (this.$refs.chat_message) {
      let _vm = this
      this.$refs.chat_message.addEventListener('scroll', function(e) {
        console.log('scroll')
        let target = e.target
        let offsetHeight = target.offsetHeight
        let scrollTop = target.scrollTop
        let scrollHeight = target.scrollHeight
        let toBottom = scrollHeight - offsetHeight - scrollTop
        if (toBottom > 50) {
          _vm.SET_AUTO_TO_BOTTOM(false)
        } else {
          _vm.SET_AUTO_TO_BOTTOM(true)
          _vm.CLEAR_NEWMSGCOUNT()
        }
      })
    }
  },
  methods: {
    ...mapActions('group_chat', [
      'OPEN_CHAT',
      'CONNECT_CHAT',
      'EXIT_CHAT',
      'LOAD_HISTORY'
    ]),
    ...mapMutations('group_chat', [
      'CLEAR_MESSAGE',
      'SET_AUTO_TO_BOTTOM',
      'CLEAR_NEWMSGCOUNT'
    ]),
    onSelect({ html }) {
      this.$refs.message_input.innerHTML =
        this.$refs.message_input.innerHTML + html
      this.showEmoji = false
    },
    onSend() {
      let msg = this.$refs.message_input.innerHTML
        .trim()
        .replace('<div><br></div><div><br></div>', '')
      if (msg.length > 0) {
        sendMessage({
          rid: chatRoomID,
          msg: msg
        }).then(res => {
          if (res.success) {
            this.$refs.message_input.innerHTML = ''
          }
        })
      } else {
        this.$refs.message_input.innerHTML = ''
      }
    },
    onUploadSuccess(res, file, fileList) {
      if (res.data) {
        sendMessage({
          rid: chatRoomID,
          image_url: `http://${res.data}`
        }).then(res => {
          if (res.success) {
          }
        })
      }
    },
    gotoMsgBottom() {
      if (this.$refs.chat_message) {
        this.$refs.chat_message.scrollTo(0, 100000)
      }
    }
  },
  watch: {
    messages() {
      if (this.isAutoBottom) {
        this.gotoMsgBottom()
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.groupchat {
  position: fixed;
  background-color: white;
  z-index: 600;
  box-sizing: border-box;
  transform: translateY(130%);
  transition: all 0.5s;

  &.on {
    transform: translateY(0%);
  }

  @include notphone {
    width: 500px;
    right: $space;
    bottom: $space;
  }

  @include phone {
    width: 100%;
    right: 0;
    bottom: 0;
  }

  box-shadow: 0 0 5px #e4e9ed;

  .header {
    background-color: $bg-header;
    height: 40px;
    line-height: 40px;
    color: $font-color1;
    padding-left: $space;

    i {
      float: right;
      line-height: 40px;
      margin-right: $space;
      font-size: 20px;
      cursor: pointer;
    }
  }

  .message {
    height: 50vh;
    overflow: auto;
    padding-bottom: 20px;
    box-sizing: border-box;

    .loadmore {
      @include fontsize('content3');
      color: $primary;
      margin-top: 10px;
      text-align: center;
      cursor: pointer;
    }
  }

  /deep/ .input {
    border-top: 1px solid $line-color;
    padding-bottom: 50px;

    .opt {
      margin-top: $space;

      .iconfont {
        margin-left: $space;
        font-size: 20px;
        cursor: pointer;

        &:hover {
          color: #1296db;
        }

        &.on {
          color: #1296db;
        }
      }

      .upload {
        display: inline-block;
      }

      box-sizing: border-box;
    }

    .textarea {
      border: none;
      padding: $space;
      width: 100%;
      outline: none;
      resize: none;
      box-sizing: border-box;
      height: 60px;
      overflow-y: auto;
      overflow-x: hidden;
    }

    .send {
      position: absolute;
      right: $space;
      bottom: $space;
    }
  }

  .neegLogin {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.59);
  }
}
</style><style lang="scss">
@include notphone {
  .emoji-menu {
    width: 500px !important;
  }
}

@include phone {
  .emoji-menu {
    width: 100vw !important;
  }
}

.groupchat .emoji-menu {
  bottom: 150px !important;
  position: fixed;
}

.groupchat {
  .neegLogin {
    .el-button {
      margin-top: 50%;
      margin-left: 50%;
      transform: translate(-50%);
      cursor: pointer;
    }
  }

  .newMsg_num {
    position: absolute;
    bottom: 155px;
    right: 30px;
    z-index: 3;
    padding: 1px 6px;
    background: $primary;
    color: $font-color1;
    border-radius: 50%;
    cursor: pointer;

    .caret {
      position: absolute;
      bottom: -2px;
      left: 0;
      border: none;
      width: 100%;
      text-align: center;
      margin: 0;
      height: 0;

      &:before {
        position: initial;
        display: inline;
        color: $primary;
        content: '';
        position: absolute;
        display: inline-block;
        width: 0;
        height: 0;
        border-top: 4px dashed;
        border-right: 4px solid transparent;
        border-left: 4px solid transparent;
        border-width: 5px;
        top: -3px;
        left: 6px;
      }
    }
  }
}
</style>
