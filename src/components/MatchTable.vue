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
        <StockPile v-if="visibleRoundId" @draw:stock-pile="drawOneFromStockPile"/>
        <DiscardPile v-if="visibleRoundId"/>
      </div>
      <div class="game-column">
        <div class="melds-container">
          <PlayedMeld
              v-for="meld in visibleRoundMelds"
              :id="meld.meld_id"
              :key="meld.meld_id"
              :cards="meld.cards"
              :type="meld.meld_type"
          />
        </div>
        <div v-if="match.start_time && !currentRoundId" class="buttons-container">
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
        <GameButtonContainer
            v-if="currentRoundId"
            :buttonConfigs="[
                {
                  icon: 'DrawOneFromStockIcon',
                  isDisabled: !canDrawOneFromStockPile,
                  labelDisabled: 'Draw one card from the stock pile',
                  labelEnabled: 'Draw one card from the stock pile',
                  pressHandler: drawOneFromStockPile,
                },
                {
                  icon: 'DrawOneFromDiscardIcon',
                  isDisabled: !canDrawOneFromDiscardPile,
                  labelDisabled: 'Draw one card from the discard pile',
                  labelEnabled: 'Draw one card from the discard pile',
                  pressHandler: drawOneFromDiscardPile,
                },
                {
                  icon: 'DrawMultipleFromDiscardIcon',
                  isDisabled: !canDrawMultipleFromDiscardPile,
                  labelDisabled: 'Draw multiple cards to play or extend a meld',
                  labelEnabled: 'Draw multiple cards to play or extend a meld',
                  pressHandler: drawMultipleFromDiscardPile,
                },
                {
                  addSeparatorBefore: true,
                  icon: 'PlayMeldIcon',
                  isDisabled: !canPlaySetFromHand && !canPlayRunFromHand,
                  labelDisabled: 'Play a meld',
                  labelEnabled: 'Play a meld from the selected cards',
                  pressHandler: playMeld,
                },
                {
                  icon: 'ExtendMeldIcon',
                  isDisabled: !canExtendMeldFromHand,
                  labelDisabled: 'Extend a meld',
                  labelEnabled: 'Extend the selected meld',
                  pressHandler: extendMeld,
                },
                {
                  addSeparatorBefore: true,
                  icon: 'DiscardIcon',
                  isDisabled: !canDiscard,
                  labelDisabled: 'Discard one card from your hand',
                  labelEnabled: 'Discard one card from your hand',
                  pressHandler: discardCard,
                },
                {
                  addSeparatorBefore: true,
                  icon: 'UnselectCardsIcon',
                  isDisabled: !hasSelectedMeldOrCards,
                  labelDisabled: 'You don\'t have any cards or melds selected.',
                  labelEnabled: 'Unselect all cards and melds',
                  pressHandler: unselectAllCards,
                },
            ]"
        />
        <div class="self-player-container">
          <SelfMatchPlayer v-if="selfPlayerMatchData" :selectable="isHandSelectable" class="self-player"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GameButtonContainer from '@/components/GameButtonContainer.vue';
import PlayedMeld from '@/components/PlayedMeld.vue';
import StockPile from '@/components/StockPile.vue';
import DiscardPile from '@/components/DiscardPile.vue';
import SelfMatchPlayer from '@/components/SelfMatchPlayer.vue';
import NonSelfMatchPlayer from '@/components/NonSelfMatchPlayer.vue';
import {mapActions, mapGetters} from 'vuex';
import matchPhaseMixin from '@/mixins/matchPhaseMixin';
import ItemSearch from '@/components/ItemSearch.vue';

