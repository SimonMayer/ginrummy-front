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
    <IconCard :x="10.1" :y="5.5" :rotationAngle="90"/>
    <IconCard :x="9.8" :y="5" :rotationAngle="90"/>
    <IconCard :x="9.5" :y="4.5" :rotationAngle="90"/>
    <IconCard :x="9.2" :y="4" :rotationAngle="90"/>
    <IconCard :x="8.9" :y="3.5" :rotationAngle="90"/>
    <IconCard :x="8.6" :y="3" :rotationAngle="90"/>
    <IconCard :x="13" :y="12" :rotationAngle="90" :fillColor="fillColor" :strokeColor="sharpIndicatorColor"/>

    <IconArrow :color="strongIndicatorColor" :rotationAngle="180" :tipCoordinateX="25" :tipCoordinateY="25"/>
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
