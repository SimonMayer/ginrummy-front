<template>
  <svg
      :class="[{ active: active, disabled: !active }]"
      stroke-linecap="round"
      stroke-linejoin="round"
      viewBox="0 0 50 50"
      xmlns="http://www.w3.org/2000/svg"
  >
    <g class="letter">
      <polygon id="letter-i-dot-outline" class="outline" points="23,7 28,7 28,13 22,13"/>
      <polygon
          id="letter-i-main-outline"
          class="outline"
          points="20.5,15 28,15 28,36 31,37 31,41 19,41 19,37 22,36 22,20 19,19"
      />
      <polygon id="letter-i-dot" points="24,8 27,8 27,12 23,12"/>
      <polygon id="letter-i-main" points="21.5,16 27,16 27,37 30,38 30,40 20,40 20,38 23,37 23,19 20,18"/>
    </g>
  </svg>
</template>

<script>
export default {
  props: {
    active: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
@use '@/assets/core/color/variables' as color;

.letter {
  fill-opacity: 0.8;
  stroke-width: 1;

  .outline {
    stroke-width: 0.5;
    fill: none;
  }
}

.active {
  .letter {
    fill: color.$secondary;
    stroke: color.$accent;

    .outline {
      stroke: color.$secondary;
    }
  }
}

.disabled {
  .letter {
    fill: color.$muted-light;
    stroke: color.$muted-mid;

    .outline {
      stroke: color.$muted-light;
    }
  }
}
</style>
