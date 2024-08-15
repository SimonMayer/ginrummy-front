<template>
  <div class="match-table" v-if="match && match.start_time">
    <div class="game-section full-width">
      <div v-if="visibleRoundId" class="non-self-players-container">
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
        <div v-if="!currentRoundId" class="buttons-container">
          <button @click="handleStartNewRound">Start new round</button>
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
          <SelfMatchPlayer
              v-if="visibleRoundId && selfPlayerMatchData"
              :key="selfPlayerMatchData.user_id"
              :selectable="isHandSelectable"
              class="self-player"
          />
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

export default {
  name: 'MatchTable',
  components: {
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
  async created() {
    await this.fetchGameConfig({});
    await this.loadAllData(false);
  },
  beforeUnmount() {
    this.cleanupSse(this.matchId);
  },
  computed: {
    ...mapGetters({
      gameConfig: 'gameConfig/gameConfig',
      getCardsByHandId: 'hands/getCardsByHandId',
      getMatchById: 'matches/matches/getMatchById',
      getNonSelfPlayersMatchDataByMatchId: 'players/nonSelf/getNonSelfPlayersMatchDataByMatchId',
      getSelfPlayerMatchDataByMatchId: 'players/self/getSelfPlayerMatchDataByMatchId',
      getPlayerRoundDataByRoundAndPlayerIds: 'players/round/getPlayerRoundDataByRoundAndPlayerIds',
      getMeldsByRoundId: 'rounds/melds/getMeldsByRoundId',
      currentDiscardPileCardIds: 'trackers/derived/discardPile/currentDiscardPileCardIds',
      currentTopDiscardPileCard: 'trackers/derived/discardPile/currentTopDiscardPileCard',
      currentTopDiscardPileCardId: 'trackers/derived/discardPile/currentTopDiscardPileCardId',
      hasDrawActionInCurrentTurn: 'trackers/derived/draw/hasDrawActionInCurrentTurn',
      currentHandCardIds: 'trackers/derived/hand/currentHandCardIds',
      hasAllHandCardsSelected: 'trackers/derived/selected/hasAllHandCardsSelected',
      hasNoDiscardPileCardsSelected: 'trackers/derived/selected/hasNoDiscardPileCardsSelected',
      hasNoHandCardsSelected: 'trackers/derived/selected/hasNoHandCardsSelected',
      hasOneDiscardPileCardSelected: 'trackers/derived/selected/hasOneDiscardPileCardSelected',
      hasOneHandCardSelected: 'trackers/derived/selected/hasOneHandCardSelected',
      hasSelectedMeldOrCards: 'trackers/derived/selected/hasSelectedMeldOrCards',
      isAnyDiscardPileCardSelected: 'trackers/derived/selected/isAnyDiscardPileCardSelected',
      isAnyDiscardPileCardSelectedBelowTop: 'trackers/derived/selected/isAnyDiscardPileCardSelectedBelowTop',
      isOnlyTopDiscardPileCardSelected: 'trackers/derived/selected/isOnlyTopDiscardPileCardSelected',
      lowestSelectedCardIdInDiscardPile: 'trackers/derived/selected/lowestSelectedCardIdInDiscardPile',
      selectedDiscardPileCardCount: 'trackers/derived/selected/selectedDiscardPileCardCount',
      selectedDiscardPileCardIds: 'trackers/derived/selected/selectedDiscardPileCardIds',
      selectedDiscardPileCards: 'trackers/derived/selected/selectedDiscardPileCards',
      selectedHandCardCount: 'trackers/derived/selected/selectedHandCardCount',
      selectedHandCardIds: 'trackers/derived/selected/selectedHandCardIds',
      selectedHandCards: 'trackers/derived/selected/selectedHandCards',
      selectedMeld: 'trackers/derived/selected/selectedMeld',
      selectedMeldCards: 'trackers/derived/selected/selectedMeldCards',
      currentStockPileSize: 'trackers/derived/stockPile/currentStockPileSize',
      canAct: 'trackers/permissions/core/canAct',
      canDiscard: 'trackers/permissions/discard/canDiscard',
      canDraw: 'trackers/permissions/draw/canDraw',
      canDrawMultiple: 'trackers/permissions/draw/canDrawMultiple',
      canDrawMultipleFromDiscardPile: 'trackers/permissions/draw/canDrawMultipleFromDiscardPile',
      canDrawOne: 'trackers/permissions/draw/canDrawOne',
      canDrawOneFromDiscardPile: 'trackers/permissions/draw/canDrawOneFromDiscardPile',
      canDrawOneFromStockPile: 'trackers/permissions/draw/canDrawOneFromStockPile',
      canExtendMeldFromHand: 'trackers/permissions/melds/canExtendMeldFromHand',
      canPlayMeldFromHand: 'trackers/permissions/melds/canPlayMeldFromHand',
      canPlayRunFromHand: 'trackers/permissions/melds/canPlayRunFromHand',
      canPlaySetFromHand: 'trackers/permissions/melds/canPlaySetFromHand',
      selectedMeldId: 'trackers/selections/selectedMeldId',
      loading: 'trackers/loading/loading',
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
    currentRoundHandId() {
      return this.selfPlayerCurrentRoundData?.hand?.hand_id;
    },
    nonSelfPlayersMatchData() {
      return this.getNonSelfPlayersMatchDataByMatchId(this.matchId);
    },
    selfPlayerMatchData() {
      return this.getSelfPlayerMatchDataByMatchId(this.matchId);
    },
    selfPlayerCurrentRoundData() {
      if (!this.selfPlayerMatchData || !this.currentRoundId) {
        return null;
      }
      return this.getPlayerRoundDataByRoundAndPlayerIds({
        roundId: this.currentRoundId,
        playerId: this.selfPlayerMatchData.user_id,
      });
    },
    isHandSelectable() {
      return this.canDrawMultiple || (this.canAct && this.hasDrawActionInCurrentTurn);
    },
  },
  methods: {
    ...mapActions({
      unselectAllCards: 'trackers/selections/unselectAllCards',
      setError: 'error/setError',
      fetchGameConfig: 'gameConfig/fetchGameConfig',
      addCardIdsToHand: 'hands/addCardIdsToHand',
      removeCardIdsFromHand: 'hands/removeCardIdsFromHand',
      fetchMatch: 'matches/matches/fetchMatch',
      fetchPlayersRoundData: 'players/round/fetchPlayersRoundData',
      setLatestActionId: 'registry/matchAction/setLatestActionId',
      setCurrentRoundId: 'registry/matchRound/setCurrentRoundId',
      fetchCurrentTurn: 'registry/roundTurn/fetchCurrentTurn',
      removeTopDiscardPileCard: 'rounds/discardPiles/removeTopDiscardPileCard',
      initializeSse: 'sse/connection/initializeSse',
      cleanupSse: 'sse/connection/cleanupSse',
      setLoading: 'trackers/loading/setLoading',
    }),
    async performAction(action, errorMessage) {
      await this.setLoading(true);
      try {
        await action();
      } catch (error) {
        await this.setError({title: errorMessage, error: error});
      } finally {
        await this.setLoading(false);
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
      await this.performAction(async () => {
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
      await this.performAction(async () => {
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
      await this.performAction(async () => {
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
      await this.performAction(async () => {
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
      await this.performAction(async () => {
        const cardIds = this.selectedHandCardIds;
        await turnsService.extendMeld(this.matchId, this.selectedMeldId, cardIds);
        await this.removeCardIdsFromHand({handId: this.currentRoundHandId, cardIds: cardIds});
        await this.unselectAllCards();
      }, 'Failed to extend meld!');
    },
    async handleStartNewRound() {
      await this.performAction(async () => {
        const roundId = await roundsService.startRound(this.matchId);
        await this.setCurrentRoundId({matchId: this.matchId, roundId: roundId});
        await this.fetchCurrentTurn({matchId: this.matchId, roundId: this.currentRoundId});
        await this.fetchPlayersRoundData({roundId: this.currentRoundId});
      }, 'Failed to start new round!');
    },
    async loadAllData(forceFetch = false) {
      await this.fetchMatch({matchId: this.matchId, forceFetch: forceFetch});
      await this.fetchCurrentTurn({matchId: this.matchId, roundId: this.currentRoundId, forceFetch: forceFetch});
      await this.fetchPlayersRoundData({roundId: this.latestRoundId, forceFetch: forceFetch});
      await this.initializeSse(this.matchId);
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

  .melds-container {
    display: flex;
    flex-flow: row wrap;
    gap: var(--base-margin);
    justify-content: center;
  }

  .buttons-container {
    display: flex;
    gap: var(--base-margin);
    justify-content: center;
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
