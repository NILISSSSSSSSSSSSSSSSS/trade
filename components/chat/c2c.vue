<template>
  <div class="chat c2cchat" :class="show?'on':''">
    <div class="header" v-if="curUser">
      <div class="line1">与
        <span class="name">{{curUser.username}}</span>聊天</div>
      <div class="line2">订单号{{curUser.orderId}}</div>
      <i class="el-icon-minus" @click="CLOSE_CHAT" />
    </div>
    <div class="content">
      <div class="users">
        <div class="user" @click="CHANGE_USER(user)" :class="user.active?'on':''" v-for="(user,key) in chatUsers" :key="key">
          <img src='/img/avatar_128.png' />
          <span class="newMsgCount" v-show="user.newMsgCount>0"></span>
          <div class="name">{{user.username}}</div>
          <div class="order">{{user.orderId}}</div>
          <i class="el-icon-close" @click="REMOVE_USER(user)"></i>
        </div>
      </div>
      <div class="panel">
        <system-msg ref="system_msg" v-if="curUser!=undefined" :item="curUser.systemNotice"></system-msg>
        <div class="message" ref="chat_message" id="c2c_chat_message" v-if="curUser!=undefined">
          <message-item :item="item" :key="index" v-for="(item,index) in curUser.messages"></message-item>
        </div>
        <div class="input">
          <vue-emoji class="emoji-menu" v-show='showEmoji' ref='emoji' @select='onSelect'></vue-emoji>
          <div class="textarea" @keyup.enter="send" ref="message_input" contenteditable="true"></div>
          <div class="opt">
            <i class="iconfont icon-biaoqing optBtn" @click="showEmoji=!showEmoji" :class="showEmoji?'on':''" />
            <el-upload :show-file-list="false" class="optBtn" :on-success="onUploadSuccess" :action="uploadAction">
              <i class="iconfont icon-tupian" />
            </el-upload>
            <el-button type="primary" class="send" size="small" @click="send">发送</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { url } from '@/plugins/config'
