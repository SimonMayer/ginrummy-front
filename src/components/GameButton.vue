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
    <slot
        :mutedLightToSecondary="mutedLightToSecondary"
        :mutedLightToWhite="mutedLightToWhite"
        :mutedMidToAccent="mutedMidToAccent"
        :mutedMidToMutedLight="mutedMidToMutedLight"
        name="icon"
    />
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
    mutedLightToWhite() {
      return this.isDisabled ? 'var(--muted-light-color)' : '#fff';
    },
    mutedLightToSecondary() {
      return this.isDisabled ? 'var(--muted-light-color)' : 'var(--secondary-color)';
    },
    mutedMidToMutedLight() {
      return this.isDisabled ? 'var(--muted-mid-color)' : 'var(--muted-light-color)';
    },
    mutedMidToAccent() {
      return this.isDisabled ? 'var(--muted-mid-color)' : 'var(--accent-color)';
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
@import '@/assets/match/variables';

button {
  border-width: $match-button-border-width;
  position: relative;
  padding: 0;

  ::v-deep(.icon) {
    height: $match-button-height;
    width: $match-button-width;
  }

  .button-tooltip {
    position: absolute;
    top: 100%;
    right: 0;
    pointer-events: none;
    margin: calc(var(--base-margin) * -0.5) 0 0;
    padding: var(--base-margin) 0 0;
    border-radius: var(--border-radius);
    opacity: 0;
    transform: translateX(-5px) translateY(5px);
    transition: opacity var(--transition-time), transform var(--transition-time);
    background-color: rgba(var(--muted-mid-color-rgb), 0.2);

    &::before {
      content: '';
      position: absolute;
      top: calc(var(--base-margin) * -1);
      right: calc(var(--base-margin) * 1.5);
      border-color: transparent transparent rgba(var(--muted-mid-color-rgb), 0.8) transparent;
      border-style: solid;
      border-width: calc(var(--base-margin));
    }

    .content {
      background-color: rgba(var(--muted-mid-color-rgb), 0.8);
      color: var(--muted-very-light-color);
      border-radius: 0 0 var(--border-radius) var(--border-radius);
      padding: calc(var(--base-padding) * 0.5) var(--base-padding);
      font-size: var(--font-size-small);
      white-space: nowrap;

      .unavailable-note {
        padding-right: calc(var(--base-padding) * 0.5);
      }
    }

    &.is-available {
      background-color: rgba(var(--secondary-color-rgb), 0.2);

      &::before {
        border-color: transparent transparent rgba(var(--secondary-color-rgb), 0.8) transparent;
      }

      .content {
        background-color: rgba(var(--secondary-color-rgb), 0.8);
        color: var(--text-color);
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
