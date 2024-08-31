<template>
  <div :class="['card', 'hidden-card', 'backing', { tile: tileMode, bridge: !tileMode}]"></div>
</template>

<script>
export default {
  name: 'HiddenCard',
  props: {
    tileMode: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/cards/styles';
@import '@/assets/cards/backing';
</style>
