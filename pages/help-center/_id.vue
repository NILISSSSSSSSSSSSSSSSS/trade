<template>
  <div class="article-detail">
    <div class="article-detail-content" v-if="content && content.context.length > 0">{{content.context[0].str}}</div>
    <div class="back" @click="toFolder"><i class="iconfont icon-back1"></i></div>
  </div>
</template>

<script>
import {mapActions, mapState} from 'vuex'
import {getArticle} from '@/apis/help-center'
export default {
  name: 'articleDetail',
  async asyncData ({params, app, store}) {
    let id = params.id
    let lang = store.state.lang.symbol.toUpperCase()
    if (id) {
      let result = await getArticle(id, lang)
      if (result.success) {
        store.commit('help_center/SET_CONTENT', result.data)
      } else {
        store.commit('help_center/SET_CONTENT', null)
      }
    }
  },
  computed: {
    ...mapState({
      HIDE_HELP_CENTER_TITLE: state => state.help_center.HIDE_HELP_CENTER_TITLE,
      content: state => state.help_center.content
    })
  },
  watch: {
    '$route.params.id': {
      async handler (val) {
        // if (val) {
        //   let result = await getArticle(val, 'ZH-CN')
        //   if (result.success) {
        //     this.content = result.data
        //   }
        // }
        val && this.SET_HIDE_HELP_CENTER_TITLE(true)
        !val && this.SET_HIDE_HELP_CENTER_TITLE(false)
      }
    }
  },
  methods: {
    ...mapActions('help_center', ['SET_HIDE_HELP_CENTER_TITLE']),
    toFolder () {
      this.$router.push(`/help-center?lang=${this.$i18n.locale}`)
    }
  },
  mounted() {
    console.log('enter mounted')
  },
  created() {
    this.$route.params.id && this.SET_HIDE_HELP_CENTER_TITLE(true)
  },
  destroyed() {
    this.SET_HIDE_HELP_CENTER_TITLE(false)
  }
}
</script>

<style lang="scss" scoped>
.article-detail{
  .back{
    background-color: $primary;
    position: fixed;
    right: 20px;
    bottom: 20px;
    height: 40px;
    width: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    box-shadow: 0px 2px 5px 1px #BFBFBF;
    .iconfont{
      color: $font-color1;
    }
    @include notphone{
      display: none
    }
  }
}
</style>

