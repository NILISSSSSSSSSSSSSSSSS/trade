<template>
  <div style="height: 100%">
    <!--引入主题样式-->
    <link rel="stylesheet" :href='themeLink' >
    <MyHeader></MyHeader>
    <nuxt/>
    <MyFooter></MyFooter>
  </div>
</template>

<script>
import MyFooter from '~/components/Footer.vue'
import MyHeader from '~/components/Header.vue'
import { getServiceCookie } from '@/tools/cookie'
export default {
  components: {
    MyFooter,
    MyHeader
  },
  computed: {
    themeLink() {
      let theme = '' // this.$store.common.themes.find(x => x.name === this.$store.curTheme)
      return theme ? theme.url : "";
    }
  },
  mounted () {
    let _this = this
    if (process.browser) {
      window.addEventListener('popstate', function () {
        window.location.href = window.location.href.split('?')[0] + '?lang=' + _this.lang
      })
    }
  }
}
</script>
