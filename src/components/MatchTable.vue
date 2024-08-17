<template>
  <div class="match-table" v-if="match">
    <div class="game-section full-width">
      <div class="non-self-players-container">
        <NonSelfMatchPlayer
            v-for="playerMatchData in nonSelfPlayersMatchData"
            :key="playerMatchData.user_id"
            :ref="'player-' + playerMatchData.user_id"
            :userId="playerMatchData.user_id"
            class="non-self-player"
        />
      </div>
    </div>
    <div class="game-section row">
      <div class="game-column pile-container">
        <StockPile v-if="visibleRoundId" @draw:stock-pile="handleDrawFromStockPileClick"/>
        <DiscardPile v-if="visibleRoundId"/>
      </div>
      <div class="game-column">
        <div class="melds-container">
          <PlayedMeld
              v-for="meld in visibleRoundMelds"
              :key="meld.meld_id"
              :id="meld.meld_id"
              :type="meld.meld_type"
              :cards="meld.cards"
          />
        </div>
        <div v-if="match.start_time && !currentRoundId" class="buttons-container">
          <button @click="handleStartNewRound">Start new round</button>
        </div>
        <div v-if="canStartMatch" class="buttons-container">
          <button @click="startMatch">Start Match</button>
        </div>
        <div v-if="canAddPlayerToMatch" class="search-container">
          <ItemSearch
              :placeholder="'Search for a player…'"
              :searchFunction="searchUsers"
              :displayProperty="'username'"
              :excludeItems="players"
              :excludeProperty="'user_id'"
              :searchKey="'userSearch'"
              @item-selected="addPlayer"
          />
        </div>
        <GameButtonContainer v-if="currentRoundId"
            :buttonConfigs="[
                {
                  icon: 'DrawOneFromStockIcon',
                  isDisabled: !canDrawOneFromStockPile,
                  labelDisabled: 'Draw one card from the stock pile',
                  labelEnabled: 'Draw one card from the stock pile',
                  pressHandler: handleDrawFromStockPileClick,
                },
                {
                  icon: 'DrawOneFromDiscardIcon',
                  isDisabled: !canDrawOneFromDiscardPile,
                  labelDisabled: 'Draw one card from the discard pile',
                  labelEnabled: 'Draw one card from the discard pile',
                  pressHandler: handleDrawOneFromDiscardPileClick,
                },
                {
                  icon: 'DrawMultipleFromDiscardIcon',
                  isDisabled: !canDrawMultipleFromDiscardPile,
                  labelDisabled: 'Draw multiple cards to play or extend a meld',
                  labelEnabled: 'Draw multiple cards to play or extend a meld',
                  pressHandler: handleDrawMultipleFromDiscardPileClick,
                },
                {
                  addSeparatorBefore: true,
                  icon: 'PlayMeldIcon',
                  isDisabled: !canPlaySetFromHand && !canPlayRunFromHand,
                  labelDisabled: 'Play a meld',
                  labelEnabled: 'Play a meld from the selected cards',
                  pressHandler: handlePlayMeldClick,
                },
                {
                  icon: 'ExtendMeldIcon',
                  isDisabled: !canExtendMeldFromHand,
                  labelDisabled: 'Extend a meld',
                  labelEnabled: 'Extend the selected meld',
                  pressHandler: handleExtendMeldClick,
                },
                {
                  addSeparatorBefore: true,
                  icon: 'DiscardIcon',
                  isDisabled: !canDiscard,
                  labelDisabled: 'Discard one card from your hand',
                  labelEnabled: 'Discard one card from your hand',
                  pressHandler: handleDiscardClick,
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
import roundsService from '@/services/roundsService';
import turnsService from '@/services/turnsService';
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
      currentDiscardPileCardIds: 'sessionState/derived/discardPile/currentDiscardPileCardIds',
      currentTopDiscardPileCard: 'sessionState/derived/discardPile/currentTopDiscardPileCard',
      currentTopDiscardPileCardId: 'sessionState/derived/discardPile/currentTopDiscardPileCardId',
      currentRoundHandId: 'sessionState/derived/hand/currentHandId',
      currentHandCardIds: 'sessionState/derived/hand/currentHandCardIds',
      players: 'sessionState/derived/players/playersMatchData',
      hasAllHandCardsSelected: 'sessionState/derived/selectedItems/hasAllHandCardsSelected',
      hasNoDiscardPileCardsSelected: 'sessionState/derived/selectedItems/hasNoDiscardPileCardsSelected',
      hasNoHandCardsSelected: 'sessionState/derived/selectedItems/hasNoHandCardsSelected',
      hasOneDiscardPileCardSelected: 'sessionState/derived/selectedItems/hasOneDiscardPileCardSelected',
      hasOneHandCardSelected: 'sessionState/derived/selectedItems/hasOneHandCardSelected',
      hasSelectedMeldOrCards: 'sessionState/derived/selectedItems/hasSelectedMeldOrCards',
      isAnyDiscardPileCardSelected: 'sessionState/derived/selectedItems/isAnyDiscardPileCardSelected',
      isAnyDiscardPileCardSelectedBelowTop: 'sessionState/derived/selectedItems/isAnyDiscardPileCardSelectedBelowTop',
      isOnlyTopDiscardPileCardSelected: 'sessionState/derived/selectedItems/isOnlyTopDiscardPileCardSelected',
      lowestSelectedCardIdInDiscardPile: 'sessionState/derived/selectedItems/lowestSelectedCardIdInDiscardPile',
      selectedDiscardPileCardCount: 'sessionState/derived/selectedItems/selectedDiscardPileCardCount',
      selectedDiscardPileCardIds: 'sessionState/derived/selectedItems/selectedDiscardPileCardIds',
      selectedDiscardPileCards: 'sessionState/derived/selectedItems/selectedDiscardPileCards',
      selectedHandCardCount: 'sessionState/derived/selectedItems/selectedHandCardCount',
      selectedHandCardIds: 'sessionState/derived/selectedItems/selectedHandCardIds',
      selectedHandCards: 'sessionState/derived/selectedItems/selectedHandCards',
      selectedMeld: 'sessionState/derived/selectedItems/selectedMeld',
      selectedMeldCards: 'sessionState/derived/selectedItems/selectedMeldCards',
      currentStockPileSize: 'sessionState/derived/stockPile/currentStockPileSize',
      hasDrawActionInCurrentTurn: 'sessionState/derived/turn/hasDrawActionInCurrentTurn',
      canAct: 'sessionState/permissions/core/canAct',
      canDiscard: 'sessionState/permissions/discard/canDiscard',
      canDraw: 'sessionState/permissions/draw/canDraw',
      canDrawMultiple: 'sessionState/permissions/draw/canDrawMultiple',
      canDrawMultipleFromDiscardPile: 'sessionState/permissions/draw/canDrawMultipleFromDiscardPile',
      canDrawOne: 'sessionState/permissions/draw/canDrawOne',
      canDrawOneFromDiscardPile: 'sessionState/permissions/draw/canDrawOneFromDiscardPile',
      canDrawOneFromStockPile: 'sessionState/permissions/draw/canDrawOneFromStockPile',
      canAddPlayerToMatch: 'sessionState/permissions/match/canAddPlayerToMatch',
      canStartMatch: 'sessionState/permissions/match/canStartMatch',
      canExtendMeldFromHand: 'sessionState/permissions/melds/canExtendMeldFromHand',
      canPlayMeldFromHand: 'sessionState/permissions/melds/canPlayMeldFromHand',
      canPlayRunFromHand: 'sessionState/permissions/melds/canPlayRunFromHand',
      canPlaySetFromHand: 'sessionState/permissions/melds/canPlaySetFromHand',
      selectedMeldId: 'sessionState/selections/selectedMeldId',
      gameConfig: 'storage/gameConfig/gameConfig',
      getNonSelfPlayersMatchDataByMatchId: 'storage/players/nonSelf/getNonSelfPlayersMatchDataByMatchId',
      getSelfPlayerMatchDataByMatchId: 'storage/players/self/getSelfPlayerMatchDataByMatchId',
      getPlayerRoundDataByRoundAndPlayerIds: 'storage/players/roundData/getPlayerRoundDataByRoundAndPlayerIds',
      getMeldsByRoundId: 'storage/rounds/melds/getMeldsByRoundId',
    }),
    allowMeldsFromRotation() {
      return this.gameConfig.allowMeldsFromRotation;
    },
    minimumMeldSize() {
      return this.gameConfig.minimumMeldSize;
    },
    runOrders() {
      return this.gameConfig.runOrders;
    },
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
      searchUsers: 'interactions/searches/users/searchUsers',
      logError: 'sessionState/indicators/errorLog/addLogEntry',
      recordLoadingStart: 'sessionState/indicators/loading/recordLoadingStart',
      recordLoadingEnd: 'sessionState/indicators/loading/recordLoadingEnd',
      unselectAllCards: 'sessionState/selections/unselectAllCards',
      addCardIdsToHand: 'storage/hands/addCardIdsToHand',
      removeCardIdsFromHand: 'storage/hands/removeCardIdsFromHand',
      fetchPlayersRoundData: 'storage/players/roundData/fetchPlayersRoundData',
      setLatestActionId: 'storage/registry/matchActions/setLatestActionId',
      setCurrentRoundId: 'storage/registry/matchRounds/setCurrentRoundId',
      fetchCurrentTurn: 'storage/registry/roundTurns/fetchCurrentTurn',
      removeTopDiscardPileCard: 'storage/rounds/discardPiles/removeTopDiscardPileCard',
      initializeSse: 'storage/sse/connection/initializeSse',
      cleanupSse: 'storage/sse/connection/cleanupSse',
    }),
    async performAction(key, action, errorMessage) {
      this.recordLoadingStart(key);
      try {
        await action();
      } catch (error) {
        await this.logError({title: errorMessage, error: error});
      } finally {
        this.recordLoadingEnd(key);
      }
    },
    async handleDrawFromStockPileClick() {
      await this.handleDrawOneFromPileClick('stock');
    },
    async handleDrawOneFromDiscardPileClick() {
      await this.handleDrawOneFromPileClick('discard');
    },
    async handleDrawOneFromPileClick(pileType) {
      if ((pileType === 'discard' && !this.canDrawOneFromDiscardPile) || !this.canDraw) {
        return;
      }
      await this.performAction('drawOne', async () => {
        let cardId;
        if (pileType === 'stock') {
          cardId = this.currentStockPileSize > 0
              ? await turnsService.drawFromStockPile(this.matchId)
              : await turnsService.drawFromEmptyStockPile(this.matchId);
        } else if (pileType === 'discard') {
          cardId = await turnsService.drawOneFromDiscardPile(this.matchId);
          await this.removeTopDiscardPileCard({matchId: this.matchId});
        }
        await this.addCardIdsToHand({handId: this.currentRoundHandId, cardIds: [cardId]});
        await this.unselectAllCards();
      }, `Failed to draw from ${pileType} pile!`);
    },
    async handleDrawMultipleFromDiscardPileClick() {
      if (!this.canDrawMultipleFromDiscardPile) {
        return;
      }
      await this.performAction('drawMultiple', async () => {
        const handCardIds = this.selectedHandCardIds;
        const newHandCardIds = await turnsService.drawMultipleFromDiscardPile(
            this.matchId,
            this.selectedDiscardPileCardIds,
            handCardIds,
            this.selectedMeldId,
        );
        await this.removeCardIdsFromHand({handId: this.currentRoundHandId, cardIds: handCardIds});
        await this.addCardIdsToHand({handId: this.currentRoundHandId, cardIds: newHandCardIds});
        await this.unselectAllCards();
      }, `Failed to draw multiple from discard pile!`);
    },
    async handleDiscardClick() {
      if (!this.canDiscard) {
        return;
      }
      await this.performAction('discard', async () => {
        const cardId = this.selectedHandCardIds[0];
        await turnsService.discardCard(this.matchId, cardId);
        await this.removeCardIdsFromHand({handId: this.currentRoundHandId, cardIds: [cardId]});
        await this.unselectAllCards();
      }, 'Failed to discard card!');
    },
    async handlePlayMeldClick() {
      if (!this.canPlaySetFromHand && !this.canPlayRunFromHand) {
        return;
      }
      const meldType = this.canPlaySetFromHand ? 'set' : 'run';
      await this.performAction('playMeld', async () => {
        const cardIds = this.selectedHandCardIds;
        await turnsService.playMeld(this.matchId, cardIds, meldType);
        await this.removeCardIdsFromHand({handId: this.currentRoundHandId, cardIds: cardIds});
        await this.unselectAllCards();
      }, `Failed to play meld!`);
    },
    async handleExtendMeldClick() {
      if (!this.canExtendMeldFromHand) {
        return;
      }
      await this.performAction('extendMeld', async () => {
        const cardIds = this.selectedHandCardIds;
        await turnsService.extendMeld(this.matchId, this.selectedMeldId, cardIds);
        await this.removeCardIdsFromHand({handId: this.currentRoundHandId, cardIds: cardIds});
        await this.unselectAllCards();
      }, 'Failed to extend meld!');
    },
    async handleStartNewRound() {
      await this.performAction('startNewRound', async () => {
        const roundId = await roundsService.startRound(this.matchId);
        await this.setCurrentRoundId({matchId: this.matchId, roundId: roundId});
        await this.fetchCurrentTurn({matchId: this.matchId, roundId: this.currentRoundId});
        await this.fetchPlayersRoundData({roundId: this.currentRoundId});
      }, 'Failed to start new round!');
    },
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
