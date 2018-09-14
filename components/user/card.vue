<template>
  <div class="login">
    <div class="card">
      <div class="hidden-sm-and-down img"><img :src="require('@/assets/img/login.png')" alt=""></div>
      <div class="form">
          <slot name="content"></slot>
      </div>
    </div>
  </div>
</template>
<script>
import MyButton from '@/components/Button'
export default {
  components: {
    MyButton
  },
  data () {
    return {
      phone: {
        number: ''
      },
      agreen: false
    }
  }
}
</script>
<style lang="scss" scoped>
.login{
  height: 100%;
  display: flex;
  width: 100%;
  align-items: center;
  margin: 0 auto;
  .card{
    min-height: 400px;
    @include pc{
      width: 1000px;
      padding: 37px 88px;
    }
    @include pad{
      max-width: 1000px;
      width: 70%
    }
    @include phone{
      width: 70%
    }
    background-color: $bg-white;
    padding: 37px;
    border-radius: $radius;
    display: flex;
    .img{
      flex: 1;
      margin-right: 75px;
      display: flex;
      align-items: center;
      img{
        max-width: 375px;
        width: 100%;
      }
    }
    .form{ 
      flex: 1;
      .title{
        @include fontsize('title2');
        color: $font-color2;
      }
    }
  }
}
</style>



