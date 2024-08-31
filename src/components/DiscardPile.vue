<template>
  <div
      v-if="visibleRoundId"
      :ref="componentSpecificDropAreaRef"
      :class="[
          'discard-pile-container',
          { 'invites-drop': invitesDrop, 'accepts-drop': acceptsDrop, 'tile': tileMode, 'bridge': !tileMode }
      ]"
      @dragenter="handleDragenter"
      @dragleave="handleDragleave"
      @drop="handleDrop"
      @dragover.prevent
  >
    <div
        :ref="'discardPile'"
        :class="['discard-pile', { 'tile': tileMode, 'bridge': !tileMode }]"
    >
      <VisibleCard
          v-for="card in visibleCards"
          :key="card.card_id"
          :cardProp="card"
          :class="['discard-pile-card', { selectable: isCardSelectable(card) }]"
          :draggable="isCardDraggable(card)"
          :selectable="isCardSelectable(card)"
          :tileMode="tileMode"
      />
      <div v-if="isEmpty" class="empty-placeholder">
        <div>Discarded cards will appear here</div>
      </div>
    </div>
    <div class="guidance-tooltip above rightwards">
      <div class="content">Drop card here to discard it</div>
    </div>
  </div>
</template>

<script>
import {onMounted, onUnmounted, ref, watch} from 'vue';
import {mapActions, mapGetters, useStore} from 'vuex';
import VisibleCard from '@/components/VisibleCard.vue';
import {dropRecipientMixin} from '@/mixins/dropRecipientMixin';
import {debounce} from '@/utils/timingUtils';

const BRIDGE_TILE_TOGGLE_BUFFER = 1;
const RESIZE_DEBOUNCE_INTERVAL_MILLISECONDS = 100;

export default {
  name: 'DiscardPile',
  mixins: [dropRecipientMixin],
  components: {
    VisibleCard,
  },
  data() {
    return {
      tileMode: false,
      componentSpecificDropAreaRef: 'discardPileContainer',
    };
  },
  setup() {
    const store = useStore();
    const discardPileContainer = ref(null);
    let resizeObserver = null;

    const onResize = debounce(
        () => store.dispatch('sessionState/domSizing/discardPile/initializeCalculations'),
        RESIZE_DEBOUNCE_INTERVAL_MILLISECONDS,
    );

    onMounted(() => {
      store.dispatch('sessionState/domSizing/discardPile/registerContainerElement', discardPileContainer.value);
      store.dispatch('sessionState/domSizing/discardPile/initializeCalculations');

      resizeObserver = new ResizeObserver(onResize);
      resizeObserver.observe(discardPileContainer.value);
    });

    onUnmounted(() => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    });

    watch(() => store.getters['sessionState/domSizing/viewport/innerWidth'], onResize);
    watch(() => store.getters['sessionState/domSizing/viewport/innerHeight'], onResize);

    return {
      discardPileContainer,
    };
  },
  computed: {
    ...mapGetters({
      selectableCards: 'sessionState/derived/discardPile/selectableDiscardPileCards',
      visibleDiscardPileCardCount: 'sessionState/derived/discardPile/visibleDiscardPileCardCount',
      visibleCards: 'sessionState/derived/discardPile/visibleDiscardPileCards',
      visibleTopDiscardPileCardId: 'sessionState/derived/discardPile/visibleTopDiscardPileCardId',
      visibleRoundId: 'sessionState/derived/rounds/visibleRoundId',
      maximumBridgeCardCapacity: 'sessionState/domSizing/discardPile/maximumBridgeCardCapacity',
      canDiscardCurrentlyDraggedCard: 'sessionState/permissions/discard/canDiscardCurrentlyDraggedCard',
      canStartDraggingCardNowToDrawOneFromDiscardPile: 'sessionState/permissions/draw/canStartDraggingCardNowToDrawOneFromDiscardPile',
      canStartDraggingCardNowToDrawMultiple: 'sessionState/permissions/draw/canStartDraggingCardNowToDrawMultiple',
    }),
    isEmpty() {
      return this.visibleCards?.length === 0;
    },
    componentSpecificDropCriteria() {
      return this.canDiscardCurrentlyDraggedCard;
    },
  },
  methods: {
    ...mapActions({
      discardCard: 'interactions/turns/discard/discardCard',
    }),
    isCardDraggable(card) {
      const cardId = card.card_id;
      return this.canStartDraggingCardNowToDrawMultiple(cardId) ||
          this.canStartDraggingCardNowToDrawOneFromDiscardPile(cardId);
    },
    isCardSelectable(card) {
      return this.selectableCards.includes(card);
    },
    async componentSpecificDropHandler() {
      if (this.canDiscardCurrentlyDraggedCard) {
        return await this.discardCard();
      }
    },
    setTileMode() {
      if (this.maximumBridgeCardCapacity === null) {
        return;
      }
      if (!this.tileMode && this.maximumBridgeCardCapacity < this.visibleDiscardPileCardCount) {
        this.tileMode = true;
      }

      if (
          this.tileMode &&
          this.maximumBridgeCardCapacity >= (this.visibleDiscardPileCardCount + BRIDGE_TILE_TOGGLE_BUFFER)
      ) {
        this.tileMode = false;
      }
    },
  },
  watch: {
    maximumBridgeCardCapacity() {
      this.setTileMode();
    },
    visibleDiscardPileCardCount() {
      this.setTileMode();
    },
  },
};
</script>

