<template>
  <div class="help-center">
    <div class="header">
      <h1>Q帮助中心</h1>
      <el-input class="search">
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <div class="hot">
        <span class="hot-title">热点搜索</span>
        <span class="word" v-for="(item, index) in hotWord" :key="index">{{item}}</span>
      </div>
    </div>
    <div class="content">
      <div class="aside">
        <div class="tag" v-for="(tag, index) in articles" :key="index" :class="{'selectTag': selectTagIndex === index}">
          <div class="tagTitle" @click="selectTagIndex = index" >{{tag.title}}</div>
          <div class="articleTitle" v-for="article in tag.articles" :key="article._id" @click="toDetail(article._id)">{{article.title}}</div>
        </div>
      </div>
      <div class="detail"><nuxt-child /></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    articles: Array,
    hotWord: Array
  },
  data () {
    return {
      selectTagIndex: 0
    }
  },
  methods: {
    toDetail (id) {
      this.$router.push(`/help-center/${id}?lang=${this.$i18n.locale}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.help-center{
  margin-top: 10px;
  color: $font-color2;
  @include fontsize('content3');
  .header{
    display: flex;
    padding: 15px 25px;
    background-color: $line-color;
    h1{
      @include fontsize('title');
      margin-right: 45px;
      font-weight: normal;
    }
    .search{
      width: 457px;
      @include pad{
        width: 40%
      }
    }
    .hot{
      margin-left: 35px;
      display: flex;
      align-items: center;
      .hot-title{
        margin-right: 20px;
      }
      .word{
        color: $font-color8;
        line-height: 16px;
        padding: 0 10px;
        border-right: 1px solid $font-color1;
        &:nth-last-of-type(1){
          border: 0;
        }
      }
    }
  }
  .content{
    display: flex;
    .aside{
      width: 200px;
      .tag{
        text-align: center;
        .tagTitle{
          height: 60px;
          line-height: 60px;
          background-color: $line-color;
          color: $font-color2;
          @include fontsize('content1');
          margin-top: 1px;
          cursor: pointer;
        }
        .articleTitle{
          background-color: $line-color;
          margin-top: 1px;
          height: 35px;
          line-height: 35px;
          display: none;
          cursor: pointer;
        }
      }
      .selectTag{
        .tagTitle{
          background-color: $primary;
          color: $font-color1;
        }
        .articleTitle{
          display: block;
        }
      }
    }
    .detail{
      width: 100%;
      padding: 26px 40px;
    }
  }
}
</style>

