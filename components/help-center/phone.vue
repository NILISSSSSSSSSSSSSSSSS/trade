<template>
  <div class="help-center-phone">
    <template v-if="!HIDE_HELP_CENTER_TITLE">
      <el-input class="search">
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <el-collapse v-model="activeName" accordion>
        <el-collapse-item :title="tag.title" :name="index" v-for="(tag, index) in articles" :key="index">
          <div v-for="article in tag.articles" :key="article._id" @click="toDetail(article._id)">{{article.title}}</div>
        </el-collapse-item>
      </el-collapse>
    </template>
    
    <nuxt-child v-if="HIDE_HELP_CENTER_TITLE"></nuxt-child>
  </div>
</template>

<script>
import {mapActions, mapState} from 'vuex'
export default {
  props: {
    articles: Array,
    hotWord: Array
  },
  data () {
    return {
      activeName: 0
    }
  },
  computed: {
    ...mapState({
      HIDE_HELP_CENTER_TITLE: state => state.help_center.HIDE_HELP_CENTER_TITLE
    })
  },
  methods: {
    toDetail (id) {
      this.$router.push(`/help-center/${id}?lang=${this.$i18n.locale}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.help-center-phone{
  margin-top: 10px;
  .el-collapse{
    border-top: 0;
  }
}
</style>

