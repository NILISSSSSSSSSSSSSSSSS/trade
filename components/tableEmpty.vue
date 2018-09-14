<template>
  <div>
    <nuxt-link :to="$i18n.path(`/user/login?returnurl=${encodeURIComponent($route.path)}`)" class="font-blue" v-if="!token">{{ $t('el.table.emptyTip') }}</nuxt-link>
    <span v-else>{{ $t('el.table.emptyText') }}</span>
  </div>
</template>

<script>
  import { getCookie } from '@/tools/cookie'
  export default{
    data () {
      return {
        token: null
      }
    },
    mounted() {
      if (getCookie('token') && getCookie('token') !== '') {
        this.token = getCookie('token')
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
