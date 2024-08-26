<template>
  <svg
      :class="[{ active: active, disabled: !active }]"
      stroke-linecap="round"
      stroke-linejoin="round"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
  >
    <IconCard :active="active" :rotationAngle="90" :x="10" :y="-1"/>
    <IconCard :active="active" :rotationAngle="90" :x="10" :y="2"/>
    <IconCard :active="active" :rotationAngle="90" :x="10" :y="5"/>
    <IconCard :active="active" :rotationAngle="90" :x="10" :y="8"/>
    <IconCard :active="active" :highlight="true" :rotationAngle="90" :x="13" :y="15"/>

    <IconArrow :active="active" :rotationAngle="180" :tipCoordinateX="25" :tipCoordinateY="27"/>
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