import VueEmoji from './emoji'
import systemMsg from './c2cSystemMsg'
import messageItem from './messageItem'
import { sendMessage } from '@/apis/rocket.chat'
export default {
  name: 'c2c-chat',
  data() {
    return {
      message: '',
      showEmoji: false,
      uploadAction: `${url}/common/img/upload`
    }
  },
  components: {
    VueEmoji,
    systemMsg,
    messageItem
  },
  computed: {
    ...mapState({
      curUser: state => state.c2c_chat.chatUsers.find(x => x.active),
      chatUsers: state => state.c2c_chat.chatUsers,
      show: state => state.c2c_chat.openChat
    })
  },
  mounted() {
    this.INIT_CHAT()
  },
  methods: {
    ...mapActions('c2c_chat', [
      'CLOSE_CHAT',
      'CHANGE_USER',
      'SEND_MESSAGE',
      'REMOVE_USER',
      'CLOSE_CHAT',
      'INIT_CHAT'
    ]),
    onSelect({ html }) {
      this.$refs.message_input.innerHTML =
        this.$refs.message_input.innerHTML + html
      this.showEmoji = false
    },
    send() {
      let msg = this.$refs.message_input.innerHTML
        .trim()
        .replace('<div><br></div><div><br></div>', '')
      if (msg.length > 0) {
        this.SEND_MESSAGE({
          roomID: this.curUser.roomID,
          message: msg,
          callback: res => {
            if (res.success) {
              this.$refs.message_input.innerHTML = ''
            }
          }
        })
      } else {
        this.$refs.message_input.innerHTML = ''
      }
    },
    onUploadSuccess(res, file, fileList) {
      if (res.data && res.data.length > 0) {
        let url = `http://${res.data}`
        sendMessage({
          rid: this.curUser.roomID,
          image_url: url
        }).then(res => {
          if (res.success) {
          }
        })
      }
    }
  },
  watch: {
    curUser() {
      this.$nextTick(function() {
        if (this.$refs.chat_message) {
          this.$refs.chat_message.scrollTo(0, 10000)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.c2cchat {
  position: fixed;
  background-color: white;
  z-index: 600;
  box-sizing: border-box;
  box-shadow: 0 0 5px #e4e9ed;
  transform: translateY(130%);
  transition: all 0.5s;
  left: $space;
  &.on {
    transform: translateY(0%);
  }
  @include pc {
    width: 700px;
    right: $space;
    bottom: $space;
  }

  @include notpc {
    width: 100%;
    right: 0;
    bottom: 0;
  }

  .header {
    background-color: $bg-header;
    color: $font-color1;
    padding: $space;

    .line1 {
      @include fontsize('content2');
      letter-spacing: 0.1em;

      .name {
        color: $font-color6;
      }
    }

    .line2 {
      margin-top: 5px;
      letter-spacing: 0.1em;
      @include fontsize('content3');
    }

    .el-icon-minus {
      position: absolute;
      right: $space;
      line-height: 40px;
      top: 10px;
    }
  }

  .content {
    .users {
      z-index: 2;

      .user {
        cursor: pointer;
        position: relative;
        height: 60px;
        border-bottom: 1px solid #ebeef5;

        &.on {
          background-color: #ebeef5;
        }

        img {
          margin-top: 10px;
          height: 40px;
          border-radius: 50%;
          margin-left: 10px;
        }

        .name {
          @include fontsize('content2');
          position: absolute;
          left: 60px;
          top: 10px;
          font-weight: bold;
          width: 100px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          color: $font-color2;
        }

        .order {
          @include fontsize('content3');
          position: absolute;
          left: 60px;
          bottom: 10px;
          color: $font-color2;
          overflow: hidden;
          width: 80px;
          text-overflow: ellipsis;
        }

        .newMsgCount {
          position: absolute;
          top: 8px;
          left: 35px;
          height: 10px;
          width: 10px;
          display: inline-block;
          background: red;
          border-radius: 50%;
          text-align: center;
          color: white;
        }

        .el-icon-close {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          right: $space;
          font-size: 20px;
          color: $font-color5;
          cursor: pointer;
          z-index: 10000;
        }
      }
    }

    .panel {
      .message {
        height: 40vh;
        overflow: auto;
        padding-bottom: 20px;
        box-sizing: border-box;
      }

      /deep/ .input {
        border-top: 1px solid $line-color;
        padding-bottom: $space;

        .opt {
          margin-top: $space;

          .optBtn {
            margin-left: $space;
            display: inline-block;
            font-size: 20px;
            cursor: pointer;

            .iconfont {
              font-size: 20px;
            }

            &:hover {
              color: #1296db;
            }

            &.on {
              color: #1296db;
            }
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
    }
  }

  @include notphone {
    .content {
      display: flex;

      .users {
        flex: 2;
        flex-wrap: nowrap;
        flex-direction: row-reverse;
        overflow-y: auto;
        border: 1px solid $line-color;

        .smallWindowBar {
          display: none;
        }
      }

      .panel {
        flex: 5;
        flex-wrap: nowrap;
        flex-direction: row-reverse;
      }
    }
  }

  @include phone {
    .header {
      display: none;
    }

    .content {
      .users {
        display: flex;
        overflow-x: auto;
        flex-direction: row; // padding-left: 160px;
        box-sizing: border-box;
        overflow-x: auto;
        border-bottom: 1px solid $line-color;

        .smallWindowBar {
          position: absolute;
          right: 0px;
          background-color: white;
          z-index: 2;
          text-align: center;
          line-height: 60px;
          display: inline-block;
          width: 60px;
        }

        .user {
          margin: 0px 5px;
          border-bottom: none;

          &:last-child {
            margin-right: 100px;
          }

          &.on {
            padding-right: 120px;
            background-color: $bg-header;

            .name {
              display: block !important;
              color: $border-color1;
              width: 75px;
            }

            .order {
              display: block !important;
              color: $border-color1;
              width: 75px;
            }

            .el-icon-close {
              display: block;
            }
          }

          .name {
            display: none;
          }

          .order {
            display: none;
          }

          .el-icon-close {
            display: none;
          }
        }
      }
    }
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

.c2cchat .emoji-menu {
  bottom: 120px !important;
  position: fixed;
}
</style>
