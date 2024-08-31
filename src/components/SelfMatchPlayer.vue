<template>
  <div
      v-if="playerMatchData"
      :class="['player-item', 'self-player']"
  >
    <div class="player-details">
      <div class="left-column">
        <div class="top-row">
          <div class="highlight-container">
            <div :class="{ 'highlight': hasCurrentTurn }"></div>
          </div>
        </div>
        <div class="username">
          <NamePlate :name="username"/>
        </div>
      </div>
      <div class="score">
        <ScoreBoard :roundScore="roundScore" :totalScore="totalScore"/>
      </div>
    </div>
    <div
        :ref="componentSpecificDropAreaRef"
        :class="[
            'hand-container',
            { 'invites-drop': invitesDrop, 'accepts-drop': acceptsDrop, 'tile': tileMode, 'bridge': !tileMode }
        ]"
        @dragenter="handleDragenter"
        @dragleave="handleDragleave"
        @drop="handleDrop"
        @dragover.prevent
    >
      <div :class="['hand', { 'tile': tileMode, 'bridge': !tileMode }]">
        <VisibleCard
            v-for="card in handCards"
            :key="card.card_id"
            :cardProp="card"
            :class="['self-hand-card', { selectable: canSelectHandCards }]"
            :draggable="canDragCard(card.card_id)"
            :selectable="canSelectHandCards"
            :tileMode="tileMode"
        />
      </div>
      <div class="guidance-tooltip above leftwards">
        <div class="content">Drop card here to draw it</div>
      </div>
    </div>
  </div>
</template>

<script>
import {onMounted, onUnmounted, ref, watch} from 'vue';
import {mapActions, mapGetters, useStore} from 'vuex';
import NamePlate from '@/components/NamePlate.vue';
import ScoreBoard from '@/components/ScoreBoard.vue';
import VisibleCard from '@/components/VisibleCard.vue';
import {dropRecipientMixin} from '@/mixins/dropRecipientMixin';
import {debounce} from '@/utils/timingUtils';

const BRIDGE_TILE_TOGGLE_BUFFER = 1;
const RESIZE_DEBOUNCE_INTERVAL_MILLISECONDS = 100;

