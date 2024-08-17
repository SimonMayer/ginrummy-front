<template>
  <rect
      :fill="fillColor ? fillColor : undefined"
      :height="height"
      :rx="radius"
      :ry="radius"
      :stroke="strokeColor ? strokeColor : undefined"
      :transform="transform"
      :width="width"
      :x="x"
      :y="y"
  />
</template>

<script>
export default {
  props: {
    x: {
      type: Number,
      required: true,
    },
    y: {
      type: Number,
      required: true,
    },
    rotationAngle: {
      type: Number,
      required: false,
      default: 0,
    },
    fillColor: {
      type: String,
      required: false,
    },
    strokeColor: {
      type: String,
      required: false,
    },
  },
  computed: {
    transform() {
      return `translate(0,0) rotate(${this.rotationAngle}, ${this.x + (this.width / 2)}, ${this.y + (this.height / 2)})`;
    },
  },
  data() {
    return {
      radius: 2,
      width: 12,
      height: 18,
    };
  },
};
</script>
