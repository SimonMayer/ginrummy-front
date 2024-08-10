<template>
  <div v-if="playerMatchData" class="player-item non-self-player">
    <div class="hand">
      <HiddenCard v-for="n in handSize" :key="n" class="card" />
    </div>
    <div class="player-details">
      <div class="username"><NamePlate :name="username" /></div>
      <div class="score">Score: {{ score }}</div>
    </div>
    <div class="highlight-container">
      <div :class="{ 'highlight': hasCurrentTurn }"></div>
    </div>
  </div>
</template>

<script>
import HiddenCard from '@/components/HiddenCard.vue';
import NamePlate from '@/components/NamePlate.vue';
import { mapGetters } from 'vuex';

export default {
  name: 'NonSelfMatchPlayer',
  components: {
    HiddenCard,
    NamePlate
  },
  props: {
    matchId: {
      type: Number,
      required: true,
    },
    roundId: {
      type: Number,
      required: true,
    },
    userId: {
      type: Number,
      required: true,
    },
  },
  computed: {
    ...mapGetters({
      getPlayerMatchDataByMatchAndPlayerIds: 'players/getPlayerMatchDataByMatchAndPlayerIds',
      getPlayerRoundDataByRoundAndPlayerIds: 'players/getPlayerRoundDataByRoundAndPlayerIds',
      isCurrentTurnForPlayer: 'players/isCurrentTurnForPlayer',
    }),
    playerMatchData() {
      return this.getPlayerMatchDataByMatchAndPlayerIds({ matchId: this.matchId, playerId: this.userId });
    },
    playerRoundData() {
      if (!this.roundId) {
        return null;
      }
      return this.getPlayerRoundDataByRoundAndPlayerIds({ roundId: this.roundId, playerId: this.userId });
    },
    hasCurrentTurn() {
      return this.isCurrentTurnForPlayer({ roundId: this.roundId, playerId: this.userId });
    },
    username() {
      return this.playerMatchData.username;
    },
    handSize() {
      return this.playerRoundData?.hand.size || 0;
    },
    score() {
      return this.playerRoundData?.score.total_score || '';
    },
  }
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
