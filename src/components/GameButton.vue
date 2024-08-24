<template>
  <button
      :disabled="isDisabled"
      aria-label="{{ label }}"
      @click="handleClick"
  >
    <div class="button-tooltip">
      <div class="content">
        <span v-if="isDisabled" class="unavailable-note">Action unavailable: </span>
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
    margin: -1px;
    padding: 0;
    overflow: hidden;
    clip-path: inset(50%);
    border: 0;
    border-radius: var(--border-radius);
    background-color: rgba(var(--secondary-color-rgb), 0.2);

    .content {
      padding: calc(var(--base-padding) * 0.5);
      background-color: rgba(var(--secondary-color-rgb), 0.8);
      border-radius: 0 0 var(--border-radius) var(--border-radius);
      color: var(--text-color);
      white-space: nowrap;
      font-size: var(--font-size-small);

      .unavailable-note {
        display: block;
        font-weight: bold;
      }
    }
  }
}

button:hover .button-tooltip {
  top: 100%;
  right: 0;
  display: block;
  width: auto;
  height: auto;
  margin: calc(var(--base-margin) * -0.5) 0 0;
  padding: var(--base-margin) 0 0;
  clip-path: none;

  &::before {
    content: '';
    position: absolute;
    top: calc(var(--base-margin) * -1);
    right: calc(var(--base-margin) * 1.5);
    border-width: calc(var(--base-margin));
    border-style: solid;
    border-color: transparent transparent rgba(var(--secondary-color-rgb), 0.8) transparent;
  }
}
</style>