export default {
  name: 'SelfMatchPlayer',
  mixins: [dropRecipientMixin],
  components: {
    NamePlate,
    ScoreBoard,
    VisibleCard,
  },
  data() {
    return {
      tileMode: false,
      componentSpecificDropAreaRef: 'handContainer',
    };
  },
  setup() {
    const store = useStore();
    const handContainer = ref(null);
    let resizeObserver = null;

    const onResize = debounce(
        () => store.dispatch('sessionState/domSizing/selfHand/initializeCalculations'),
        RESIZE_DEBOUNCE_INTERVAL_MILLISECONDS,
    );

    onMounted(() => {
      store.dispatch('sessionState/domSizing/selfHand/registerContainerElement', handContainer.value);
      store.dispatch('sessionState/domSizing/selfHand/initializeCalculations');

      resizeObserver = new ResizeObserver(onResize);
      resizeObserver.observe(handContainer.value);
    });

    onUnmounted(() => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    });

    watch(() => store.getters['sessionState/domSizing/viewport/innerWidth'], onResize);
    watch(() => store.getters['sessionState/domSizing/viewport/innerHeight'], onResize);

    return {
      handContainer,
    };
  },
  computed: {
    ...mapGetters({
      handCardCount: 'sessionState/derived/hand/visibleHandCardCount',
      handCards: 'sessionState/derived/hand/visibleHandCards',
      playerMatchData: 'sessionState/derived/players/selfPlayerMatchData',
      playerRoundData: 'sessionState/derived/players/visibleSelfPlayerRoundData',
      selectedHandCardCount: 'sessionState/derived/selectedItems/selectedHandCardCount',
      maximumBridgeCardCapacity: 'sessionState/domSizing/selfHand/maximumBridgeCardCapacity',
      hasCurrentTurn: 'sessionState/permissions/core/isCurrentUserTurn',
      canStartDraggingCardNowToDiscard: 'sessionState/permissions/discard/canStartDraggingCardNowToDiscard',
      canDrawCurrentlyDraggedItemAsOneFromDiscardPile: 'sessionState/permissions/draw/canDrawCurrentlyDraggedItemAsOneFromDiscardPile',
      canDrawCurrentlyDraggedItemAsOneFromStockPile: 'sessionState/permissions/draw/canDrawCurrentlyDraggedItemAsOneFromStockPile',
      canStartDraggingCardNowToDrawMultiple: 'sessionState/permissions/draw/canStartDraggingCardNowToDrawMultiple',
      canSelectHandCards: 'sessionState/permissions/hand/canSelectHandCards',
      canStartDraggingCardNowFromHandToExtendMeld: 'sessionState/permissions/melds/canStartDraggingCardNowFromHandToExtendMeld',
      canStartDraggingCardNowFromHandToPlayMeld: 'sessionState/permissions/melds/canStartDraggingCardNowFromHandToPlayMeld',
      draggedNamedHiddenCard: 'sessionState/uiOperations/dragState/draggedNamedHiddenCard',
      isCardSelected: 'sessionState/uiOperations/selections/isCardSelected',
    }),
    username() {
      return this.playerMatchData.username;
    },
    totalScore() {
      const score = this.playerRoundData?.score.total_score;
      return Number.isInteger(score) ? score : null;
    },
    roundScore() {
      const score = this.playerRoundData?.score.points_this_round;
      return Number.isInteger(score) ? score : null;
    },
    componentSpecificDropCriteria() {
      return this.canDrawCurrentlyDraggedItemAsOneFromStockPile || this.canDrawCurrentlyDraggedItemAsOneFromDiscardPile;
    },
  },
  methods: {
    ...mapActions({
      drawOneFromDiscardPile: 'interactions/turns/draw/drawOneFromDiscardPile',
      drawOneFromStockPile: 'interactions/turns/draw/drawOneFromStockPile',
    }),
    canDragCard(cardId) {
      return this.canStartDraggingCardNowToDrawMultiple(cardId) ||
          this.canStartDraggingCardNowFromHandToPlayMeld(cardId) ||
          this.canStartDraggingCardNowFromHandToExtendMeld(cardId) ||
          this.canStartDraggingCardNowToDiscard(cardId);
    },
    async componentSpecificDropHandler() {
      if (this.canDrawCurrentlyDraggedItemAsOneFromDiscardPile) {
        return await this.drawOneFromDiscardPile();
      }

      if (this.canDrawCurrentlyDraggedItemAsOneFromStockPile) {
        return await this.drawOneFromStockPile();
      }
    },
    setTileMode() {
      if (this.maximumBridgeCardCapacity === null) {
        return;
      }
      if (!this.tileMode && this.maximumBridgeCardCapacity < this.handCardCount) {
        this.tileMode = true;
      }

      if (
          this.tileMode &&
          this.maximumBridgeCardCapacity >= (this.handCardCount + BRIDGE_TILE_TOGGLE_BUFFER)
      ) {
        this.tileMode = false;
      }
    },
  },
  watch: {
    maximumBridgeCardCapacity() {
      this.setTileMode();
    },
    handCardCount() {
      this.setTileMode();
    },
  },
};
</script>

<style lang="scss" scoped>
@use '@/assets/core/spacing/variables' as spacing;
@use '@/assets/cards/variables' as card;
@import '@/assets/dropRecipient';
@import '@/assets/players';

.self-player {
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  .highlight-container {
    justify-content: left;
  }

  .hand-container {
    display: flex;
    flex-grow: 1;

    @include drop-recipient;

    .hand {
      &.bridge {
        height: var(--card-bridge-height);
        margin: var(--spacing-margin-double) 0 0 0;
        padding: 0 0 0 calc(0.4 * var(--card-bridge-width));

        .card {
          @include card-transform(-40deg, 0deg, calc(var(--card-bridge-height) * -0.1), 0.2);

          &.selected {
            @include card-transform(-40deg, 3deg, calc(var(--card-bridge-height) * -0.3), 0.2);
          }
        }
      }

      &.tile {
        align-content: start;

        .card {
          &.selected {
            transform: translateY(calc(var(--card-tile-height) * -0.2));
          }
        }
      }
    }
  }
}
</style>
