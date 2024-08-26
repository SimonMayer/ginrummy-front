<template>
  <svg
      :class="[{ active: active, disabled: !active }]"
      stroke-linecap="round"
      stroke-linejoin="round"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
  >
    <rect :height="18" :rx="2" :ry="2" :width="18" class="play-area" x="2" y="3"/>

    <IconArrow :active="active" :rotationAngle="20" :tipCoordinateX="4" :tipCoordinateY="8"/>

    <IconCard :active="active" :rotationAngle="-8" :x="9" :y="11"/>
    <IconCard :active="active" :rotationAngle="-2" :x="13" :y="11"/>
    <IconCard :active="active" :rotationAngle="4" :x="17" :y="12"/>
  </svg>
</template>

<script>
import IconArrow from '@/components/SvgIcons/IconArrow.vue';
import IconCard from '@/components/SvgIcons/IconCard.vue';

export default {
  components: {IconCard, IconArrow},
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

.play-area {
  fill-opacity: 0.8;
  stroke-dasharray: 2;
}

.active {
  .play-area {
    fill: color.$white;
    stroke: color.$accent;
  }
}

.disabled {
  .play-area {
    fill: color.$muted-light;
    stroke: color.$muted-mid;
  }
}
</style>
