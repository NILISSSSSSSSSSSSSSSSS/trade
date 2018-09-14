<template>
  <div class="help-center container">
    <helpCenterPc class="pc" :articles="tags" :hotWord="hotWord">
    </helpCenterPc>
    <helpCenterPhone class="phone" :articles="tags" :hotWord="hotWord"></helpCenterPhone>
  </div>
</template>

<script>
import {getTags} from '@/apis/help-center'
import helpCenterPc from '@/components/help-center/pc.vue'
import helpCenterPhone from '@/components/help-center/phone.vue'
import helpCenterMixin from '@/mixins/help-center/index'
import {mapState, mapMutations} from 'vuex'
export default {
  async asyncData({app, store, params, os, req}) {
    let lang = store.state.lang.symbol.toUpperCase()
    let articles = await getTags(lang)
    if (articles.success) {
      store.commit('help_center/SET_TAGS', articles.data)
      if (!params.id && !os.phone) {
        app.i18n.push(`/help-center/${articles.data[0].articles[0]._id}`)
      }
    }
  },
  components: {
    helpCenterPc,
    helpCenterPhone
  },
  computed: {
    ...mapState({
      tags: state => state.help_center.tags
    })
  },
  data () {
    return {
      hotWord: ['C2C', '比特币']
    }
  },
  methods: {
    ...mapMutations('help_center', ['SET_TAGS'])
  }
}
</script>

<style lang="scss" scoped>
.help-center{
  @include pc{
    .pc{
      display: block;
    }
    .phone{
      display: none;
    }
  }
  @include pad{
    .pc{
      display: block;
    }
    .phone{
      display: none;
    }
  }
  @include phone{
    .pc{
      display: none;
    }
    .phone{
      display: block;
    }
  }
}
</style>

