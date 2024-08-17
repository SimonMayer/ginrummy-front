<template>
  <svg
      :fill="fillColor"
      :stroke="strokeColor"
      height="48"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1"
      viewBox="0 0 32 32"
      width="48"
      xmlns="http://www.w3.org/2000/svg"
  >
    <IconCard :rotationAngle="90" :x="10" :y="0"/>
    <IconCard :rotationAngle="90" :x="10" :y="3"/>
    <IconCard :rotationAngle="90" :x="10" :y="6"/>
    <IconCard :fillColor="fillColor" :rotationAngle="90" :strokeColor="sharpIndicatorColor" :x="13" :y="13"/>
    <IconCard :fillColor="fillColor" :rotationAngle="90" :strokeColor="sharpIndicatorColor" :x="13" :y="16"/>

    <IconArrow :color="strongIndicatorColor" :rotationAngle="180" :tipCoordinateX="25" :tipCoordinateY="28"/>
  </svg>
</template>

<script>
import IconArrow from '@/components/SvgIcons/IconArrow.vue';
import IconCard from '@/components/SvgIcons/IconCard.vue';

export default {
  components: {IconCard, IconArrow},
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
