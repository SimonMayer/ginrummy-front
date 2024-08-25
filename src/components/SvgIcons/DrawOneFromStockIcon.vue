<template>
  <svg
      :class="[{ active: active, disabled: !active }]"
      stroke-linecap="round"
      stroke-linejoin="round"
      viewBox="0 0 32 32"
      xmlns="http://www.w3.org/2000/svg"
  >
    <IconCard :active="active" :rotationAngle="90" :x="10.1" :y="5.5"/>
    <IconCard :active="active" :rotationAngle="90" :x="9.8" :y="5"/>
    <IconCard :active="active" :rotationAngle="90" :x="9.5" :y="4.5"/>
    <IconCard :active="active" :rotationAngle="90" :x="9.2" :y="4"/>
    <IconCard :active="active" :rotationAngle="90" :x="8.9" :y="3.5"/>
    <IconCard :active="active" :rotationAngle="90" :x="8.6" :y="3"/>
    <IconCard :active="active" :rotationAngle="90" :x="13" :y="12" :highlight="true"/>

    <IconArrow :active="active" :rotationAngle="180" :tipCoordinateX="25" :tipCoordinateY="25"/>
  </svg>
</template>

<script>
import IconArrow from '@/components/SvgIcons/IconArrow.vue';
import IconCard from '@/components/SvgIcons/IconCard.vue';

export default {
  components: {IconCard, IconArrow},
  props: {
    active: {
      type: Boolean,
      default: false,
    },
  },
};
</script>
