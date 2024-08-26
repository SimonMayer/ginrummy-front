<template>
  <svg
      :class="[{ active: active, disabled: !active }]"
      stroke-linecap="round"
      stroke-linejoin="round"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
  >
    <IconCard :active="active" :rotationAngle="90" :x="7" :y="0"/>
    <IconCard :active="active" :rotationAngle="90" :x="7" :y="3"/>
    <IconCard :active="active" :rotationAngle="90" :x="7" :y="6"/>
    <IconCard :active="active" :highlight="true" :x="16" :y="12"/>

    <IconArrow :active="active" :rotationAngle="10" :tipCoordinateX="19" :tipCoordinateY="15"/>
  </svg>
</template>

<script>
import IconArrow from '@/components/SvgIcons/IconArrow.vue';
import IconCard from '@/components/SvgIcons/IconCard.vue';

export default {
  components: {IconArrow, IconCard},
  props: {
    active: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
