<template>
  <div v-if="hasError" class="wrapper">
    <div class="error-box">
      <div class="title">{{ errorTitle }}</div>
      <div v-if="errorMessage" class="message">{{ errorMessage }}</div>
      <div class="close-button" @click="clearLogEntries"></div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';

export default {
  name: 'ErrorBox',
  computed: {
    ...mapGetters({
      logEntry: 'sessionState/indicators/errorLog/getLatestLogEntry',
    }),
    hasError() {
      return !!this.logEntry;
    },
    error() {
      return this.logEntry?.error || null;
    },
    errorTitle() {
      return this.logEntry?.title || null;
    },
    errorMessage() {
      return this.error ? (this.error.response?.data?.error || this.error.message || '') : '';
    },
  },
  methods: {
    ...mapActions({
      clearLogEntries: 'sessionState/indicators/errorLog/clearLogEntries',
    }),
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/globalVariables';

.wrapper {
  background-color: white;
  border-radius: var(--border-radius);
  margin: var(--base-margin) 0;
  min-width: 400px;
  padding: 2px;

  .error-box {
    border: solid var(--border-width-medium) var(--error-accent-color);
    border-radius: var(--border-radius);
    color: var(--text-color);
    overflow: hidden;
    position: relative;

    .title {
      background-color: var(--error-color);
      font-weight: bold;
      min-height: 30px;
      padding: var(--base-padding);
    }

    .message {
      color: var(--error-color);
      min-height: 20px;
      padding: var(--base-padding);
    }

    .close-button {
      border-radius: 0.2rem;
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      width: 1rem;
      height: 1rem;
      cursor: pointer;
      transition: background-color var(--transition-time), color var(--transition-time);
      display: flex;
      align-items: center;
      justify-content: center;

      &::before,
      &::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 16px;
        height: 3px;
        background: var(--text-color);
        transform-origin: center;
      }

      &::before {
        transform: translate(-50%, -50%) rotate(45deg);
      }

      &::after {
        transform: translate(-50%, -50%) rotate(-45deg);
      }

      &:hover {
        background-color: rgba(var(--error-accent-color-rgb), 0.8);
      }

      &:active {
        background-color: rgba(var(--error-accent-color-rgb), 0.98);
      }
    }
  }
}
</style>
