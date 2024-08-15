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
    <IconCard :x="3" :y="5" :rotationAngle="-8"/>
    <IconCard :x="7" :y="5" :rotationAngle="-2"/>
    <IconCard :x="12" :y="6" :rotationAngle="4"/>
    <IconCard :x="17" :y="13" :rotationAngle="10" :fillColor="fillColor" :strokeColor="sharpIndicatorColor"/>

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
