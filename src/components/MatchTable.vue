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
        <GameButtonContainer class="buttons-container" @show-game-information="toggleGameInformationVisibility"/>
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
  <ContentLightbox
      :isVisible="isGameInformationVisible"
      title="Game Information"
      @close="closeGameInformation"
  >
      <h4>Objective</h4>
      <p>The goal of the game is to accumulate the highest number of points across multiple rounds. You earn points by playing melds and lose points for cards left in your hand at the end of a round.</p>

      <h4>Scoring</h4>
      <ul>
        <li><strong>Ace:</strong> 15 points</li>
        <li><strong>10, Jack, Queen, King:</strong> 10 points</li>
        <li><strong>2–9:</strong> Points equal to their rank (e.g., 2 is worth 2 points)</li>
      </ul>

      <h4>Playing melds</h4>
      <p>Melds, which are essential for scoring, can only be played starting from a player's second turn in the round. This means no melds can be played during the first turn of any player within a new round.</p>

      <ul>
        <li>
          <strong>Types of melds:</strong>
          <ul>
            <li><strong>Set:</strong> 3 or 4 cards of the same rank.</li>
            <li><strong>Run:</strong> At least 3 consecutive cards of the same suit. Aces can be high or low (e.g., Queen, King, Ace or Ace, 2, 3). However, a run cannot "loop around" (e.g., King, Ace, 2 is not allowed).</li>
          </ul>
        </li>
      </ul>

      <h4>Turn sequence</h4>
      <ol>
        <li>
          <strong>Draw a card:</strong>
          <ul>
            <li>You must start your turn by drawing a card from either the stock pile or the top of the discard pile. In some cases, you can draw multiple cards from the discard pile. See: <em>Special abilities</em>.</li>
            <li>If the discard pile is empty, you must draw from the stock pile.</li>
            <li>If the stock pile is empty, you may either draw from the discard pile or turn the discard pile over to create a new stock pile and draw the top card.</li>
          </ul>
        </li>
        <li>
          <strong>Play melds:</strong>
          <ul>
            <li>After the first rotation, you can play a meld. Once you've played a meld, you gain additional abilities. See: <em>Special abilities</em>.</li>
          </ul>
        </li>
        <li>
          <strong>Discard a card:</strong>
          <ul>
            <li>End your turn by discarding a card to the top of the discard pile. This is done in a way that keeps all previously discarded cards visible.</li>
            <li>If discarding leaves you with no cards in your hand, the round ends.</li>
          </ul>
        </li>
      </ol>

      <h4>Special abilities</h4>
      <p>Once you have played your first meld in a round, you gain the following special abilities:</p>
      <ul>
        <li>
          <strong>Extending melds:</strong>
          <ul>
            <li>You may add cards to an existing meld to make it larger. This can include adding the fourth card to a set of three or adding any number of consecutive cards to an existing run.</li>
            <li>You can extend all melds, regardless of who originally played them.</li>
            <li>You receive points only for the cards you contributed towards a meld.</li>
          </ul>
        </li>
        <li>
          <strong>Drawing multiple cards:</strong>
          <ul>
            <li>At the start of your turn, you can choose to draw multiple cards from the discard pile.</li>
            <li>You must nominate at least one of these cards to immediately play as part of a new or extended meld.</li>
            <li>You may nominate multiple cards from the discard pile, and may also select cards from your own hand, for combined use when playing or extending a meld.</li>
            <li>Any other cards above the nominated cards are added to your hand, after which you continue your turn as normal.</li>
          </ul>
        </li>
      </ul>

      <h4>End of a round</h4>
      <p>A round ends only when a player discards their last card. As such, you cannot play cards in a way that leaves you with an empty hand, prior to discarding.</p>
      <p>Each remaining player is deducted points equal to the value of the cards still in their hand. This can result in a negative score.</p>
      <p>A new round may begin immediately, with the first turn going to the next player clockwise from the one who started the previous round.</p>

      <p>Use these rules to strategize your moves and outplay your opponents!</p>
  </ContentLightbox>
  <DragImages/>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import ContentLightbox from '@/components/ContentLightbox.vue';
import DiscardPile from '@/components/DiscardPile.vue';
import DragImages from '@/components/DragImages.vue';
import GameButtonContainer from '@/components/GameButtonContainer.vue';
import ItemSearch from '@/components/ItemSearch.vue';
import MeldsContainer from '@/components/MeldsContainer.vue';
import NonSelfMatchPlayer from '@/components/NonSelfMatchPlayer.vue';
import SelfMatchPlayer from '@/components/SelfMatchPlayer.vue';
import StockPile from '@/components/StockPile.vue';

export default {
  name: 'MatchTable',
  components: {
    ContentLightbox,
    DiscardPile,
    DragImages,
    GameButtonContainer,
    ItemSearch,
    MeldsContainer,
    NonSelfMatchPlayer,
    SelfMatchPlayer,
    StockPile,
  },
  data() {
    return {
      isGameInformationVisible: false,
    };
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
    closeGameInformation() {
      this.isGameInformationVisible = false;
    },
    toggleGameInformationVisibility() {
      this.isGameInformationVisible = !this.isGameInformationVisible;
    },
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
