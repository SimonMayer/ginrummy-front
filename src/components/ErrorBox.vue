<template>
  <div v-if="hasError" class="container-outer">
    <div class="container-inner">
      <div class="error-box">
        <div class="title">{{ errorTitle }}</div>
        <div v-if="errorMessage" class="message">{{ errorMessage }}</div>
        <CloseCross class="error-close-cross" @click="clearLogEntries" />
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import CloseCross from '@/components/CloseCross.vue';

export default {
  name: 'ErrorBox',
  components: {
    CloseCross
  },
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
@use '@/assets/core/responsive/mixins' as responsive;
@use '@/assets/core/spacing/variables' as spacing;

.container-outer {
  display: flex;
  justify-content: center;
  margin: var(--spacing-margin-standard) 0;

  .container-inner{
    background-color: white;
    max-width: 600px;
    width: 90%;
    border-radius: decorative.$border-radius;
    padding: var(--spacing-padding-half);

    @include responsive.breakpoint(small) {
      max-width: 95%;
      width: 95%;
    }

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
        padding: var(--spacing-padding-standard);
      }

      .message {
        color: color.$error;
        min-height: 20px;
        padding: var(--spacing-padding-standard);
      }

      .error-close-cross {
        color: color.$text;

        &:hover {
          background-color: rgba(color.$error-accent, 0.8);
        }

        &:active {
          background-color: rgba(color.$error-accent, 0.98);
        }
      }
    }
  }
}
</style>
