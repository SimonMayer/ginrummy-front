<template>
  <svg
      :fill="fillColor"
      :stroke="strokeColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
  >
    <IconCard :rotationAngle="-8" :x="3" :y="6"/>
    <IconCard :fill="strokeColor" :rotationAngle="-4" :strokeColor="fillColor" :x="6" :y="2"/>
    <IconCard :fill="strokeColor" :rotationAngle="0" :strokeColor="fillColor" :x="9" :y="2"/>
    <IconCard :rotationAngle="4" :x="11" :y="6"/>
    <IconCard :fill="strokeColor" :rotationAngle="8" :strokeColor="fillColor" :x="14" :y="3"/>
    <IconCard :rotationAngle="12" :x="17" :y="8"/>

    <circle
        :fill="strongIndicatorColor"
        :stroke="sharpIndicatorColor"
        cx="16"
        cy="18"
        fill-opacity="0.8"
        r="10"
        stroke-width="1"
    />
    <line :stroke="sharpIndicatorColor" stroke-width="2" x1="12" x2="20" y1="14" y2="22"/>
    <line :stroke="sharpIndicatorColor" stroke-width="2" x1="20" x2="12" y1="14" y2="22"/>
  </svg>
</template>

<script>
import IconCard from '@/components/SvgIcons/IconCard.vue';

export default {
  components: {IconCard},
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
