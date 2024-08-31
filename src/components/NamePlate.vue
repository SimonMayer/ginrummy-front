<template>
  <div class="name-container">
    <div class="prism">
      <div class="face under"></div>
      <div class="face rear"></div>
      <div :class="['face', 'front', sizeClass]">
        <div class="text">{{ name }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NamePlate',
  props: {
    name: String,
  },
  computed: {
    sizeClass() {
      return `size-${this.name.length}`;
    },
  },
};
</script>

<style lang="scss" scoped>
@use '@/assets/core/responsive/mixins' as responsive;

@mixin setFontSize($size, $width, $height, $fontSizeMultiplier) {
  $characterWidthFactor: 1.13125;

  $fontSize: 8 * $fontSizeMultiplier;
  @if ($size < calc($width / ($characterWidthFactor * 16px))) {
    $fontSize: 16 * $fontSizeMultiplier;
  } @else if ($size < calc($width / ($characterWidthFactor * 14px))) {
    $fontSize: 14 * $fontSizeMultiplier;
  } @else if (ceil(calc($size / 2)) < calc($width / ($characterWidthFactor * 14px))) {
    $fontSize: 14 * $fontSizeMultiplier;
  } @else if (ceil(calc($size / 2)) < calc($width / ($characterWidthFactor * 13px))) {
    $fontSize: 13 * $fontSizeMultiplier;
  } @else if (ceil(calc($size / 2)) < calc($width / ($characterWidthFactor * 12px))) {
    $fontSize: 12 * $fontSizeMultiplier;
  } @else if (ceil(calc($size / 2)) < calc($width / ($characterWidthFactor * 11px))) {
    $fontSize: 11 * $fontSizeMultiplier;
  } @else if (ceil(calc($size / 2)) < calc($width / ($characterWidthFactor * 10px))) {
    $fontSize: 10 * $fontSizeMultiplier;
  } @else if (ceil(calc($size / 3)) < calc($width / ($characterWidthFactor * 10px))) {
    $fontSize: 10 * $fontSizeMultiplier;
  } @else if (ceil(calc($size / 3)) < calc($width / ($characterWidthFactor * 9.5px))) {
    $fontSize: 9.5 * $fontSizeMultiplier;
  } @else if (ceil(calc($size / 3)) < calc($width / ($characterWidthFactor * 8.5px))) {
    $fontSize: 8.5 * $fontSizeMultiplier;
  }

  $lineCount: floor(calc($height / $fontSize));
  font-size: $fontSize;
  line-height: calc($height / $lineCount);
}

@mixin setNamePlateSizes($baseSize) {
  $totalWidth: 120 * $baseSize;
  $prismMarginLeft: 3 * $baseSize;
  $prismMarginTop: -5 * $baseSize;
  $prismHeight: 55 * $baseSize;
  $prismWidth: 30 * $baseSize;
  $frontHeight: 32 * $baseSize;
  $frontWidth: 100 * $baseSize;
  $frontTranslateZ: 30 * $baseSize;
  $frontPaddingX: 4 * $baseSize;
  $frontPaddingY: 2 * $baseSize;
  $topBorderWidth: $baseSize;
  $rearHeight: 52 * $baseSize;
  $rearWidth: 52 * $baseSize;
  $rearTranslateX: 1.5 * $baseSize;
  $underHeight: 35 * $baseSize;
  $underWidth: 32 * $baseSize;
  $underTranslateX: -1 * $baseSize;
  $underTranslateY: 10 * $baseSize;
  $underTranslateZ: -20 * $baseSize;
  $underShadowX: -51 * $baseSize;
  $underShadowY: -18 * $baseSize;
  $underShadowBlur: 20 * $baseSize;
  $underShadowSpread: -20 * $baseSize;
  $textShadowOffset: 0.5 * $baseSize;

  width: $totalWidth;

  .prism {
    height: $prismHeight;
    width: $prismWidth;
    margin-top: $prismMarginTop;
    margin-left: $prismMarginLeft;

    .face {
      &.front {
        height: $frontHeight;
        width: $frontWidth;
        transform: translateZ($frontTranslateZ);
        padding: $frontPaddingY $frontPaddingX;
        border-top: solid $topBorderWidth #666666;

        .text {
          text-shadow: $textShadowOffset $textShadowOffset #c76c3f;
        }

        @for $i from 1 through 32 {
          &.size-#{$i} {
            .text {
              @include setFontSize($i, $frontWidth, $frontHeight, $baseSize);
            }
          }
        }
      }

      &.rear {
        height: $rearHeight;
        width: $rearWidth;
        transform: rotateX(-45deg) translateX($rearTranslateX);
      }

      &.under {
        transform: rotateX(90deg) rotateZ(-2deg) translateX($underTranslateX) translateY($underTranslateY) translateZ($underTranslateZ);
        height: $underHeight;
        width: $underWidth;
        box-shadow: inset $underShadowX $underShadowY $underShadowBlur $underShadowSpread rgba(0, 0, 0, 1);
      }
    }
  }
}

.name-container {
  perspective: 4000px;

  @include responsive.breakpoint(large) {
    @include setNamePlateSizes(1px);
  }

  @include responsive.breakpoint(medium) {
    @include setNamePlateSizes(0.8px);
  }

  @include responsive.breakpoint(small) {
    @include setNamePlateSizes(0.6px);
  }

  .prism {
    position: relative;
    transform-style: preserve-3d;
    transform: rotateX(-30deg) rotateY(15deg);

    .face {
      position: absolute;
      backface-visibility: hidden;

      &.front {
        display: flex;
        flex-direction: column;
        justify-content: center;
        background-color: #4f200f;

        .text {
          color: #ffffff;
          font-family: 'Georgia', serif;
          font-weight: bold;
          max-height: 100%;
          max-width: 100%;
          overflow: hidden;
          word-break: break-all;
          text-align: center;
          text-transform: uppercase;
        }
      }

      &.rear {
        background-color: #271810;
      }
    }
  }
}
</style>
