<template>
  <button
      @click="handleClick"
      :disabled="isDisabled"
      aria-label="{{ label }}"
  >
    <span class="button-tooltip">{{ label }}</span>
    <slot name="icon"
          :mutedLightToAccent="mutedLightToAccent"
          :mutedLightToWhite="mutedLightToWhite"
          :mutedLightToSecondary="mutedLightToSecondary"
          :mutedLightToTertiary="mutedLightToTertiary"
          :mutedMidToAccent="mutedMidToAccent"
          :mutedMidToMutedLight="mutedMidToMutedLight"
          :mutedMidToTertiary="mutedMidToTertiary"
          :mutedMidToWhite="mutedMidToWhite"
    />
  </button>
</template>

<script>
export default {
  name: 'GameButton',
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
  computed: {
    label() {
      return this.isDisabled ? this.labelDisabled : this.labelEnabled;
    },
    mutedLightToWhite() {
      return this.isDisabled ? 'var(--muted-light-color)' : '#fff';
    },
    mutedLightToAccent() {
      return this.isDisabled ? 'var(--muted-light-color)' : 'var(--accent-color)';
    },
    mutedLightToSecondary() {
      return this.isDisabled ? 'var(--muted-light-color)' : 'var(--secondary-color)';
    },
    mutedLightToTertiary() {
      return this.isDisabled ? 'var(--muted-light-color)' : 'var(--tertiary-color)';
    },
    mutedMidToMutedLight() {
      return this.isDisabled ? 'var(--muted-mid-color)' : 'var(--muted-light-color)';
    },
    mutedMidToAccent() {
      return this.isDisabled ? 'var(--muted-mid-color)' : 'var(--accent-color)';
    },
    mutedMidToTertiary() {
      return this.isDisabled ? 'var(--muted-mid-color)' : 'var(--tertiary-color)';
    },
    mutedMidToWhite() {
      return this.isDisabled ? 'var(--muted-mid-color)' : '#fff';
    },
  },
  methods: {
    handleClick() {
      if (!this.isDisabled) {
        this.$emit('button:press');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/globalVariables';
@import '@/assets/cards/variables.css';

button {
  position: relative;
  padding: 0;

  .button-tooltip {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip-path: inset(50%);
    border: 0;
  }
}

button:hover .button-tooltip {
  display: block;
  position: absolute;
  top: 100%;
  left: 0;
  transform: translateX(calc(var(--base-margin) * -2));
  width: auto;
  height: auto;
  padding: var(--base-padding);
  margin: var(--base-margin) 0 0;
  clip-path: none;
  background-color: rgba(var(--secondary-color-rgb), 0.5);
  color: var(--text-color);
  border-radius: 4px;
  white-space: nowrap;
  font-size: var(--font-size-small);
}
</style>
