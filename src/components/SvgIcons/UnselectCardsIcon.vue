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
        cy="19"
        fill-opacity="0.8"
        r="10"
        stroke-width="1"
    />
    <line :stroke="sharpIndicatorColor" stroke-width="2" x1="12" x2="20" y1="15" y2="23"/>
    <line :stroke="sharpIndicatorColor" stroke-width="2" x1="20" x2="12" y1="15" y2="23"/>
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
