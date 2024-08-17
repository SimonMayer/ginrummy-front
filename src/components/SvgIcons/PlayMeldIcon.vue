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
    <!-- Faint placeholder for the meld -->
    <rect :fill="fillColor" :height="18"
          :rx="2" :ry="2"
          :stroke="sharpIndicatorColor" :width="18"
          fill-opacity="0.8" stroke-dasharray="2"
          x="2" y="4"
    />

    <IconArrow :color="strongIndicatorColor" :rotationAngle="20" :tipCoordinateX="4" :tipCoordinateY="8"/>

    <IconCard :rotationAngle="-8" :x="9" :y="12"/>
    <IconCard :rotationAngle="-2" :x="13" :y="12"/>
    <IconCard :rotationAngle="4" :x="17" :y="13"/>
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
