<template>
  <div class="player-item non-self-player" :class="{ 'highlighted': highlightPlayer }">
    <div class="hand">
      <HiddenCard v-for="n in hiddenCardCount" :key="n" class="card" />
    </div>
    <div class="melds-container">
      <PlayedMeld
          v-for="meld in melds"
          :key="meld.meld_id"
          :id="meld.meld_id"
          :type="meld.meld_type"
          :cards="meld.cards"
      />
    </div>
    <div class="player-details">
      <NamePlate :name="username" />
      <div class="score">Score: {{ score }}</div>
    </div>
  </div>
</template>

<script>
import HiddenCard from '@/components/HiddenCard.vue';
import PlayedMeld from '@/components/PlayedMeld.vue';
import NamePlate from '@/components/NamePlate.vue';

export default {
  name: 'NonSelfMatchPlayer',
  components: {
    HiddenCard,
    PlayedMeld,
    NamePlate
  },
  props: {
    username: String,
    hiddenCardCount: Number,
    highlightPlayer: Boolean,
    melds: Array,
    score: Number
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/globalVariables';
@import '@/assets/cards/variables.css';
@import '@/assets/players';

.hand {
  height: calc(var(--card-height) * 0.4);

  .card {
    @include card-transform(-60deg, 0deg, 0, -1);

    &.selected {
      @include card-transform(-60deg, 3deg, calc(var(--card-height) / -5), -1);
    }
  }
}
</style>
