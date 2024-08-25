<template>
  <svg
      :class="[{ active: active, disabled: !active }]"
      stroke-linecap="round"
      stroke-linejoin="round"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
  >
    <IconCard :active="active" :rotationAngle="-8" :x="3" :y="3"/>
    <IconCard :active="active" :rotationAngle="-2" :x="7" :y="3"/>
    <IconCard :active="active" :rotationAngle="4" :x="12" :y="4"/>
    <IconCard :active="active" :rotationAngle="10" :x="17" :y="11" :highlight="true"/>

    <IconArrow :active="active" :rotationAngle="10" :tipCoordinateX="21" :tipCoordinateY="15"/>
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
