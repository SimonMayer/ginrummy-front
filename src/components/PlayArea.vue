<template>
  <div :class="['play-area-container', { 'tile': tileMode, 'bridge': !tileMode }]">
    <div
        v-show="isDraggingItems && componentSpecificDropCriteria"
        :ref="componentSpecificDropAreaRef"
        :class="['play-area', { 'invites-drop': invitesDrop, 'accepts-drop': acceptsDrop }]"
        aria-label="Play a meld by dropping cards here"
        role="region"
        @dragenter="handleDragenter"
        @dragleave="handleDragleave"
        @drop="handleDrop"
        @dragover.prevent
    >
      <div class="guidance-tooltip below leftwards">
        <div class="content">Drop cards here to play a meld</div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import {dropRecipientMixin} from '@/mixins/dropRecipientMixin';

export default {
  name: 'PlayArea',
  mixins: [dropRecipientMixin],
  props: {
    tileMode: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    ...mapGetters({
      canDrawMultipleAndPlayMeldUsingCurrentlyDraggedCards: 'sessionState/permissions/draw/canDrawMultipleAndPlayMeldUsingCurrentlyDraggedCards',
      canPlayCurrentlyDraggedCardsFromHandAsMeld: 'sessionState/permissions/melds/canPlayCurrentlyDraggedCardsFromHandAsMeld',
      isDraggingItems: 'sessionState/uiOperations/dragState/isDraggingItems',
    }),
    componentSpecificDropCriteria() {
      return this.canDrawMultipleAndPlayMeldUsingCurrentlyDraggedCards || this.canPlayCurrentlyDraggedCardsFromHandAsMeld;
    },
    componentSpecificDropAreaRef() {
      return 'playAreaDropArea';
    },
  },
  methods: {
    ...mapActions({
      drawMultipleFromDiscardPile: 'interactions/turns/draw/drawMultipleFromDiscardPile',
      playMeld: 'interactions/turns/melds/playMeld',
    }),
    async componentSpecificDropHandler() {
      if (this.canPlayCurrentlyDraggedCardsFromHandAsMeld) {
        return await this.playMeld();
      }

      if (this.canDrawMultipleAndPlayMeldUsingCurrentlyDraggedCards) {
        return await this.drawMultipleFromDiscardPile();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@use '@/assets/cards/variables' as card;
@import '@/assets/dropRecipient';

.play-area-container {
  &.bridge {
    min-height: var(--card-bridge-height);
    width: calc(var(--card-bridge-width) * 2);
  }

  &.tile {
    min-height: var(--card-tile-height);
    width: calc(var(--card-tile-width) * 3);
  }

  .play-area {
    position: relative;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    @include drop-recipient;
  }
}
</style>
