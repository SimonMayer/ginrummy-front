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
@use '@/assets/core/color/variables' as color;
@use '@/assets/core/decorative/variables' as decorative;
@use '@/assets/core/spacing/variables' as spacing;
@use '@/assets/core/typography/variables' as typography;

.score-board {
  text-align: right;
  width: 120px;
  padding: spacing.$padding-standard;
  background-color: rgba(color.$secondary, 0.5);
  border-radius: decorative.$border-radius;
  box-shadow: decorative.$box-shadow-1-very-light;

  .label {
    font-size: typography.$font-size-small;
    color: color.$muted-light;
    margin-bottom: spacing.$margin-tiny;
  }

  .total,
  .turn {
    color: color.$tertiary;
    font-size: typography.$font-size-large;
    font-weight: bold;
  }

  .total {
    margin-bottom: spacing.$margin-half;
  }
}
</style>
