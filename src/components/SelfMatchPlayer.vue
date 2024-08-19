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
import NamePlate from '@/components/NamePlate.vue';
import ScoreBoard from '@/components/ScoreBoard.vue';
import VisibleCard from '@/components/VisibleCard.vue';
import {mapActions, mapGetters} from 'vuex';
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
      canDiscardByDragging: 'sessionState/permissions/discard/canDiscardByDragging',
      canDrawOneFromDiscardPile: 'sessionState/permissions/draw/canDrawOneFromDiscardPile',
      canSelectHandCards: 'sessionState/permissions/hand/canSelectHandCards',
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
    }),
    canDragCard(cardId) {
      return this.canDiscardByDragging && (this.isCardSelected(cardId) || this.selectedHandCardCount === 0);
    },
    async handleDrop() {
      if (this.canDrawOneFromDiscardPile) {
        await this.drawOneFromDiscardPile();
      }
      this.clearDraggedCards();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/globalVariables';
@import '@/assets/cards/variables.css';
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

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: transparent;
      transition: background-color 0.3s ease;
      pointer-events: none;
      z-index: 1;
    }

    &.accepts-drop {
      &::before {
        background-color: rgba(var(--accent-color-rgb), 0.25);
      }
    }
  }
}
</style>
