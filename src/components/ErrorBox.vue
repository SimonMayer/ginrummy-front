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
@use '@/assets/core/animation/variables' as animation;
@use '@/assets/core/color/variables' as color;
@use '@/assets/core/decorative/variables' as decorative;
@use '@/assets/core/spacing/variables' as spacing;

.wrapper {
  background-color: white;
  border-radius: decorative.$border-radius;
  margin: spacing.$margin-standard 0;
  min-width: 400px;
  padding: 2px;

  .error-box {
    border: solid decorative.$border-width-medium color.$error-accent;
    border-radius: decorative.$border-radius;
    color: color.$text;
    overflow: hidden;
    position: relative;

    .title {
      background-color: color.$error;
      font-weight: bold;
      min-height: 30px;
      padding: spacing.$padding-standard;
    }

    .message {
      color: color.$error;
      min-height: 20px;
      padding: spacing.$padding-standard;
    }

    .close-button {
      border-radius: 0.2rem;
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      width: 1rem;
      height: 1rem;
      cursor: pointer;
      transition: background-color animation.$transition-time-standard, color animation.$transition-time-standard;
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
        background: color.$text;
        transform-origin: center;
      }

      &::before {
        transform: translate(-50%, -50%) rotate(45deg);
      }

      &::after {
        transform: translate(-50%, -50%) rotate(-45deg);
      }

      &:hover {
        background-color: rgba(color.$error-accent, 0.8);
      }

      &:active {
        background-color: rgba(color.$error-accent, 0.98);
      }
    }
  }
}
</style>
