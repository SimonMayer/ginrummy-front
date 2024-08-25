<template>
  <div
      :ref="componentSpecificDropAreaRef"
      :class="[
        'meld',
        type,
        `size-${sortedCards.length}`,
        {
          'invites-drop': invitesDrop,
          'accepts-drop': acceptsDrop,
          'selected': displayAsSelected,
          'selectable': isSelectable,
        },
      ]"
      @click="handleClick"
      @dragenter="handleDragenter"
      @dragleave="handleDragleave"
      @drop="handleDrop"
      @touchend="handleTouchend"
      @touchstart="handleTouchstart"
      @dragover.prevent
  >
    <VisibleCard
        v-for="card in sortedCards"
        :key="card.card_id"
        :cardProp="card"
        :selectable="false"
        class="card"
    />
    <span v-show="allDraggedCardCount === 1" class="guidance-text">Drop card here to extend the meld</span>
    <span v-show="allDraggedCardCount > 1" class="guidance-text">Drop cards here to extend the meld</span>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import VisibleCard from '@/components/VisibleCard.vue';
import {dropRecipientMixin} from '@/mixins/dropRecipientMixin';
import {touchHandlingMixin} from '@/mixins/touchHandlingMixin';
import meldsService from '@/services/meldsService';

export default {
  name: 'PlayedMeld',
  mixins: [
    dropRecipientMixin,
    touchHandlingMixin,
  ],
  components: {
    VisibleCard,
  },
  props: {
    cards: {
      type: Array,
      required: true,
    },
    id: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      allowClick: true,
    };
  },
  computed: {
    ...mapGetters({
      runOrders: 'storage/gameConfig/runOrders',
      allDraggedCardCount: 'sessionState/derived/draggedItems/allDraggedCardCount',
      canDrawMultipleAndExtendSpecificMeldUsingCurrentlyDraggedCards: 'sessionState/permissions/draw/canDrawMultipleAndExtendSpecificMeldUsingCurrentlyDraggedCards',
      canDrawMultipleToExtendMeldAsNextMove: 'sessionState/permissions/draw/canDrawMultipleToExtendMeldAsNextMove',
      canExtendMeldFromHandAsNextMove: 'sessionState/permissions/melds/canExtendMeldFromHandAsNextMove',
      canExtendSpecificMeldFromHandWithCurrentlyDraggedCards: 'sessionState/permissions/melds/canExtendSpecificMeldFromHandWithCurrentlyDraggedCards',
      selectedMeldId: 'sessionState/uiOperations/selections/selectedMeldId',
    }),
    sortedCards() {
      return meldsService.sortCardsByRunOrders(this.cards, this.runOrders);
    },
    isSelectable() {
      return this.canExtendMeldFromHandAsNextMove || this.canDrawMultipleToExtendMeldAsNextMove;
    },
    isSelected() {
      return this.selectedMeldId === this.id;
    },
    displayAsSelected() {
      return !this.isDraggingItems && this.isSelected;
    },
    componentSpecificDropCriteria() {
      return this.canDrawMultipleAndExtendSpecificMeldUsingCurrentlyDraggedCards(this.id) ||
          this.canExtendSpecificMeldFromHandWithCurrentlyDraggedCards(this.id);
    },
    componentSpecificDropAreaRef() {
      return `PlayedMeld${this.id}DropArea`;
    },
  },
  methods: {
    ...mapActions({
      drawMultipleFromDiscardPile: 'interactions/turns/draw/drawMultipleFromDiscardPile',
      extendMeld: 'interactions/turns/melds/extendMeld',
      clearSelectedMeldId: 'sessionState/uiOperations/selections/clearSelectedMeldId',
      setSelectedMeldId: 'sessionState/uiOperations/selections/setSelectedMeldId',
      toggleSelectedMeldId: 'sessionState/uiOperations/selections/toggleSelectedMeldId',
    }),
    handleClick() {
      if (this.isSelectable) {
        this.toggleSelectedMeldId(this.id);
      }
    },
    async componentSpecificDropHandler() {
      if (this.canExtendSpecificMeldFromHandWithCurrentlyDraggedCards(this.id)) {
        await this.setSelectedMeldId(this.id);
        return await this.extendMeld();
      }

      if (this.canDrawMultipleAndExtendSpecificMeldUsingCurrentlyDraggedCards(this.id)) {
        await this.setSelectedMeldId(this.id);
        return await this.drawMultipleFromDiscardPile();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@use '@/assets/cards/variables' as card;
@import '@/assets/dropRecipient';

@mixin fan-shape($maximumCardCount, $span, $rotationOffset, $shownFirstCards, $shownFinalCards, $innerCardRotationFactor) {
  $uncompactedMeldSize: $shownFirstCards + $shownFinalCards + 2;
  $defaultCardRotation: calc($span / $maximumCardCount);
  $innerCardRotation: $defaultCardRotation * $innerCardRotationFactor;
  $rotation: 0;

  @for $meldSize from 1 through $maximumCardCount {
    $preFinalCards: $meldSize - $shownFinalCards;
    @for $card from 1 through $meldSize {

      @if $meldSize <= $uncompactedMeldSize {
        $rotation: ($card * $defaultCardRotation) + $rotationOffset;
      } @else {
        $firstCardRotations: min($card, ($shownFirstCards + 1)) * $defaultCardRotation;
        $innerCardRotations: max(min($card, ($preFinalCards + 1)) - ($shownFirstCards + 1), 0) * $innerCardRotation;
        $finalCardRotations: max($card - ($preFinalCards + 1), 0) * $defaultCardRotation;
        $rotation: $firstCardRotations + $innerCardRotations + $finalCardRotations + $rotationOffset;
      }

      &.size-#{$meldSize} {
        .card:nth-child(#{$card}) {
          transform: rotate($rotation);
        }
      }
    }
  }
}

.meld {
  position: relative;
  display: flex;
  justify-content: right;
  align-items: flex-start;
  width: calc(card.$width * 0.8);
  height: card.$height;
  padding-top: calc(card.$width * 0.12);
  padding-bottom: calc(card.$width * 0.1);
  padding-left: calc((card.$width * 0.35) + (card.$height * 0.3));

  &.size-4 {
    padding-right: calc(card.$width * 0.02);
  }

  &.size-5 {
    padding-right: calc(card.$width * 0.18);
  }

  &.size-6 {
    padding-right: calc(card.$width * 0.06);
  }

  &.size-7 {
    padding-right: calc(card.$width * 0.12);
  }

  &.size-8 {
    padding-right: calc(card.$width * 0.18);
  }

  &.size-9 {
    padding-right: calc(card.$width * 0.24);
  }

  &.size-10 {
    padding-right: calc(card.$width * 0.30);
  }

  &.size-11 {
    padding-right: calc(card.$width * 0.36);
    padding-bottom: calc(card.$width * 0.15);
  }

  &.size-12 {
    padding-right: calc(card.$width * 0.42);
    padding-bottom: calc(card.$width * 0.18);
  }

  &.size-13 {
    padding-right: calc(card.$width * 0.48);
    padding-bottom: calc(card.$width * 0.22);
  }

  &.selected {
    .card {
      filter: card.$selected-filter;
    }
  }

  &.selectable {
    cursor: pointer;
  }

  .card {
    position: absolute;
    transform-origin: 20% 150%;
  }

  &.run {
    @include fan-shape(13, 56.5deg, -20, 2, 1, 0.4);
  }

  &.set {
    @include fan-shape(4, 20deg, -20, 2, 1, 1);
  }

  @include drop-recipient;
}
</style>
