<template>
<footer class="footer">
  <h1>{{$t('footer.name')}}</h1>
  <div class="summary">{{$t('footer.desc')}}
  </div>
  <el-row :gutter="20" class="links">
    <el-col :lg="8" :md="24" :sm="24">
      <span class="title">{{$t('footer.customerService')}}
      </span>
      <a class="link" to="">{{$t('footer.helperCenter')}}</a>
      <span class="split">|</span>
      <a class="link" :href="$t('footer.appLink')">{{$t('footer.app')}}</a>
      <span class="split">|</span>
      <a class="link" :href="$t('footer.serviceLink')">{{$t('footer.service')}}</a>
    </el-col>
    <el-col class="right" :lg="8" :md="24" :sm="24">
      <span class="title">{{$t('footer.aboutUs')}}
      </span>
      <a class="link" :href="$t('footer.whitePaperLink')">{{$t('footer.whitePaper')}}</a>
      <span class="split">|</span>
      <a class="link" :href="$t('footer.aboutUsLink')">{{$t('footer.aboutUs')}}</a>
    </el-col>
    <el-col class="right" :lg="8" :md="24" :sm="24">
      <span class="title">{{$t('footer.group')}}
      </span>
      <a class="link" :href="$t('footer.telegramLink')">Telegram</a>
    </el-col>
  </el-row>
</footer>
</template>

<style lang="scss" scoped>
.footer {
  @include phone{
    display: none;
  }
  background-color: $bg-header;
  padding: 30px $space;
  box-sizing: border-box;
  h1 {
    color: $font-color1;
    @include fontsize('title1');
  }
  .summary {
    color: $font-color1;
    @include fontsize('content3');
    margin-top: $space;
    margin-bottom: $space;
    line-height: 25px;
  }
  .links {
    background-color: $bg-header;
    width: 100%;
    .title {
      color: $font-color1;
      @include fontsize('content2');
    }
    .split {
      color: $font-color5;
    }
    .link {
      padding: 10px;
      display: inline-block;
      color: $font-color5 !important;
      @include fontsize('content3');
      cursor: pointer;
      background-color:none !important;
    }
  }
}
</style>
