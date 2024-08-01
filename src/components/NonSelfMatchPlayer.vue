<template>
  <div v-if="player" class="player-item non-self-player">
    <div class="hand">
      <HiddenCard v-for="n in player.handSize" :key="n" class="card" />
    </div>
    <div class="player-details">
      <div class="username"><NamePlate :name="player.username" /></div>
      <div class="score">Score: {{ player.score }}</div>
    </div>
    <div class="highlight-container">
      <div :class="{ 'highlight': player.hasCurrentTurn }"></div>
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
    userId: {
      type: Number,
      required: true
    }
  },
  computed: {
    ...mapGetters(['getPlayerById']),
    player() {
      return this.getPlayerById(this.userId);
    }
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
