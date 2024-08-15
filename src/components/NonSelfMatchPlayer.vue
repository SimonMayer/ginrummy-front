<template>
  <div v-if="playerMatchData" class="player-item non-self-player">
    <div class="hand">
      <HiddenCard v-for="n in handSize" :key="n" class="card"/>
    </div>
    <div class="player-details">
      <div class="username">
        <NamePlate :name="username"/>
      </div>
      <div class="score">
        <ScoreBoard :totalScore="totalScore" :roundScore="roundScore"/>
      </div>
    </div>
    <div class="highlight-container">
      <div :class="{ 'highlight': hasCurrentTurn }"></div>
    </div>
  </div>
</template>

<script>
import HiddenCard from '@/components/HiddenCard.vue';
import NamePlate from '@/components/NamePlate.vue';
import ScoreBoard from '@/components/ScoreBoard.vue';
import {mapGetters} from 'vuex';
import matchPhaseMixin from '@/mixins/matchPhaseMixin';

export default {
  name: 'NonSelfMatchPlayer',
  components: {
    ScoreBoard,
    HiddenCard,
    NamePlate,
  },
  mixins: [matchPhaseMixin],
  props: {
    userId: {
      type: Number,
      required: true,
    },
  },
  computed: {
    ...mapGetters({
      getPlayerMatchDataByMatchAndPlayerIds: 'storage/players/match/getPlayerMatchDataByMatchAndPlayerIds',
      getPlayerRoundDataByRoundAndPlayerIds: 'storage/players/round/getPlayerRoundDataByRoundAndPlayerIds',
      isCurrentTurnForPlayer: 'storage/players/round/isCurrentTurnForPlayer',
    }),
    playerMatchData() {
      return this.getPlayerMatchDataByMatchAndPlayerIds({matchId: this.matchId, playerId: this.userId});
    },
    playerRoundData() {
      if (!this.visibleRoundId) {
        return null;
      }
      return this.getPlayerRoundDataByRoundAndPlayerIds({roundId: this.visibleRoundId, playerId: this.userId});
    },
    hasCurrentTurn() {
      return this.isCurrentTurnForPlayer({roundId: this.visibleRoundId, playerId: this.userId});
    },
    username() {
      return this.playerMatchData.username;
    },
    handSize() {
      return this.playerRoundData?.hand.size || 0;
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

.non-self-player {
  margin: calc(var(--card-height) / 2) 0 0 0;

  .highlight-container {
    justify-content: right;
  }

  .hand {
    height: 0;

    .card {
      @include card-transform(-60deg, 0deg, 0, -1);
    }
  }
}
</style>
