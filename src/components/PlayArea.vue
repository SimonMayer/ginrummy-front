<template>
  <div v-show="isDraggingItems" class="play-area-container">
    <div
        v-show="componentSpecificDropCriteria"
        :class="['play-area', { 'invites-drop': invitesDrop, 'accepts-drop': acceptsDrop }]"
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
      canDrawMultipleAndPlayMeldUsingCurrentlyDraggedCards: 'sessionState/permissions/draw/canDrawMultipleAndPlayMeldUsingCurrentlyDraggedCards',
      canPlayCurrentlyDraggedCardsFromHandAsMeld: 'sessionState/permissions/melds/canPlayCurrentlyDraggedCardsFromHandAsMeld',
      isDraggingItems: 'sessionState/uiOperations/dragState/isDraggingItems',
    }),
    componentSpecificDropCriteria() {
      return this.canDrawMultipleAndPlayMeldUsingCurrentlyDraggedCards || this.canPlayCurrentlyDraggedCardsFromHandAsMeld;
    },
  },
  methods: {
    ...mapActions({
      drawMultipleFromDiscardPile: 'interactions/turns/draw/drawMultipleFromDiscardPile',
      playMeld: 'interactions/turns/melds/playMeld',
    }),
    async handleDrop() {
      if (this.canPlayCurrentlyDraggedCardsFromHandAsMeld) {
        await this.playMeld();
      } else if (this.canDrawMultipleAndPlayMeldUsingCurrentlyDraggedCards) {
        await this.drawMultipleFromDiscardPile();
      }
      this.clearDraggedItems();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/globalVariables';
@import '@/assets/dropRecipient';

.play-area {
  position: relative;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  @include drop-recipient;
}
</style>
