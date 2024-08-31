<template>
  <div
      v-if="visibleRoundId"
      :class="[
          'stock-pile-container',
          { 'tile': tileMode,'bridge': !tileMode }
      ]"
  >
    <div
        :class="[
            'stock-pile',
            { disabled: disabled, empty: isEmpty, 'tile': tileMode, 'bridge': !tileMode }
        ]"
        @click="handleClick"
    >
      <HiddenCard
          v-for="n in size"
          :key="n"
          :draggable="isCardDraggable(n)"
          :tileMode="tileMode"
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
  props: {
    tileMode: {
      type: Boolean,
      default: false,
    },
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
@use '@/assets/core/color/variables' as color;
@use '@/assets/core/spacing/variables' as spacing;
@use '@/assets/cards/variables' as card;

.stock-pile-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: var(--spacing-margin-standard);

  &.bridge {
    height: var(--card-bridge-width);
    width: var(--card-bridge-height);
  }

  &.tile {
    width: 100%;
  }

  .stock-pile {
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;
    cursor: pointer;

    .empty-placeholder {
      display: flex;
      box-sizing: border-box;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      background-color: rgba(color.$secondary, 0.8);
      border: dashed calc(var(--card-border-width) * 5) color.$muted-light;
      border-radius: var(--card-border-radius);
      font-size: var(--card-placeholder-font-size);
      color: color.$muted-light;
      padding: var(--spacing-padding-standard);
    }

    &.bridge {
      height: var(--card-bridge-width);
      width: var(--card-bridge-height);
      transform-origin: top left;
      transform: rotate(90deg) translateX(calc(var(--card-bridge-width) * 0.2)) translateY(calc(var(--card-bridge-height) * -0.87));
      justify-content: left;

      .empty-placeholder {
        height: var(--card-bridge-width);
        width: var(--card-bridge-height);
        transform: rotate(-90deg) translateY(calc(var(--card-bridge-width) * -0.3));
      }
    }

    &.tile {
      height: var(--card-tile-height);
      width: 100%;
      justify-content: center;

      .empty-placeholder {
        height: var(--card-tile-height);
        width: 100%;
      }
    }

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
          &.bridge {
            margin-left: calc(var(--card-bridge-width) * -1.015);
          }
          &.tile {
            margin-left: calc(var(--card-tile-width) * -1.015);
          }
        }

        &.bridge {
          margin-top: calc(var(--card-bridge-height) * 0.005 * $i);
        }

        &.tile {
          margin-top: calc(var(--card-tile-height) * 0.005 * $i);
        }
      }
    }

    &.disabled {
      pointer-events: none;
      cursor: not-allowed;
    }
  }
}
</style>
