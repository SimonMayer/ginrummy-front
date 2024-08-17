<template>
  <g>
    <line :x1="tipCoordinateX" :y1="tipCoordinateY"
          :x2="centerTailX" :y2="centerTailY"
          :transform="transform"
          :stroke="color" stroke-width="1.5"
    />
    <line :x1="tipCoordinateX" :y1="tipCoordinateY"
          :x2="rightTailX" :y2="rightTailY"
          :transform="transform"
          :stroke="color" stroke-width="1.5"
    />
    <line :x1="tipCoordinateX" :y1="tipCoordinateY"
          :x2="leftTailX" :y2="leftTailY"
          :transform="transform"
          :stroke="color" stroke-width="1.5"
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
