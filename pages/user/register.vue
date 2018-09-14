<template>
  <div class="registerPage container" :style="`backgroundImage: url(${require('@/assets/img/userBg.png')})`">
    <MyRegister></MyRegister>
  </div>
</template>

<script>
import MyRegister from '~/components/user/register'
export default {
  components: {
    MyRegister
  }
}
</script>

<style lang="scss" scoped>
.registerPage{
  background-color: #10172A;
  display: flex;
  align-items: center;
  justify-content: center;
  background-size: cover;
}
</style>

