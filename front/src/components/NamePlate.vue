<template>
  <div class="name-container">
    <div class="prism">
      <div class="face front">{{ name }}</div>
      <div class="face rear"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NamePlate',
  props: {
    name: String
  }
};
</script>

<style lang="scss" scoped>
.name-container {
  perspective: 1000px;

  .prism {
    position: relative;
    width: 30px;
    transform-style: preserve-3d;
    transform: rotateX(-30deg) rotateY(30deg);
    height: 30px;

    .face {
      position: absolute;
      backface-visibility: hidden;
      padding: 10px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

      &.front {
        height: 16px;
        transform: translateZ(30px);
        background-color: #4f200f;
        border-top: solid 1px #666;
        font-family: 'Georgia', serif;
        min-width: 32px;
        text-transform: uppercase;
        font-weight: bold;
        text-shadow: 0.5px 0.5px #c76c3f;
      }

      &.rear {
        transform: rotateX(-45deg) rotateY(360deg) translateZ(0.5px) translateX(4.5px);
        height: 32px;
        width: 32px;
        background-color: #271810;
      }
    }
  }
}
</style>
