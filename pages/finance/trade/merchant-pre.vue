<template>
  <div class="merchant-pre">
    <merchant-wrap
      :type="'pre'"></merchant-wrap>
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
