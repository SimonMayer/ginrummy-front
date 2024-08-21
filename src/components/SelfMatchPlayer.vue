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
        :class="['hand', { 'accepts-drop': acceptsDrop }]"
        @dragenter="handleDragenter"
        @dragleave="handleDragleave"
        @drop="handleDrop"
        @dragover.prevent
    >
      <VisibleCard
          v-for="card in handCards"
          :key="card.card_id"
          :cardProp="card"
          :class="['card', { selectable: canSelectHandCards }]"
          :draggable="canDragCard(card.card_id)"
          :selectable="canSelectHandCards"
      />
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
      isOnlyTopDiscardPileCardDragged: 'sessionState/derived/draggedItems/isOnlyTopDiscardPileCardDragged',
      handCards: 'sessionState/derived/hand/visibleHandCards',
      playerMatchData: 'sessionState/derived/players/selfPlayerMatchData',
      playerRoundData: 'sessionState/derived/players/visibleSelfPlayerRoundData',
      selectedHandCardCount: 'sessionState/derived/selectedItems/selectedHandCardCount',
      hasCurrentTurn: 'sessionState/permissions/core/isCurrentUserTurn',
      canDiscardByDragging: 'sessionState/permissions/discard/canDiscardByDragging',
      canDrawOneFromDiscardPile: 'sessionState/permissions/draw/canDrawOneFromDiscardPile',
      canDrawOneFromStockPile: 'sessionState/permissions/draw/canDrawOneFromStockPile',
      canDrawMultiple: 'sessionState/permissions/draw/canDrawMultiple',
      canSelectHandCards: 'sessionState/permissions/hand/canSelectHandCards',
      canExtendMelds: 'sessionState/permissions/melds/canExtendMelds',
      canPlayMeld: 'sessionState/permissions/melds/canPlayMeld',
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
    acceptsDrop() {
      return this.provisionallyAcceptsDrop && this.canDrawOneFromDiscardPile;
    },
  },
  methods: {
    ...mapActions({
      drawOneFromDiscardPile: 'interactions/turns/draw/drawOneFromDiscardPile',
      drawOneFromStockPile: 'interactions/turns/draw/drawOneFromStockPile',
    }),
    canDragCard(cardId) {
      return this.canDrawMultiple ||
          this.canPlayMeld ||
          this.canExtendMelds ||
          (this.canDiscardByDragging && (this.isCardSelected(cardId) || this.selectedHandCardCount === 0));
    },
    async handleDrop() {
      if (this.canDrawOneFromDiscardPile && this.isOnlyTopDiscardPileCardDragged) {
        await this.drawOneFromDiscardPile();
      } else if (this.canDrawOneFromStockPile && (this.draggedNamedHiddenCard === 'topCardInStockPile')) {
        await this.drawOneFromStockPile();
      }
      this.clearDraggedItems();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/globalVariables';
@import '@/assets/cards/variables.css';
@import '@/assets/dropRecipient';
@import '@/assets/players';

.self-player {
  .highlight-container {
    justify-content: left;
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

    @include drop-recipient;
  }
}
</style>
