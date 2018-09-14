<template>
  <el-dialog class="chat-big-pic" title="" :visible.sync="show" :modal="false" :before-close="HIDE_BIG_PIC">
    <img :src="url" />
  </el-dialog>
</template>

<script>
import { mapMutations, mapState } from 'vuex'
export default {
  computed: {
    ...mapState({
      show: state => state.group_chat.showBigPic,
      url: state => state.group_chat.bigPicUrl
    })
  },
  methods: {
    ...mapMutations('group_chat', ['HIDE_BIG_PIC'])
  }
}
</script>

<style lang="scss" scoped>
.chat-big-pic {
  img {
    width: 100%;
    max-height: 70vh;
  }
}
</style>
