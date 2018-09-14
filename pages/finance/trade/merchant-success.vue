<template>
  <div class="merchant-success">
    <merchant-wrap
      :type="'success'"></merchant-wrap>
  </div>
</template>

<script>
import MerchantWrap from "@/components/trade/merchantWrap";

export default {
  components: {
    MerchantWrap
  }
};
</script>

<style lang="scss" scoped>
.hint {
  margin-top: 40px;
}
</style>
