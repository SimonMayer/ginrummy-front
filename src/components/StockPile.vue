<template>
  <div v-if="visibleRoundId" class="stock-pile-container">
    <div :class="{ disabled: disabled, empty: isEmpty }" class="stock-pile" @click="handleClick">
      <HiddenCard
          v-for="n in size"
          :key="n"
          :draggable="isCardDraggable(n)"
          class="stock-card-item"
          @dragend="handleDragend"
          @dragstart="(event) => handleDragstart(event, n)"
          @touchend="handleTouchend"
          @touchmove="handleTouchmove"
          @touchstart="(event) => handleTouchstart(event, {cardIndex: n})"
      />
      <div v-if="isEmpty" class="empty-placeholder">
        <div class="icon">↻</div>
        <div>Rebuild from discards</div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import HiddenCard from '@/components/HiddenCard.vue';
import {touchHandlingMixin} from '@/mixins/touchHandlingMixin';

export default {
  name: 'StockPile',
  mixins: [touchHandlingMixin],
  components: {
    HiddenCard,
  },
  data() {
    return {
      allowClick: true,
      allowDrag: true,
    };
  },
  computed: {
    ...mapGetters({
      visibleRoundId: 'sessionState/derived/rounds/visibleRoundId',
      size: 'sessionState/derived/stockPile/visibleStockPileSize',
      canDrawOneFromStockPileNowByButton: 'sessionState/permissions/draw/canDrawOneFromStockPileNowByButton',
      canStartDraggingNowToDrawOneFromStockPile: 'sessionState/permissions/draw/canStartDraggingNowToDrawOneFromStockPile',
    }),
    isEmpty() {
      return this.size === 0;
    },
    disabled() {
      return !this.canDrawOneFromStockPileNowByButton;
    },
    componentSpecificTouchSource() {
      return 'topCardInStockPile';
    },
  },
  methods: {
    ...mapActions({
      drawOneFromStockPile: 'interactions/turns/draw/drawOneFromStockPile',
      startDraggingNamedHiddenCard: 'sessionState/uiOperations/dragState/startDraggingNamedHiddenCard',
      stopDraggingItems: 'sessionState/uiOperations/dragState/stopDraggingItems',
    }),
    isCardDraggable(index) {
      return this.canStartDraggingNowToDrawOneFromStockPile && (index === this.size);
    },
    handleClick() {
      if (!this.disabled) {
        this.drawOneFromStockPile();
      }
    },
    preHandleDragstartFromTouch() {
      this.handleDragstart(null, this.touchPayload.cardIndex);
    },
    async handleDragstart(event, cardIndex) {
      if (this.isCardDraggable(cardIndex)) {
        document.body.classList.add('dragging');
        await this.startDraggingNamedHiddenCard({name: 'topCardInStockPile', event});
      }
    },
    async handleDragend() {
      document.body.classList.remove('dragging');
      await this.stopDraggingItems();
    },
  },
};
</script>

<style lang="scss" scoped>
@use '@/assets/cards/variables' as card;

.stock-pile-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: var(--base-margin);
}

.stock-pile {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: left;
  position: relative;
  cursor: pointer;
  height: card.$height;
  width: calc(card.$width * 1.5);

  @for $i from 1 through 52 {
    .stock-card-item:nth-child(#{$i}) {
      @if $i % 24 == 0 {
        transform: rotate(-1deg);
      } @else if $i % 11 == 0 {
        transform: rotate(1.1deg);
      } @else if $i % 7 == 0 {
        transform: rotate(-0.5deg);
      } @else if $i % 5 == 0 {
        transform: rotate(0.4deg);
      } @else if $i % 2 == 0 {
        transform: rotate(0.2deg);
      } @else if $i % 2 != 0 {
        transform: rotate(-0.3deg);
      }

      $xOffsetWeight: ($i * $i) % 97;
      $yOffsetWeight: ($i * $i) % 89;
      transform-origin: calc($xOffsetWeight * 1%) calc($yOffsetWeight * 1.1%);

      @if $i != 1 {
        margin-left: calc(card.$width * -1.015);
      }
      margin-top: calc(card.$height * 0.005 * $i);
    }
  }

  &.disabled {
    pointer-events: none;
    cursor: not-allowed;
  }

  .empty-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: card.$width;
    height: card.$height;
    background-color: rgba(var(--secondary-color-rgb), 0.8);
    border: dashed calc(card.$border-width * 5) var(--muted-light-color);
    border-radius: card.$border-radius;
    font-size: calc(card.$base-size * 18);
    color: var(--muted-light-color);

    div {
      transform: rotate(-90deg);
      margin: var(--base-margin);
    }
  }
}
</style>
