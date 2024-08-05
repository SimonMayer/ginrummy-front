<template>
  <div v-if="selfPlayer" class="player-item self-player">
    <div v-if="selfPlayer.hasCurrentTurn" class="highlight-container">
      <div class="highlight"></div>
    </div>
    <div class="player-details">
      <div class="username"><NamePlate :name="selfPlayer.username" /></div>
      <div class="score">Score: {{ selfPlayer.score }}</div>
    </div>
    <div class="hand">
      <VisibleCard
          ref="visibleCards"
          v-for="card in myHand"
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
    selectable: Boolean
  },
  computed: {
    ...mapGetters({
      myHand: 'hand/myHand',
      getSelfPlayerByMatchId: 'players/getSelfPlayerByMatchId',
    }),
    selfPlayer() {
      return this.getSelfPlayerByMatchId(this.matchId);
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
