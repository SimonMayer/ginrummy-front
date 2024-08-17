<template>
  <g>
    <line
        :stroke="color"
        :transform="transform"
        :x1="tipCoordinateX"
        :x2="centerTailX"
        :y1="tipCoordinateY"
        :y2="centerTailY"
        stroke-width="1.5"
    />
    <line
        :stroke="color"
        :transform="transform"
        :x1="tipCoordinateX"
        :x2="rightTailX"
        :y1="tipCoordinateY"
        :y2="rightTailY"
        stroke-width="1.5"
    />
    <line
        :stroke="color"
        :transform="transform"
        :x1="tipCoordinateX"
        :x2="leftTailX"
        :y1="tipCoordinateY"
        :y2="leftTailY"
        stroke-width="1.5"
    />
  </g>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      required: true,
    },
    rotationAngle: {
      type: Number,
      required: true,
    },
    tipCoordinateX: {
      type: Number,
      required: true,
    },
    tipCoordinateY: {
      type: Number,
      required: true,
    },
  },
  computed: {
    transform() {
      return `rotate(${this.rotationAngle}, ${this.tipCoordinateX}, ${this.tipCoordinateY})`;
    },
    centerTailX() {
      return this.tipCoordinateX + 5;
    },
    centerTailY() {
      return this.tipCoordinateY + 5;
    },
    rightTailX() {
      return this.tipCoordinateX + 4;
    },
    rightTailY() {
      return this.tipCoordinateY + 2;
    },
    leftTailX() {
      return this.tipCoordinateX + 2;
    },
    leftTailY() {
      return this.tipCoordinateY + 4;
    },
  },
};
</script>
