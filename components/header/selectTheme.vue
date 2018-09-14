<template>
<div v-if="size==='big'" class="theme-select-big">
  <!-- <a href="javascript:;" class="theme">{{$t('header.theme')}}
  </a> -->
  <div class="label" @click="changeTheme(item)" v-for="item in supportTheme" :key="item.name" :class="`${curTheme===item.name?'on':''}`">{{item.name==='light'?'☽':'☼'}}</div>
</div>
<div class="nav theme-select-small" v-else>
  <a href="javascript:;" @click="toogleTheme">{{$t('header.theme')}}{{$t(`header.theme_${curTheme}`)}}<i :class="openTheme?'el-icon-caret-bottom':'el-icon-caret-top'"></i></a>
  <div class="theme" :class="openTheme?'on':''">
    <a href="javascript:;" v-for="item in supportTheme" :key="item.name" @click="changeTheme(item)">
      <div class="label" :class="item.name==='light'?'bg-white':'bg-header'"></div>
      <div class="name">{{$t(`header.theme_${item.name}`)}}</div>
    </a>
  </div>
</div>
</template>

<script>
import {
  mapState,
  mapActions
} from 'vuex'
export default {
  props: {
    size: {
      type: String,
      default: 'big'
    }
  },
  data() {
    return {
      openTheme: false
    }
  },
  computed: {
    ...mapState({
      supportTheme: state => state.common.siteInfo.themes,
      curTheme: state => state.curTheme
    })
  },
  methods: {
    ...mapActions(['CHANGE_THEME']),
    toogleTheme() {
      this.openTheme = !this.openTheme
    },
    changeTheme(item) {
      this.CHANGE_THEME(item.name)
      this.openTheme = false
      if (this.size === 'small') {
        this.$emit('onSelect')
      }
    }
  },
  watch: {
    supportTheme() {
      debugger
    }
  }
}
</script>

<style lang="scss" scoped>
.theme-select-big {
  @include pc {
    padding: 0 17px;
  }
  @include pad {
    padding: 0 10px;
  }
  position: relative;
  .theme {
    @include fontsize("content3");
  }
  .label {
    height: 16px;
    width: 16px;
    border: 1px solid gray;
    display: inline-block;
    margin-bottom: -5px;
    line-height: 1;
    text-align: center;
    cursor: pointer;
    &.on {
      background-color: gray;
    }
  }
}

.theme-select-small {
  .theme {
    height: 0px;
    transform: scale(0, 0);
    transition: all 0.5s;
    @include fontsize("content3");
    >a {
      position: relative;
    }
    &.on {
      height: 100px;
      transform: scale(1, 1) !important;
    }
    .label {
      position: absolute;
      top: 11px;
      height: 14px;
      width: 14px;
      border: 1px solid black;
    }
    .name {
      display: inline-block;
      height: 18px;
      line-height: 18px;
      margin-left: 25px;
    }
  }
}
</style>
