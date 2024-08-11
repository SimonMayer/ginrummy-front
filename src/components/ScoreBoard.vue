<template>
  <div v-if="totalScore !== null" class="score-board">
    <div class="label">Total score</div>
    <div class="total">{{ totalScore }}</div>
    <div v-if="roundScore !== null" class="label">This round</div>
    <div v-if="roundScore !== null" class="turn">{{ roundScore }}</div>
  </div>
</template>

<script>
export default {
  name: 'ScoreBoard',
  props: {
    totalScore: {
      type: Number,
      required: false,
    },
    roundScore: {
      type: Number,
      required: false,
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/globalVariables';

.score-board {
  text-align: right;
  width: 120px;
  padding: var(--base-padding);
  background-color: rgba(var(--secondary-color-rgb), 0.5);
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow-1-very-light);

  .label {
    font-size: var(--font-size-small);
    color: var(--muted-color);
    margin-bottom: calc(var(--base-margin) * 0.2);
  }

  .total,
  .turn {
    color: var(--accent-color);
    font-size: var(--font-size-large);
    font-weight: bold;
  }

  .total {
    margin-bottom: calc(var(--base-margin) * 0.5);
  }
}
</style>
