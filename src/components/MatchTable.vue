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
      <div class="game-column pile-container">
        <StockPile/>
        <DiscardPile/>
      </div>
      <div class="game-column">
        <div class="melds-container">
          <PlayArea/>
          <PlayedMeld
              v-for="meld in visibleMelds"
              :id="meld.meld_id"
              :key="meld.meld_id"
              :cards="meld.cards"
              :type="meld.meld_type"
          />
        </div>
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
import PlayArea from '@/components/PlayArea.vue';
import PlayedMeld from '@/components/PlayedMeld.vue';
import SelfMatchPlayer from '@/components/SelfMatchPlayer.vue';
import StockPile from '@/components/StockPile.vue';

export default {
  name: 'MatchTable',
  components: {
    DiscardPile,
    DragImages,
    GameButtonContainer,
    ItemSearch,
    NonSelfMatchPlayer,
    PlayArea,
    PlayedMeld,
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
      visibleMelds: 'sessionState/derived/melds/visibleMelds',
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
      width: 100%;

      .column {
        flex: 1;
        padding: var(--spacing-padding-standard);
        text-align: center;
      }
    }
  }

  .pile-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-margin-standard);
    height: 100%;
    position: relative;
    padding-right: calc(var(--card-height) * 0.25);

    .stock-pile-container, .discard-pile {
      transform-origin: top left;
      transform: rotate(90deg) translateY(calc(var(--card-height) * -1));
    }

    .discard-pile {
      position: absolute;
      top: calc((var(--card-width) * 1.2) + var(--spacing-margin-standard));
      left: var(--spacing-margin-double);
    }
  }

  .game-column:not(.pile-container) {
    flex: 1; // Take up remaining space
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: var(--spacing-margin-standard);
  }

  .buttons-container,
  .melds-container,
  .search-container {
    display: flex;
    gap: var(--spacing-margin-standard);
    justify-content: center;
  }

  .melds-container {
    flex-flow: row wrap;
  }

  .buttons-container,
  .search-container {
    margin: 0 auto;
    width: 520px;
  }

  .buttons-container {
    height: var(--match-button-container-height);
  }

  .non-self-players-container {
    display: flex;
    justify-content: space-between;
    width: 100%;
  }

  .self-player-container {
    display: flex;
    justify-content: center;
    width: 100%;
  }
}
</style>
