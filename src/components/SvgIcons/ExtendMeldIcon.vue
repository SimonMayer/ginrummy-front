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
    <IconCard :rotationAngle="-8" :x="3" :y="5"/>
    <IconCard :rotationAngle="-2" :x="7" :y="5"/>
    <IconCard :rotationAngle="4" :x="12" :y="6"/>
    <IconCard :fillColor="fillColor" :rotationAngle="10" :strokeColor="sharpIndicatorColor" :x="17" :y="13"/>

    <IconArrow :color="strongIndicatorColor" :rotationAngle="10" :tipCoordinateX="21" :tipCoordinateY="17"/>
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
