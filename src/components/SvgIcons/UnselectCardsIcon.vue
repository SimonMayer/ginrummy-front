<template>
  <svg
      :class="[{ active: active, disabled: !active }]"
      stroke-linecap="round"
      stroke-linejoin="round"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
  >
    <IconCard :active="active" :rotationAngle="-8" :x="3" :y="6"/>
    <IconCard :active="active" :reverse="true" :rotationAngle="-4" :x="6" :y="2"/>
    <IconCard :active="active" :reverse="true" :rotationAngle="0" :x="9" :y="2"/>
    <IconCard :active="active" :rotationAngle="4" :x="11" :y="6"/>
    <IconCard :active="active" :reverse="true" :rotationAngle="8" :x="14" :y="3"/>
    <IconCard :active="active" :rotationAngle="12" :x="17" :y="8"/>

    <g>
      <circle class="cancel-circle" cx="16" cy="18" r="10"/>
      <line class="cancel-cross-line" x1="12" x2="20" y1="14" y2="22"/>
      <line class="cancel-cross-line" x1="20" x2="12" y1="14" y2="22"/>
    </g>
  </svg>
</template>

<script>
import IconCard from '@/components/SvgIcons/IconCard.vue';

export default {
  components: {IconCard},
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

.cancel-circle {
  fill-opacity: 0.8;
  stroke-width: 1;
}

.cancel-cross-line {
  stroke-width: 2;
}

.active {
  .cancel-circle {
    fill: color.$secondary;
  }

  .cancel-circle,
  .cancel-cross-line {
    stroke: color.$accent;
  }
}

.disabled {
  .cancel-circle {
    fill: color.$muted-light;
  }

  .cancel-circle,
  .cancel-cross-line {
    stroke: color.$muted-mid;
  }
}
</style>
