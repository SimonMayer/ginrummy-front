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
@use '@/assets/core/responsive/mixins' as responsive;
@use '@/assets/core/spacing/variables' as spacing;
@use '@/assets/core/typography/variables' as typography;

$baseWidth: 80px;
.score-board {
  text-align: right;
  padding: var(--spacing-padding-standard);
  background-color: rgba(color.$secondary, 0.5);
  border-radius: decorative.$border-radius;
  box-shadow: decorative.$box-shadow-1-very-light;

  @include responsive.breakpoint(large) {
    width: $baseWidth;
  }

  @include responsive.breakpoint(medium) {
    width: $baseWidth * 0.875;
  }

  @include responsive.breakpoint(small) {
    width: $baseWidth * 0.75;
  }

  .label {
    font-size: var(--typography-font-size-small);
    color: color.$muted-light;
    margin-bottom: var(--spacing-margin-tiny);
  }

  .total,
  .turn {
    color: color.$tertiary;
    font-size: var(--typography-font-size-large);
    font-weight: bold;
  }

  .total {
    margin-bottom: var(--spacing-margin-half);
  }
}
</style>
