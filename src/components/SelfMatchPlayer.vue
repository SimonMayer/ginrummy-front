<template>
  <div
      v-if="playerMatchData"
      :class="['player-item', 'self-player']"
  >
    <div class="player-details">
      <div class="username">
        <div class="highlight-container">
          <div v-if="hasCurrentTurn" class="highlight"></div>
        </div>
        <NamePlate :name="username"/>
      </div>
      <div class="score">
        <ScoreBoard :roundScore="roundScore" :totalScore="totalScore"/>
      </div>
    </div>
    <div
        :ref="componentSpecificDropAreaRef"
        :class="['hand-drop-area', { 'invites-drop': invitesDrop, 'accepts-drop': acceptsDrop }]"
        @dragenter="handleDragenter"
        @dragleave="handleDragleave"
        @drop="handleDrop"
        @dragover.prevent
    >
      <div class="hand">
        <VisibleCard
            v-for="card in handCards"
            :key="card.card_id"
            :cardProp="card"
            :class="['card', { selectable: canSelectHandCards }]"
            :draggable="canDragCard(card.card_id)"
            :selectable="canSelectHandCards"
        />
      </div>
      <span class="guidance-text">Drop card here to draw it</span>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import NamePlate from '@/components/NamePlate.vue';
import ScoreBoard from '@/components/ScoreBoard.vue';
import VisibleCard from '@/components/VisibleCard.vue';
import {dropRecipientMixin} from '@/mixins/dropRecipientMixin';

export default {
  name: 'SelfMatchPlayer',
  mixins: [dropRecipientMixin],
  components: {
    NamePlate,
    ScoreBoard,
    VisibleCard,
  },
  computed: {
    ...mapGetters({
      handCards: 'sessionState/derived/hand/visibleHandCards',
      playerMatchData: 'sessionState/derived/players/selfPlayerMatchData',
      playerRoundData: 'sessionState/derived/players/visibleSelfPlayerRoundData',
      selectedHandCardCount: 'sessionState/derived/selectedItems/selectedHandCardCount',
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
    componentSpecificDropAreaRef() {
      return 'handDropArea';
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
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/cards/variables.css';
@import '@/assets/dropRecipient';
@import '@/assets/players';

.self-player {
  .highlight-container {
    justify-content: left;
  }

  .hand-drop-area {
    @include drop-recipient;
  }

  .hand {
    height: var(--card-height);
    margin: calc(var(--base-margin) * 2) 0 0 0;
    padding: 0 0 0 calc(0.4 * var(--card-width));

    .card {
      @include card-transform(-40deg, 0deg, calc(var(--card-height) * -0.1), 0.2);

      &.selected {
        @include card-transform(-40deg, 3deg, calc(var(--card-height) * -0.3), 0.2);
      }
    }
  }
}
</style>
