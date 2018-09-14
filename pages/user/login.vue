<template>
  <div class="loginPage container" :style="`backgroundImage: url(${require('@/assets/img/userBg.png')})`">
    <MyLogin></MyLogin>
  </div>
</template>

<script>
import MyLogin from '~/components/user/login'
export default {
  components: {
    MyLogin
  }
}
</script>

<style lang="scss" scoped>
.loginPage{
  background-color: #10172A;
  display: flex;
  align-items: center;
  justify-content: center;
  background-size: cover;
}
</style>
