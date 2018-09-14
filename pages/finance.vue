<template>
<div class="container">
  <el-row :gutter="20">
    <el-col :lg="4" :md="24" :sm="24">
      <FinanceSide active="1-1"></FinanceSide>
    </el-col>
    <el-col class="right" :lg="20" :md="24" :sm="24">
      <nuxt-child />
    </el-col>
  </el-row>
</div>
</template>

<script>
import FinanceSide from "@/components/FinanceSide"
export default {
  middleware: ["userAuth"],
  components: {
    FinanceSide
  }
}
</script>

<style lang="scss" scoped>
.container {
  .right {
    padding-top: 30px;
    padding-bottom: 16px;
  }
}
</style>
