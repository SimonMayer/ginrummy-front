<template>
  <transition name="fade">
    <div v-if="isVisible" class="lightbox-overlay" @click.self="close">
      <div class="lightbox-container">
        <h3>{{ title }}</h3>
        <div class="content">
          <slot></slot>
        </div>
        <CloseCross class="lightbox-close-cross" @click="close"/>
      </div>
    </div>
  </transition>
</template>

<script>
import CloseCross from './CloseCross.vue';

export default {
  name: 'ContentLightbox',
  components: {
    CloseCross,
  },
  props: {
    isVisible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
  },
  methods: {
    close() {
      this.$emit('close');
    },
  },
};
</script>

<style scoped lang="scss">
@use '@/assets/core/animation/variables' as animation;
@use '@/assets/core/color/variables' as color;
@use '@/assets/core/decorative/variables' as decorative;
@use '@/assets/core/spacing/variables' as spacing;
@use '@/assets/core/responsive/mixins' as responsive;

.lightbox-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;

  .lightbox-container {
    position: relative;
    max-width: 600px;
    width: 90%;
    margin: var(--spacing-margin-standard);
    padding: var(--spacing-padding-standard);
    background: color.$secondary;
    border-radius: decorative.$border-radius;
    box-shadow: decorative.$box-shadow-2-light;

    @include responsive.breakpoint(small) {
      max-width: 95%;
      width: 95%;
    }

    h3 {
      margin-bottom: var(--spacing-margin-standard);
    }

    .content {
      max-height: 90vh;
      overflow-y: auto;
      padding-right: var(--spacing-padding-double);
    }

    .lightbox-close-cross {
      color: color.$text;

      &:hover {
        background-color: rgba(color.$accent, 0.8);
      }

      &:active {
        background-color: rgba(color.$accent, 0.98);
      }
    }
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity animation.$transition-time-slower;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
