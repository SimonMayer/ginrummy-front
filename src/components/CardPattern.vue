<template>
  <div class="pattern">
    <div v-for="n in suitRepeat" :key="n" class="suit-symbol">{{ suitEmoji }}</div>
  </div>
</template>

<script>
export default {
  name: 'CardPattern',
  props: {
    suitEmoji: {
      type: String,
      required: true,
    },
    suitRepeat: {
      type: Number,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
@use '@/assets/cards/variables' as card;
@import '@/assets/cards/facePatterns';

.pattern {
  position: absolute;
  top: card.$pattern-indentation-size;
  bottom: card.$pattern-indentation-size;
  left: card.$pattern-indentation-size;
  right: card.$pattern-indentation-size;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(16, 1fr);
  justify-content: center;
  justify-items: center;
  align-items: center;

  .suit-symbol {
    font-size: card.$pattern-font-size;
  }
}
</style>
