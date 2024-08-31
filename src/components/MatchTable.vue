<template>
  <div v-if="match" class="match-table">
    <div class="game-section full-width">
      <div class="non-self-players-container">
        <NonSelfMatchPlayer
            v-for="playerMatchData in nonSelfPlayersMatchData"
            :key="playerMatchData.user_id"
            :userId="playerMatchData.user_id"
            class="non-self-player"
        />
      </div>
    </div>
    <div class="game-section row">
      <div v-if="matchHasStarted" class="game-column pile-container">
        <StockPile/>
        <DiscardPile/>
      </div>
      <div class="game-column">
        <MeldsContainer/>
        <GameButtonContainer class="buttons-container"/>
        <div v-if="matchHasStarted && !currentRoundId" class="buttons-container">
          <button @click="startRound">Start new round</button>
        </div>
        <div v-if="canStartMatch" class="buttons-container">
          <button @click="startMatch">Start Match</button>
        </div>
        <div v-if="canAddPlayerToMatch" class="search-container">
          <ItemSearch
              :displayProperty="'username'"
              :excludeItems="players"
              :excludeProperty="'user_id'"
              :placeholder="'Search for a player…'"
              :searchFunction="searchUsers"
              :searchKey="'userSearch'"
              @item-selected="addPlayer"
          />
        </div>
        <div class="self-player-container">
          <SelfMatchPlayer/>
        </div>
      </div>
    </div>
  </div>
  <DragImages/>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import DiscardPile from '@/components/DiscardPile.vue';
import DragImages from '@/components/DragImages.vue';
import GameButtonContainer from '@/components/GameButtonContainer.vue';
import ItemSearch from '@/components/ItemSearch.vue';
import NonSelfMatchPlayer from '@/components/NonSelfMatchPlayer.vue';
import SelfMatchPlayer from '@/components/SelfMatchPlayer.vue';
import StockPile from '@/components/StockPile.vue';
import MeldsContainer from '@/components/MeldsContainer.vue';

export default {
  name: 'MatchTable',
  components: {
    MeldsContainer,
    DiscardPile,
    DragImages,
    GameButtonContainer,
    ItemSearch,
    NonSelfMatchPlayer,
    SelfMatchPlayer,
    StockPile,
  },
  async mounted() {
    if (this.matchHasStarted) {
      await this.initializeSse(this.matchId);
    }
  },
  async beforeUnmount() {
    await this.cleanupSse(this.matchId);
  },
  computed: {
    ...mapGetters({
      matchHasStarted: 'sessionState/derived/match/hasStarted',
      match: 'sessionState/derived/match/match',
      players: 'sessionState/derived/players/playersMatchData',
      nonSelfPlayersMatchData: 'sessionState/derived/players/nonSelfPlayersMatchData',
      currentRoundId: 'sessionState/derived/rounds/currentRoundId',
      matchId: 'sessionState/matchIdentifier/matchId',
      canAddPlayerToMatch: 'sessionState/permissions/match/canAddPlayerToMatch',
      canStartMatch: 'sessionState/permissions/match/canStartMatch',
    }),
  },
  methods: {
    ...mapActions({
      addPlayer: 'interactions/matches/players/addPlayer',
      startMatch: 'interactions/matches/start/startMatch',
      startRound: 'interactions/rounds/start/startRound',
      searchUsers: 'interactions/searches/users/searchUsers',
      initializeSse: 'storage/sse/connection/initializeSse',
      cleanupSse: 'storage/sse/connection/cleanupSse',
    }),
  },
};
</script>

<style lang="scss" scoped>
@use '@/assets/core/spacing/variables' as spacing;
@use '@/assets/cards/variables' as card;
@use '@/assets/match/variables' as match;

.match-table {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 100%;
  align-items: stretch;
  gap: var(--spacing-margin-standard);

  .game-section {
    &.full-width {
      flex-basis: 100%;
      padding: var(--spacing-padding-standard);
      text-align: center;
    }

    &.row {
      display: flex;
      flex-grow: 1;
      width: 100%;
      align-items: stretch;
    }
  }

  .pile-container {
    display: flex;
    flex-basis: 25%;
    flex-direction: column;
    flex-grow: 3;
    min-width: calc(var(--card-tile-width) * 3);
    align-items: center;
    gap: var(--spacing-margin-standard);
    position: relative;
    padding-right: calc(var(--card-bridge-height) * 0.25);
  }

  .game-column:not(.pile-container) {
    display: flex;
    flex-basis: 75%;
    flex-direction: column;
    flex-shrink: 3;
    justify-content: start;
    gap: var(--spacing-margin-double);
  }

  .buttons-container,
  .melds-container,
  .search-container {
    display: flex;
    gap: var(--spacing-margin-standard);
  }

  .melds-container {
    justify-content: left;
  }

  .buttons-container {
    margin: 0 auto;
  }

  .non-self-players-container {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  .self-player-container {
    display: flex;
    flex-grow: 1;
    width: 100%;
  }
}
</style>
