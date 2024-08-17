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
    <IconCard :x="3" :y="6" :rotationAngle="-8"/>
    <IconCard :x="6" :y="2" :rotationAngle="-4" :fill="strokeColor" :strokeColor="fillColor"/>
    <IconCard :x="9" :y="2" :rotationAngle="0" :fill="strokeColor" :strokeColor="fillColor"/>
    <IconCard :x="11" :y="6" :rotationAngle="4"/>
    <IconCard :x="14" :y="3" :rotationAngle="8" :fill="strokeColor" :strokeColor="fillColor"/>
    <IconCard :x="17" :y="8" :rotationAngle="12"/>

    <circle cx="16" cy="19" r="10"
            :fill="strongIndicatorColor" fill-opacity="0.8"
            :stroke="sharpIndicatorColor" stroke-width="1"
    />
    <line x1="12" y1="15" x2="20" y2="23" :stroke="sharpIndicatorColor" stroke-width="2"/>
    <line x1="20" y1="15" x2="12" y2="23" :stroke="sharpIndicatorColor" stroke-width="2"/>
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
