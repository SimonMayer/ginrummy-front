<template>
  <div v-if="playerMatchData" class="player-item self-player">
    <div class="player-details">
      <div class="username">
        <div class="highlight-container">
          <div v-if="hasCurrentTurn" class="highlight"></div>
        </div>
        <NamePlate :name="username"/>
      </div>
      <div class="score">
        <ScoreBoard :totalScore="totalScore" :roundScore="roundScore"/>
      </div>
    </div>
    <div class="hand">
      <VisibleCard
          ref="visibleCards"
          v-for="card in handCards"
          :key="card.card_id"
          :cardProp="card"
          :class="['card', { selectable: selectable }]"
          :selectable="selectable"
      />
    </div>
  </div>
</template>

<script>
import NamePlate from '@/components/NamePlate.vue';
import ScoreBoard from '@/components/ScoreBoard.vue';
import VisibleCard from '@/components/VisibleCard.vue';
import {mapGetters} from 'vuex';

export default {
  name: 'SelfMatchPlayer',
  components: {
    NamePlate,
    ScoreBoard,
    VisibleCard,
  },
  props: {
    selectable: Boolean,
  },
  computed: {
    ...mapGetters({
      handCards: 'trackers/derived/hand/currentHandCards',
      hasCurrentTurn: 'trackers/permissions/core/isCurrentUserTurn',
      playerMatchData: 'trackers/derived/players/selfPlayerMatchData',
      playerRoundData: 'trackers/derived/players/visibleSelfPlayerRoundData',
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
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/globalVariables';
@import '@/assets/cards/variables.css';
@import '@/assets/players';

.highlight-container {
  justify-content: left;
}

.hand {
  height: var(--card-height);
  margin: calc(var(--base-margin) * 2) 0 0 0;
  padding: 0 var(--card-width);

  .card {
    @include card-transform(-40deg, 0deg, 0, 0.2);

    &.selected {
      @include card-transform(-40deg, 3deg, calc(var(--card-height) / -5), 0.2);
    }
  }
}
</style>
