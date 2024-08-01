<template>
  <div class="match-table" v-if="match && match.start_time">
    <div class="game-section full-width">
      <div class="non-self-players-container">
        <NonSelfMatchPlayer
            v-for="player in nonSelfPlayers"
            :key="player.user_id"
            :ref="'player-' + player.user_id"
            :username="player.username"
            :score="player.score"
            :hiddenCardCount="player.hiddenCardCount"
            :highlightPlayer="player.highlightPlayer"
            class="non-self-player"
        />
      </div>
    </div>
    <div class="game-section row">
      <div class="game-column pile-container">
        <StockPile
            v-if="match.stock_pile_size !== undefined"
            :size="match.stock_pile_size"
            @click="handleStockPileClick"
            :disabled="stockPileDisabled"
        />
        <DiscardPile
            v-if="match.discard_pile"
            :ref="'discard-pile'"
            :visibleCards="match.discard_pile"
            :selectableCards="getSelectableDiscardPileCards()"
            @update:selected="forceRefresh()"
        />
      </div>
      <div class="game-column">
        <div class="melds-container">
          <PlayedMeld
              v-for="meld in allMelds"
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
              v-if="selfPlayer"
              :key="selfPlayer.user_id"
              :ref="'player-self'"
              :username="selfPlayer.username"
              :score="selfPlayer.score"
              :hand="myHand"
              :highlightPlayer="selfPlayer.highlightPlayer"
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
import configService from "@/services/configService";
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
      myHand: [],
      rotationNumber: null,
      currentTurnUserId: null,
      sseService: null,
      currentTurnId: null,
      latestActionId: null,
      selectedMeld: null,
    };
  },
  async created() {
    this.setLoading(true);
    await this.loadConfig();
    await this.loadAllData();
    this.setLoading(false);
  },
  beforeUnmount() {
    this.cleanupSSE();
  },
  computed: {
    ...mapState(['loading', 'config', 'match', 'matchPlayers', 'currentTurnActions']),
    ...mapGetters(['currentRoundId']),
    allowMeldsFromRotation() {
      return this.config.allowMeldsFromRotation;
    },
    minimumMeldSize() {
      return this.config.minimumMeldSize;
    },
    runOrders() {
      return this.config.runOrders;
    },
    selfPlayer() {
      const player = this.matchPlayers.find(player => player.user_id === this.signedInUserId);
      return player ? this.transformPlayer(player) : null;
    },
    nonSelfPlayers() {
      const selfIndex = this.matchPlayers.findIndex(player => player.user_id === this.signedInUserId);
      if (selfIndex === -1) {
        return this.matchPlayers.map(this.transformNonSelfPlayer);
      }
      return [...this.matchPlayers.slice(selfIndex + 1), ...this.matchPlayers.slice(0, selfIndex)].map(this.transformNonSelfPlayer);
    },
    allMelds() {
      return this.matchPlayers.reduce((allMelds, player) => {
        return allMelds.concat(player.melds || []);
      }, []);
    },
    selectedMeldId() {
      return this.selectedMeld ? this.selectedMeld.meld_id : null;
    },
    isCurrentUserTurn() {
      return this.currentTurnUserId === this.signedInUserId;
    },
    hasDrawAction() {
      return this.currentTurnActions.some(action => action.action_type === 'draw');
    },
    hasPlayedMeld() {
      const selfPlayer = this.matchPlayers.find(player => player.user_id === this.signedInUserId);
      return selfPlayer && selfPlayer.melds && selfPlayer.melds.length > 0;
    },
    isHandSelectable() {
      return this.canDrawMultiple() || (this.canAct() && this.hasDrawAction);
    },
    isMeldSelectable() {
      return this.canAct() && this.hasPlayedMeld;
    },
    stockPileDisabled() {
      return !this.canDrawFromStockPile()
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
    ...mapActions(['setLoading', 'setError', 'fetchMatch', 'setCurrentTurnActions', 'appendCurrentTurnAction']),
    forceRefresh() {
      // forces refresh of computed values
      this.refreshValues++;
    },
    cleanupSSE() {
      if (this.sseService) {
        this.sseService.disconnect();
      }
    },
    transformPlayer(player) {
      return {
        ...player,
        highlightPlayer: player.user_id === this.currentTurnUserId
      };
    },
    transformNonSelfPlayer(player) {
      return {
        ...this.transformPlayer(player),
        hiddenCardCount: player.handSize,
      };
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
    async loadCurrentTurn() {
      if (this.currentRoundId) {
        const data = await roundsService.getCurrentTurn(this.currentRoundId);
        this.currentTurnUserId = data.user_id;
        this.setCurrentTurnActions(data.actions || []);
        this.currentTurnId = data.turn_id;
        this.latestActionId = data.latest_action_id;
        this.rotationNumber = data.rotation_number;
      }
    },
    async loadMyHand() {
      if (this.currentRoundId) {
        try {
          const data = await roundsService.getMyHand(this.currentRoundId);
          this.myHand = data.cards;
        } catch (error) {
          this.setError({title: 'Failed to fetch your hand!', error: error});
        }
      }
    },
    async loadCurrentRoundDataForPlayers() {
      if (this.currentRoundId) {
        this.loadRoundDataForPlayers(this.currentRoundId);
      }
    },
    async loadRoundDataForPlayers(roundId) {
      const data = await roundsService.getRoundDataForPlayers(roundId);
      const players = data.players;
      this.matchPlayers.forEach(player => {
        const playerData = players.find(p => p.user_id === player.user_id);
        player.handSize = playerData ? playerData.hand.size : 0;
        player.melds = playerData.melds;
        player.score = playerData.score.total_score;
      });
      this.match.stock_pile_size = data.stock_pile_size || 0;
      this.match.discard_pile = data.discard_pile || [];
    },
    async performAction(action, errorMessage) {
      this.setLoading(true);
      try {
        await action();
      } catch (error) {
        this.setError({title: errorMessage, error: error});
      } finally {
        this.setLoading(false);
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
          card = this.match.stock_pile_size > 0
              ? await turnsService.drawFromStockPile(this.matchId)
              : await turnsService.drawFromEmptyStockPile(this.matchId);
        } else if (pileType === 'discard') {
          card = await turnsService.drawOneFromDiscardPile(this.matchId);
          this.match.discard_pile.pop();
        }
        this.unselectDiscardPileCards();
        this.myHand.push(card);
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
        this.myHand = this.myHand.filter(handCard => !handCardIds.includes(handCard.card_id));
        newHandCards.forEach(newHandCard => {
          this.myHand.push(newHandCard);
        });
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
        this.myHand = this.myHand.filter(card => card.card_id !== cardId);
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
        this.myHand = this.myHand.filter(card => !cardIds.includes(card.card_id));
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
        this.myHand = this.myHand.filter(card => !cardIds.includes(card.card_id));
      }, 'Failed to extend meld!');
    },
    async handleStartNewRound() {
      await this.performAction(async () => {
        await roundsService.startRound(this.matchId);
        await this.loadCurrentRoundData();
      }, 'Failed to start new round!');
    },
    async loadConfig() {
      try {
        const config = await configService.getGameConfig();
        this.$store.dispatch('setConfig', {
          allowMeldsFromRotation: config.allowMeldsFromRotation,
          minimumMeldSize: config.minimumMeldSize,
          runOrders: config.runOrders
        });
      } catch (error) {
        this.setError({title: 'Failed to fetch game configuration!', error: error});
      }
    },
    async loadAllData() {
      if (!this.match) {
        await this.fetchMatch(this.matchId);
      }
      await this.loadCurrentRoundData();
      this.initializeSSE();
    },
    async loadCurrentRoundData() {
      await this.loadCurrentTurn();
      await this.loadMyHand();
      await this.loadCurrentRoundDataForPlayers();
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

              this.latestActionId = data.action.action_id;

              if (data.turn_id === this.currentTurnId) {
                this.appendCurrentTurnAction(data.action);
              }

              if (newCurrentRoundId !== this.currentRoundId) {
                this.fetchMatch(this.matchId); // currently the simplest way to update currentRoundId
                if (newCurrentRoundId === null) {
                  this.loadRoundDataForPlayers(data.round_id);
                } else {
                  this.loadCurrentRoundData();
                }
              } else if (newCurrentTurnId !== this.currentTurnId) {
                this.currentTurnId = newCurrentTurnId;
                this.loadCurrentTurn();
                this.loadCurrentRoundDataForPlayers();
              } else if (['draw', 'play_meld', 'extend_meld'].includes(data.action.action_type)) {
                // load changes to discard pile, stock pile, and melds — currently these all require reload of round data
                this.loadCurrentRoundDataForPlayers();
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
      top: calc((var(--card-width) * 1.5) + var(--base-margin));
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
