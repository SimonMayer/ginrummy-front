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
    <!-- Faint placeholder for the meld -->
    <rect x="2" y="4"
          :width="18" :height="18"
          :rx="2" :ry="2"
          :fill="fillColor" fill-opacity="0.8"
          :stroke="sharpIndicatorColor" stroke-dasharray="2"
    />

    <IconArrow :color="strongIndicatorColor" :rotationAngle="20" :tipCoordinateX="4" :tipCoordinateY="8"/>

    <IconCard :x="9" :y="12" :rotationAngle="-8"/>
    <IconCard :x="13" :y="12" :rotationAngle="-2"/>
    <IconCard :x="17" :y="13" :rotationAngle="4"/>
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
