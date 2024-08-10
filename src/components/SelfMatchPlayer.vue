<template>
  <div v-if="playerMatchData" class="player-item self-player">
    <div v-if="hasCurrentTurn" class="highlight-container">
      <div class="highlight"></div>
    </div>
    <div class="player-details">
      <div class="username"><NamePlate :name="username" /></div>
      <div class="score">Score: {{ score }}</div>
    </div>
    <div class="hand">
      <VisibleCard
          ref="visibleCards"
          v-for="card in handCards"
          :key="card.card_id"
          :cardProp="card"
          :class="['card', { selectable: selectable, selected: isSelected(card) }]"
          :selectable="selectable"
          @update:selected="handleSelected"
      />
    </div>
  </div>
</template>

<script>
import VisibleCard from '@/components/VisibleCard.vue';
import NamePlate from "@/components/NamePlate.vue";
import visibleCardSelectionMixin from '@/mixins/visibleCardSelectionMixin';
import { mapGetters } from 'vuex';

export default {
  name: 'SelfMatchPlayer',
  components: {
    NamePlate,
    VisibleCard
  },
  mixins: [visibleCardSelectionMixin],
  props: {
    matchId: {
      type: Number,
      required: true,
    },
    roundId: {
      type: Number,
      required: true,
    },
    selectable: Boolean
  },
  computed: {
    ...mapGetters({
      getCardsByHandId: 'hands/getCardsByHandId',
      getSelfPlayerMatchDataByMatchId: 'players/getSelfPlayerMatchDataByMatchId',
      getPlayerRoundDataByRoundAndPlayerIds: 'players/getPlayerRoundDataByRoundAndPlayerIds',
      isCurrentTurnForPlayer: 'players/isCurrentTurnForPlayer',
    }),
    handCards() {
      const handId = this.playerRoundData?.hand?.hand_id;
      return handId ? this.getCardsByHandId(handId) : [];
    },
    playerMatchData() {
      return this.getSelfPlayerMatchDataByMatchId(this.matchId);
    },
    playerRoundData() {
      if (!this.roundId) {
        return null;
      }
      return this.getPlayerRoundDataByRoundAndPlayerIds({ roundId: this.roundId, playerId: this.playerMatchData.user_id });
    },
    hasCurrentTurn() {
      return this.isCurrentTurnForPlayer({ roundId: this.roundId, playerId: this.playerMatchData.user_id });
    },
    username() {
      return this.playerMatchData.username;
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
