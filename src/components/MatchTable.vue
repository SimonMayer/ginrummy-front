<template>
  <div class="match-table" v-if="match && match.start_time">
    <div class="game-section full-width">
      <div class="non-self-players-container">
        <NonSelfMatchPlayer
            v-for="playerMatchData in nonSelfPlayersMatchData"
            :key="playerMatchData.user_id"
            :ref="'player-' + playerMatchData.user_id"
            :matchId="matchId"
            :roundId="currentRoundId"
            :userId="playerMatchData.user_id"
            class="non-self-player"
        />
      </div>
    </div>
    <div class="game-section row">
      <div class="game-column pile-container">
        <StockPile
            :roundId="currentRoundId"
            @click="handleStockPileClick"
            :disabled="stockPileDisabled"
        />
        <DiscardPile
            :ref="'discard-pile'"
            :selectableCards="getSelectableDiscardPileCards()"
            :roundId="currentRoundId"
            @update:selected="forceRefresh()"
        />
      </div>
      <div class="game-column">
        <div class="melds-container">
          <PlayedMeld
              v-for="meld in melds"
              :key="meld.meld_id"
              :id="meld.meld_id"
              :type="meld.meld_type"
              :cards="meld.cards"
              :selected="selectedMeldId === meld.meld_id"
              :selectable="isMeldSelectable"
              @select:meld="handleMeldClick(meld.meld_id)"
          />
        </div>
        <div v-if="!currentRoundId" class="buttons-container">
          <button @click="handleStartNewRound">Start new round</button>
        </div>
        <div v-if="currentRoundId" class="buttons-container">
          <button @click="handleDrawOneFromDiscardPileClick" :disabled="drawOneFromDiscardPileButtonDisabled">
            Draw one from discard pile
          </button>
          <button @click="handleDrawMultipleFromDiscardPileClick" :disabled="drawMultipleFromDiscardPileButtonDisabled">
            Draw multiple from discard pile
          </button>
          <button @click="handlePlayMeldClick" :disabled="playMeldButtonDisabled">Play meld</button>
          <button @click="handleExtendMeldClick" :disabled="extendMeldButtonDisabled">Extend meld</button>
          <button @click="handleDiscardClick" :disabled="discardButtonDisabled">Discard</button>
        </div>
        <div class="self-player-container">
          <SelfMatchPlayer
              v-if="selfPlayerMatchData"
              :key="selfPlayerMatchData.user_id"
              :ref="'player-self'"
              :matchId="matchId"
              :roundId="currentRoundId"
              :selectable="isHandSelectable"
              class="self-player"
              @update:selected="forceRefresh()"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PlayedMeld from '@/components/PlayedMeld.vue';
import StockPile from '@/components/StockPile.vue';
import DiscardPile from '@/components/DiscardPile.vue';
import SelfMatchPlayer from '@/components/SelfMatchPlayer.vue';
import NonSelfMatchPlayer from '@/components/NonSelfMatchPlayer.vue';
import roundsService from '@/services/roundsService';
import SSEService from '@/services/sseService';
import turnsService from '@/services/turnsService';
import canActionsMixin from '@/mixins/canActionsMixin.js';
import handSelectionMixin from '@/mixins/handSelectionMixin.js';
import discardPileMixin from '@/mixins/discardPileMixin.js';
import meldSelectionMixin from '@/mixins/meldSelectionMixin.js';
import { mapActions, mapState, mapGetters } from "vuex";

