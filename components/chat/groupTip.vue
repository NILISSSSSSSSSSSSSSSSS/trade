<template>
  <el-badge v-show="!openChat" :value="newMsgCount | chatMsgCount" :hidden="newMsgCount==0" class="group-chat-tip" @click.native="OPEN_CHAT(true)">
    <el-button type="primary">聊天室</el-button>
  </el-badge>
</template>

<script>
import { mapMutations, mapState, mapActions } from 'vuex'
export default {
  name: 'group-chat-tip',
  methods: {
    ...mapActions('group_chat', ['OPEN_CHAT'])
  },
  computed: {
    ...mapState({
      openChat: state => state.group_chat.openChat,
      newMsgCount: state => state.group_chat.newMsgCount
    })
  }
}
</script>

<style lang="scss" scoped>
.group-chat-tip {
  position: fixed;
  right: 30px;
  bottom: 0px;
  z-index: 2;
}
</style>
