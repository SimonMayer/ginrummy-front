<template>
  <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width="48"
      height="48"
      :fill="fillColor"
      :stroke="strokeColor"
      stroke-width="1"
      stroke-linecap="round"
      stroke-linejoin="round"
  >
    <IconCard :x="7" :y="0" :rotationAngle="90"/>
    <IconCard :x="7" :y="3" :rotationAngle="90"/>
    <IconCard :x="7" :y="6" :rotationAngle="90"/>
    <IconCard :x="16" :y="12" :fillColor="fillColor" :strokeColor="sharpIndicatorColor"/>

    <IconArrow :color="strongIndicatorColor" :rotationAngle="10" :tipCoordinateX="19" :tipCoordinateY="15"/>
  </svg>
</template>

<script>
import IconArrow from '@/components/SvgIcons/IconArrow.vue';
import IconCard from '@/components/SvgIcons/IconCard.vue';

export default {
  components: {IconArrow, IconCard},
  props: {
    fillColor: {
      type: String,
      required: true,
    },
    strokeColor: {
      type: String,
      required: true,
    },
    strongIndicatorColor: {
      type: String,
      required: true,
    },
    sharpIndicatorColor: {
      type: String,
      required: true,
    },
  },
};
</script>