export default {
  name: 'MatchTable',
  components: { PlayedMeld, StockPile, DiscardPile, SelfMatchPlayer, NonSelfMatchPlayer },
  mixins: [canActionsMixin, handSelectionMixin, discardPileMixin, meldSelectionMixin],
  props: {
    matchId: { type: Number, required: true },
    signedInUserId: { type: Number, required: true },
  },
  data() {
    return {
      refreshValues: 0,
      sseService: null,
      selectedMeld: null,
    };
  },
  async created() {
    await this.fetchGameConfig({});
    await this.loadAllData(false);
    await this.fetchMyHand({ matchId: this.matchId });
  },
  beforeUnmount() {
    this.cleanupSSE();
  },
  computed: {
    ...mapState({
      allowMeldsFromRotation: state => state.gameConfig.allowMeldsFromRotation,
      minimumMeldSize: state => state.gameConfig.minimumMeldSize,
      runOrders: state => state.gameConfig.runOrders,
      loading: state => state.loading.loading,
      getMatch: state => state.matches.match,
    }),
    ...mapGetters({
      getCurrentTurnByMatchId: 'currentTurn/getCurrentTurnByMatchId',
      getLatestActionIdByMatchId: 'currentTurn/getLatestActionIdByMatchId',
      getMyHandByMatchId: 'hand/getMyHandByMatchId',
      getMatchById: 'matches/getMatchById',
      getCurrentRoundIdByMatchId: 'matchRoundRegistry/getCurrentRoundIdByMatchId',
      getNonSelfPlayersMatchDataByMatchId: 'players/getNonSelfPlayersMatchDataByMatchId',
      getPlayerRoundDataByRoundAndPlayerIds: 'players/getPlayerRoundDataByRoundAndPlayerIds',
      getSelfPlayerMatchDataByMatchId: 'players/getSelfPlayerMatchDataByMatchId',
      getDiscardPileByRoundId: 'rounds/getDiscardPileByRoundId',
      getMeldsByRoundId: 'rounds/getMeldsByRoundId',
      getStockPileSizeByRoundId: 'rounds/getStockPileSizeByRoundId',
    }),
    currentRoundId() {
      return this.getCurrentRoundIdByMatchId(this.matchId);
    },
    discardPile() {
      return this.getDiscardPileByRoundId(this.currentRoundId);
    },
    melds() {
      return this.getMeldsByRoundId(this.currentRoundId);
    },
    stockPileSize() {
      return this.getStockPileSizeByRoundId(this.currentRoundId);
    },
    currentTurn() {
      return this.getCurrentTurnByMatchId(this.matchId);
    },
    latestActionId() {
      return this.getLatestActionIdByMatchId(this.matchId);
    },
    match() {
      return this.getMatchById(this.matchId);
    },
    myHand() {
      return this.getMyHandByMatchId(this.matchId);
    },
    nonSelfPlayersMatchData() {
      return this.getNonSelfPlayersMatchDataByMatchId(this.matchId);
    },
    selfPlayerMatchData() {
      return this.getSelfPlayerMatchDataByMatchId(this.matchId);
    },
    selfPlayerRoundData() {
      if (!this.selfPlayerMatchData || !this.currentRoundId) {
        return null;
      }
      return this.getPlayerRoundDataByRoundAndPlayerIds({ roundId: this.currentRoundId, playerId: this.selfPlayerMatchData.user_id });
    },
    selectedMeldId() {
      return this.selectedMeld ? this.selectedMeld.meld_id : null;
    },
    isCurrentUserTurn() {
      return this.currentTurn.userId === this.signedInUserId;
    },
    hasDrawAction() {
      return this.currentTurn.actions.some(action => action.action_type === 'draw');
    },
    hasPlayedMeld() {
      const selfPlayerRoundData = this.selfPlayerRoundData
      return selfPlayerRoundData && selfPlayerRoundData.melds && selfPlayerRoundData.melds.length > 0;
    },
    isHandSelectable() {
      return this.canDrawMultiple() || (this.canAct() && this.hasDrawAction);
    },
    isMeldSelectable() {
      return this.canAct() && this.hasPlayedMeld;
    },
    stockPileDisabled() {
      return !this.canDrawFromStockPile();
    },
    discardButtonDisabled() {
      this.refreshValues; // forces a recompute when refreshValues is changed
      return !this.canDiscard();
    },
    playMeldButtonDisabled() {
      this.refreshValues; // forces a recompute when refreshValues is changed
      return !this.canPlaySet() && !this.canPlayRun();
    },
    extendMeldButtonDisabled() {
      this.refreshValues; // forces a recompute when refreshValues is changed
      return !this.canExtendMeld();
    },
    drawOneFromDiscardPileButtonDisabled() {
      this.refreshValues; // forces a recompute when refreshValues is changed
      return !this.canDrawOneFromDiscardPile();
    },
    drawMultipleFromDiscardPileButtonDisabled() {
      this.refreshValues; // forces a recompute when refreshValues is changed
      return !this.canDrawMultipleFromDiscardPile();
    }
  },
  methods: {
    ...mapActions({
      setCurrentRoundId: 'matchRoundRegistry/setCurrentRoundId',
      appendCurrentTurnAction: 'currentTurn/appendCurrentTurnAction',
      removeTopDiscardPileCard: 'matchRoundRegistry/removeTopDiscardPileCard',
      fetchCurrentTurn: 'currentTurn/fetchCurrentTurn',
      setLatestActionId: 'currentTurn/setLatestActionId',
      setError: 'error/setError',
      fetchGameConfig: 'gameConfig/fetchGameConfig',
      appendCardsToMyHand: 'hand/appendCardsToMyHand',
      fetchMyHand: 'hand/fetchMyHand',
      removeCardsFromMyHand: 'hand/removeCardsFromMyHand',
      setLoading: 'loading/setLoading',
      fetchMatch: 'matches/fetchMatch',
      fetchPlayersRoundData: 'players/fetchPlayersRoundData',
      fetchDiscardPile: 'rounds/fetchDiscardPile',
      fetchMelds: 'rounds/fetchMelds',
      fetchStockPileData: 'rounds/fetchStockPileData',
    }),
    forceRefresh() {
      // forces refresh of computed values
      this.refreshValues++;
    },
    cleanupSSE() {
      if (this.sseService) {
        this.sseService.disconnect();
      }
    },
    getSelectedCards(refName) {
      return this.$refs[refName] ? this.$refs[refName].getSelectedCards() : [];
    },
    unselectCardsByRef(refName) {
      const ref = this.$refs[refName];
      if (ref) {
        ref.unselectAllCards();
      }
    },
    async performAction(action, errorMessage) {
      await this.setLoading(true);
      try {
        await action();
      } catch (error) {
        await this.setError({title: errorMessage, error: error});
      } finally {
        await this.setLoading(false);
        this.forceRefresh();
      }
    },
    async handleStockPileClick() {
      await this.handleDrawOneFromPileClick('stock');
    },
    async handleDrawOneFromDiscardPileClick() {
      await this.handleDrawOneFromPileClick('discard');
    },
    async handleDrawOneFromPileClick(pileType) {
      if ((pileType === 'discard' && !this.canDrawOneFromDiscardPile()) || !this.canDraw()) {
        return;
      }
      await this.performAction(async () => {
        let card;
        if (pileType === 'stock') {
          card = this.stockPileSize > 0
              ? await turnsService.drawFromStockPile(this.matchId)
              : await turnsService.drawFromEmptyStockPile(this.matchId);
        } else if (pileType === 'discard') {
          card = await turnsService.drawOneFromDiscardPile(this.matchId);
          await this.removeTopDiscardPileCard({ matchId: this.matchId });
        }
        this.unselectDiscardPileCards();
        await this.appendCardsToMyHand({ matchId: this.matchId, cards: [card] });
      }, `Failed to draw from ${pileType} pile!`);
    },
    async handleDrawMultipleFromDiscardPileClick() {
      if (!this.canDrawMultipleFromDiscardPile()) {
        return;
      }
      await this.performAction(async () => {
        const handCardIds = this.getSelectedHandCards().map(card => card.card_id);
        const discardPileCardIds = this.getSelectedDiscardPileCards().map(card => card.card_id);
        const newHandCards = await turnsService.drawMultipleFromDiscardPile(
            this.matchId,
            discardPileCardIds,
            handCardIds,
            this.selectedMeldId
        );
        this.unselectDiscardPileCards();
        this.unselectHandCards();
        this.unselectMeld();
        await this.removeCardsFromMyHand({ matchId: this.matchId, cardIds: handCardIds });
        await this.appendCardsToMyHand({ matchId: this.matchId, cards: newHandCards });
      }, `Failed to draw multiple from discard pile!`);
    },
    async handleDiscardClick() {
      if (!this.canDiscard()) {
        return;
      }
      await this.performAction(async () => {
        const cardId = this.getSelectedHandCards()[0].card_id;
        await turnsService.discardCard(this.matchId, cardId);
        this.unselectHandCards();
        await this.removeCardsFromMyHand({ matchId: this.matchId, cardIds: [cardId] });
      }, 'Failed to discard card!');
    },
    async handlePlayMeldClick() {
      if (!this.canPlaySet() && !this.canPlayRun()) {
        return;
      }
      const meldType = this.canPlaySet() ? 'set' : 'run';
      await this.performAction(async () => {
        const cardIds = this.getSelectedHandCards().map(card => card.card_id);
        await turnsService.playMeld(this.matchId, cardIds, meldType);
        await this.removeCardsFromMyHand({ matchId: this.matchId, cardIds: cardIds });
      }, `Failed to play meld!`);
    },
    async handleExtendMeldClick() {
      if (!this.canExtendMeld()) {
        return;
      }
      await this.performAction(async () => {
        const cardIds = this.getSelectedHandCards().map(card => card.card_id);
        await turnsService.extendMeld(this.matchId, this.selectedMeldId, cardIds);
        this.unselectMeld();
        await this.removeCardsFromMyHand({ matchId: this.matchId, cardIds: cardIds });
      }, 'Failed to extend meld!');
    },
    async handleStartNewRound() {
      await this.performAction(async () => {
        const roundId = await roundsService.startRound(this.matchId);
        await this.setCurrentRoundId({ matchId: this.matchId, roundId: roundId });
        await this.fetchCurrentTurn({ matchId: this.matchId, forceFetch: true });
        await this.fetchMyHand({ matchId: this.matchId, forceFetch: true });
        await this.fetchPlayersRoundData({ roundId: this.currentRoundId });
      }, 'Failed to start new round!');
    },
    async loadAllData(forceFetch = false) {
      await this.fetchMatch({ matchId: this.matchId, forceFetch: forceFetch });
      await this.fetchCurrentTurn({ matchId: this.matchId, forceFetch: forceFetch });
      await this.fetchMyHand({ matchId: this.matchId, forceFetch: forceFetch });
      await this.fetchPlayersRoundData({ roundId: this.currentRoundId, forceFetch: forceFetch });
      this.initializeSSE();
    },
    initializeSSE() {
      const latestActionId = this.latestActionId === null ? '' : this.latestActionId;
      const endpoint = `/matches/${this.matchId}/events?latest_action_id=${latestActionId}`;

      try {
        this.sseService = new SSEService(endpoint);

        this.sseService.connect(
            (data) => {
              const newCurrentRoundId = data.current_status.round_id;
              const newCurrentTurnId = data.current_status.turn_id;

              if (data.action.action_id > this.latestActionId) {
                this.setLatestActionId({ matchId: this.matchId, actionId: data.action.action_id });
              }

              if (data.turn_id === this.currentTurn.id) {
                this.appendCurrentTurnAction({ matchId: this.matchId, action: data.action });
              }

              const roundChanged = newCurrentRoundId !== this.currentRoundId;
              this.setCurrentRoundId({ matchId: this.matchId, roundId: newCurrentRoundId });

              const betweenRounds = this.currentRoundId === null;
              const turnChanged = newCurrentTurnId !== this.currentTurn.id;
              const cardsDrawn = ['draw'].includes(data.action.action_type);
              const cardsMelded = ['play_meld', 'extend_meld'].includes(data.action.action_type);

              if (!betweenRounds && roundChanged) {
                this.fetchMyHand({matchId: this.matchId, forceFetch: true});
              }
              if (!betweenRounds && (roundChanged || turnChanged)) {
                this.fetchCurrentTurn({matchId: this.matchId, forceFetch: true});
              }
              if (!betweenRounds && (turnChanged || cardsDrawn)) {
                this.fetchDiscardPile({roundId: this.currentRoundId, forceFetch: true});
              }
              if (!betweenRounds && cardsDrawn) {
                this.fetchStockPileData({roundId: this.currentRoundId, forceFetch: true});
              }
              if (cardsMelded) {
                this.fetchMelds({roundId: this.currentRoundId, forceFetch: true})
              }
              if (roundChanged || turnChanged || cardsDrawn || cardsMelded) {
                const roundId = betweenRounds ? data.roundId : this.currentRoundId;
                const forceFetch = !roundChanged || betweenRounds;
                this.fetchPlayersRoundData({roundId: roundId, forceFetch: forceFetch});
              }
            },
            (error) => {
              console.error('SSE error:', error);
            }
        );
      } catch (error) {
        console.error('Failed to initialize SSE:', error);
      }
    }
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
      padding: 10px;
      text-align: center;
    }

    &.row {
      display: flex;
      width: 100%;

      .column {
        flex: 1;
        padding: 10px;
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