<style lang="scss" scoped>
@use '@/assets/core/animation/variables' as animation;
@use '@/assets/core/color/variables' as color;
@use '@/assets/core/spacing/variables' as spacing;
@use '@/assets/cards/variables' as card;
@import '@/assets/dropRecipient';

.discard-pile-container {
  flex-grow: 1;
  @include drop-recipient;

  &.bridge {
    width: var(--card-bridge-height);
  }

  .discard-pile {
    display: flex;
    flex-grow: 1;
    flex-direction: row;
    height: 100%;

    &.bridge {
      position: absolute;
      top: 0;
      left: var(--spacing-margin-double);
      height: var(--card-bridge-height);
      flex-wrap: nowrap;
      justify-content: center;
      padding: calc(var(--card-bridge-height) * 0.1) calc(var(--card-bridge-width) * 0.1);
      transform-origin: top left;
      transform: rotate(90deg) translateY(calc(var(--card-bridge-height) * -1));
    }

    &.tile {
      min-height: calc(var(--card-tile-height) * 1.5);
      min-width: calc(var(--card-tile-width) * 3);
      flex-wrap: wrap;
      justify-content: flex-start;
      align-content: start;
    }

    .selectable {
      cursor: pointer;
    }

    @for $i from 1 through 52 {
      .card:nth-child(#{$i}) {
        &.bridge {
          $rotate: rotate(0);
          @if $i == 1 {
            $rotate: rotate(0.6deg);
          } @else if $i % 5 == 0 {
            $rotate: rotate(-0.3deg);
          } @else if $i % 3 == 0 {
            $rotate: rotate(-1.2deg);
          } @else if $i % 2 == 0 {
            $rotate: rotate(-0.8deg);
          } @else if $i % 2 != 0 {
            $rotate: rotate(1deg);
          }
          transform: $rotate;

          @if $i != 1 {
            margin-left: calc(var(--card-bridge-maximum-overlap) * -1);
          }

          &.selected {
            transform: $rotate translateY(calc(var(--card-bridge-height) * -0.2));
          }
        }

        &.tile {
          &.selected {
            transform: translateY(calc(var(--card-tile-height) * -0.2));
          }
        }
      }
    }

    .empty-placeholder {
      display: flex;
      box-sizing: border-box;
      align-items: center;
      justify-content: center;
      background-color: rgba(color.$secondary, 0.8);
      border: dashed calc(var(--card-border-width) * 5) color.$muted-light;
      border-radius: var(--card-border-radius);
      font-size: var(--card-placeholder-font-size);
      color: color.$muted-light;
      padding: var(--spacing-padding-standard);
    }

    &.bridge {
      .empty-placeholder {
        height: var(--card-bridge-height);
        width: var(--card-bridge-width);

        div {
          transform: rotate(-90deg);
          margin: var(--spacing-margin-standard);
        }
      }
    }

    &.tile {
      .empty-placeholder {
        height: calc(var(--card-tile-height) * 1.5);
        width: 100%;
      }
    }
  }
}
</style>
