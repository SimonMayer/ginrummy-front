<template>
  <div class="corner">
    <div>{{ rank }}</div>
    <div>{{ suit }}</div>
  </div>
</template>

<script>
export default {
  name: 'CardCorner',
  props: {
    rank: {
      type: String,
      required: true,
    },
    suit: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
@use '@/assets/cards/variables' as card;

.corner {
  position: absolute;
  width: card.$corner-width;
  font-size: card.$corner-font-size;
}
</style>
