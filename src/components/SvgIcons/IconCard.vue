<template>
  <rect
      :class="[{ active: active, disabled: !active, highlight: highlight, reverse: reverse }]"
      :height="height"
      :rx="radius"
      :ry="radius"
      :transform="transform"
      :width="width"
      :x="x"
      :y="y"
  />
</template>

<script>
export default {
  props: {
    active: {
      type: Boolean,
      default: false,
    },
    highlight: {
      type: Boolean,
      default: false,
    },
    reverse: {
      type: Boolean,
      default: false,
    },
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
  },
  data() {
    return {
      radius: 2,
      width: 12,
      height: 18,
    };
  },
  computed: {
    transform() {
      return `translate(0,0) rotate(${this.rotationAngle}, ${this.x + (this.width / 2)}, ${this.y + (this.height / 2)})`;
    },
  },
};
</script>

<style lang="scss" scoped>
@use '@/assets/core/color/variables' as color;

.active {
  fill: color.$white;
  stroke: color.$muted-light;

  &.highlight {
    fill: color.$white;
    stroke: color.$accent;
  }

  &.reverse {
    fill: color.$muted-light;
    stroke: color.$white;
  }
}

.disabled {
  fill: color.$muted-light;
  stroke: color.$muted-mid;

  &.reverse {
    fill: color.$muted-mid;
    stroke: color.$muted-light;
  }
}
</style>