export default {
  name: 'MatchTable',
  components: {
    ItemSearch,
    GameButtonContainer,
    PlayedMeld,
    StockPile,
    DiscardPile,
    SelfMatchPlayer,
    NonSelfMatchPlayer,
  },
  mixins: [
    matchPhaseMixin,
  ],
  async mounted() {
    if (this.match.start_time) {
      await this.initializeSse(this.matchId);
    }
  },
  async beforeUnmount() {
    await this.cleanupSse(this.matchId);
  },
  computed: {
    ...mapGetters({
      players: 'sessionState/derived/players/playersMatchData',
      hasSelectedMeldOrCards: 'sessionState/derived/selectedItems/hasSelectedMeldOrCards',
      hasDrawActionInCurrentTurn: 'sessionState/derived/turn/hasDrawActionInCurrentTurn',
      canAct: 'sessionState/permissions/core/canAct',
      canDiscard: 'sessionState/permissions/discard/canDiscard',
      canDrawMultiple: 'sessionState/permissions/draw/canDrawMultiple',
      canDrawMultipleFromDiscardPile: 'sessionState/permissions/draw/canDrawMultipleFromDiscardPile',
      canDrawOneFromDiscardPile: 'sessionState/permissions/draw/canDrawOneFromDiscardPile',
      canDrawOneFromStockPile: 'sessionState/permissions/draw/canDrawOneFromStockPile',
      canAddPlayerToMatch: 'sessionState/permissions/match/canAddPlayerToMatch',
      canStartMatch: 'sessionState/permissions/match/canStartMatch',
      canExtendMeldFromHand: 'sessionState/permissions/melds/canExtendMeldFromHand',
      canPlayRunFromHand: 'sessionState/permissions/melds/canPlayRunFromHand',
      canPlaySetFromHand: 'sessionState/permissions/melds/canPlaySetFromHand',
      getNonSelfPlayersMatchDataByMatchId: 'storage/players/nonSelf/getNonSelfPlayersMatchDataByMatchId',
      getSelfPlayerMatchDataByMatchId: 'storage/players/self/getSelfPlayerMatchDataByMatchId',
      getMeldsByRoundId: 'storage/rounds/melds/getMeldsByRoundId',
    }),
    visibleRoundMelds() {
      return this.getMeldsByRoundId(this.visibleRoundId);
    },
    nonSelfPlayersMatchData() {
      return this.getNonSelfPlayersMatchDataByMatchId(this.matchId);
    },
    selfPlayerMatchData() {
      return this.getSelfPlayerMatchDataByMatchId(this.matchId);
    },
    isHandSelectable() {
      return this.canDrawMultiple || (this.canAct && this.hasDrawActionInCurrentTurn);
    },
  },
  methods: {
    ...mapActions({
      addPlayer: 'interactions/matches/players/addPlayer',
      startMatch: 'interactions/matches/start/startMatch',
      startRound: 'interactions/rounds/start/startRound',
      searchUsers: 'interactions/searches/users/searchUsers',
      discardCard: 'interactions/turns/discard/discardCard',
      drawOneFromStockPile: 'interactions/turns/draw/drawOneFromStockPile',
      drawOneFromDiscardPile: 'interactions/turns/draw/drawOneFromDiscardPile',
      drawMultipleFromDiscardPile: 'interactions/turns/draw/drawMultipleFromDiscardPile',
      extendMeld: 'interactions/turns/melds/extendMeld',
      playMeld: 'interactions/turns/melds/playMeld',
      unselectAllCards: 'sessionState/selections/unselectAllCards',
      initializeSse: 'storage/sse/connection/initializeSse',
      cleanupSse: 'storage/sse/connection/cleanupSse',
    }),
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/globalVariables';

.match-table {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: var(--base-margin);

  .game-section {
    &.full-width {
      flex-basis: 100%;
      padding: var(--base-padding);
      text-align: center;
    }

    &.row {
      display: flex;
      width: 100%;

      .column {
        flex: 1;
        padding: var(--base-padding);
        text-align: center;
      }
    }
  }

  .pile-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--base-margin);
    height: 100%;
    position: relative;

    .stock-pile-container, .discard-pile {
      transform-origin: top left;
      transform: rotate(90deg) translateY(calc(var(--card-height) * -1));
    }

    .discard-pile {
      position: absolute;
      top: calc((var(--card-width) * 1.2) + var(--base-margin));
      left: calc(2 * var(--base-margin));
    }
  }

  .game-column:not(.pile-container) {
    flex: 1; // Take up remaining space
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: var(--base-margin);
  }

  .buttons-container,
  .melds-container,
  .search-container {
    display: flex;
    gap: var(--base-margin);
    justify-content: center;
  }

  .melds-container {
    flex-flow: row wrap;
  }

  .buttons-container,
  .search-container {
    width: 100%;
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
