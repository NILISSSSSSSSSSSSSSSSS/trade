<template>
  <div class="no-data-component">{{$t('common.nodata')}}</div>
</template>

<script>
export default {
  name: 'no-data'
}
</script>

<style lang="scss" scoped>
.no-data-component {
  margin-top: 10px;
  text-align: center;
  @include fontsize('small');
  color: $font-color2;
}
</style>

