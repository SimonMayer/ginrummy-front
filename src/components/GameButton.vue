<template>
  <button
      :disabled="isDisabled"
      aria-label="{{ label }}"
      @click="handleClick"
      @touchend="handleTouchend"
      @touchstart="handleTouchstart"
  >
    <div
        :class="[
            'button-tooltip',
            { 'is-touch-device': supportsTouch, 'is-not-touch-device': !supportsTouch, 'is-available': !isDisabled }
        ]"
    >
      <div class="content">
        <span v-if="isDisabled" class="unavailable-note">🚫</span>
        {{ label }}
      </div>
    </div>
    <slot name="icon"/>
  </button>
</template>

<script>
import {mapGetters} from 'vuex';
import {touchHandlingMixin} from '@/mixins/touchHandlingMixin';

const TOOLTIP_TIMEOUT_MILLISECONDS = 2000;

export default {
  name: 'GameButton',
  mixins: [touchHandlingMixin],
  props: {
    isDisabled: {
      type: Boolean,
      required: true,
    },
    labelEnabled: {
      type: String,
      required: true,
    },
    labelDisabled: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      allowClick: true,
      allowLongPress: true,
    };
  },
  computed: {
    ...mapGetters({
      supportsTouch: 'sessionState/client/capabilities/supportsTouch',
    }),
    label() {
      return this.isDisabled ? this.labelDisabled : this.labelEnabled;
    },
  },
  methods: {
    handleClick() {
      if (!this.isDisabled) {
        this.$emit('button:press');
      }
    },
    handleLongPress() {
      this.$el.classList.add('tooltip-on');

      setTimeout(() => {
        this.$el.classList.remove('tooltip-on');
      }, TOOLTIP_TIMEOUT_MILLISECONDS);
    },
  },
};
</script>

<style lang="scss" scoped>
@use '@/assets/core/animation/variables' as animation;
@use '@/assets/core/color/variables' as color;
@use '@/assets/core/decorative/variables' as decorative;
@use '@/assets/core/spacing/variables' as spacing;
@use '@/assets/core/typography/variables' as typography;
@use '@/assets/match/variables' as match;

$arrowHeight: var(--spacing-margin-standard);

button {
  height: var(--match-button-height);
  width: var(--match-button-width);
  border-width: var(--match-button-border-width);
  position: relative;
  padding: 0;

  ::v-deep(.icon) {
    height: var(--match-button-height);
    width: var(--match-button-width);
  }

  .button-tooltip {
    position: absolute;
    top: 100%;
    right: 0;
    pointer-events: none;
    margin: var(--spacing-margin-half) 0 0;
    padding: $arrowHeight 0 0;
    border-radius: decorative.$border-radius;
    opacity: 0;
    transform: translateX(-5px) translateY(5px);
    transition: opacity animation.$transition-time-standard, transform animation.$transition-time-standard;
    background-color: rgba(color.$muted-mid, 0.2);

    &::before {
      content: '';
      position: absolute;
      top: calc($arrowHeight * -1);
      right: var(--spacing-margin-standard);
      border-color: transparent transparent rgba(color.$muted-mid, 0.8) transparent;
      border-style: solid;
      border-width: var(--spacing-margin-standard);
    }

    .content {
      background-color: rgba(color.$muted-mid, 0.8);
      color: color.$muted-very-light;
      border-radius: 0 0 decorative.$border-radius decorative.$border-radius;
      padding: var(--spacing-padding-half) var(--spacing-padding-standard);
      font-size: var(--typography-font-size-small);
      white-space: nowrap;

      .unavailable-note {
        padding-right: var(--spacing-padding-half);
      }
    }

    &.is-available {
      background-color: rgba(color.$secondary, 0.2);

      &::before {
        border-color: transparent transparent rgba(color.$text, 0.8) transparent;
      }

      .content {
        background-color: rgba(color.$secondary, 0.8);
        color: color.$text;
      }
    }
  }

  &:hover .button-tooltip.is-not-touch-device,
  &.tooltip-on .button-tooltip {
    opacity: 1;
    transform: translateX(0) translateY(0);
  }
}
</style>
