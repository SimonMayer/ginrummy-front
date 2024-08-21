<template>
  <div v-show="isDraggingItems" class="play-area-container">
    <div
        v-show="canNewMeldBePlayed"
        :class="['play-area', { 'accepts-drop': acceptsDrop }]"
        aria-label="Play a meld by dropping cards here"
        role="region"
        @dragenter="handleDragenter"
        @dragleave="handleDragleave"
        @drop="handleDrop"
        @dragover.prevent
    >
      <span class="guidance-text">Drop cards here to play a meld</span>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import {dropRecipientMixin} from '@/mixins/dropRecipientMixin';

export default {
  name: 'PlayArea',
  mixins: [dropRecipientMixin],
  computed: {
    ...mapGetters({
      canDrawMultipleFromDiscardPile: 'sessionState/permissions/draw/canDrawMultipleFromDiscardPile',
      canPlayMeldFromHand: 'sessionState/permissions/melds/canPlayMeldFromHand',
      isDraggingItems: 'sessionState/uiOperations/dragState/isDraggingItems',
    }),
    acceptsDrop() {
      return this.provisionallyAcceptsDrop && this.canNewMeldBePlayed;
    },
    canNewMeldBePlayed() {
      return this.canDrawMultipleFromDiscardPile || this.canPlayMeldFromHand;
    },
  },
  methods: {
    ...mapActions({
      drawMultipleFromDiscardPile: 'interactions/turns/draw/drawMultipleFromDiscardPile',
      playMeld: 'interactions/turns/melds/playMeld',
    }),
    async handleDrop() {
      if (this.canPlayMeldFromHand) {
        await this.playMeld();
      } else if (this.canDrawMultipleFromDiscardPile) {
        await this.drawMultipleFromDiscardPile();
      }
      this.clearDraggedItems();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/globalVariables';

.play-area {
  position: relative;
  height: 100%;
  width: 100%;
  border: solid var(--border-width-thick) var(--muted-mid-color);
  border-radius: var(--border-radius);
  box-sizing: border-box;
  background-color: var(--muted-very-light-color);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: var(--box-shadow-3-medium);

  .guidance-text {
    color: var(--muted-mid-color);
    text-align: center;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: transparent;
    transition: background-color var(--transition-time);
    pointer-events: none;
    z-index: 1;
  }

  &.accepts-drop {
    &::before {
      background-color: rgba(var(--accent-color-rgb), 0.25);
    }
  }
}
</style>
