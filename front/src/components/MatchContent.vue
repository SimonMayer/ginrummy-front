<template>
  <div>
    <MatchTable
        :match="match"
        :players="players"
        :myHand="myHand"
        :signedInUserId="signedInUserId"
        :currentTurnUserId="currentTurnUserId"
        :loading="loading"
        :currentTurnActions="currentTurnActions"
        @loading="updateLoading"
        @error="handleError"
        @update-my-hand="updateMyHand"
        @update-stock-pile-size="updateStockPileSize"
        @update-current-turn-actions="updateCurrentTurnActions"
    />
    <button v-if="canStartMatch" @click="$emit('start-match')">Start Match</button>
  </div>
</template>

<script>
import MatchTable from './MatchTable.vue';

export default {
  name: 'MatchContent',
  components: {
    MatchTable,
  },
  props: {
    match: {
      type: Object,
      required: true
    },
    players: {
      type: Array,
      required: true
    },
    myHand: {
      type: Array,
      required: true
    },
    signedInUserId: {
      type: Number,
      required: true
    },
    currentTurnUserId: {
      type: [Number, null],
      required: true
    },
    loading: {
      type: Boolean,
      required: true
    },
    minPlayers: {
      type: Number,
      required: true
    },
    maxPlayers: {
      type: Number,
      required: true
    },
    currentTurnActions: {
      type: Array,
      required: true
    }
  },
  computed: {
    canStartMatch() {
      return this.players.length >= this.minPlayers && this.players.length <= this.maxPlayers && !this.match.start_time;
    }
  },
  methods: {
    updateLoading(loading) {
      this.$emit('update-loading', loading);
    },
    handleError(title, error) {
      this.$emit('error', title, error);
    },
    updateMyHand(card) {
      this.$emit('update-my-hand', card);
    },
    updateStockPileSize(size) {
      this.$emit('update-stock-pile-size', size);
    },
    updateCurrentTurnActions(action) {
      this.$emit('update-current-turn-actions', action);
    }
  }
};
</script>

<style scoped>
button {
  padding: 10px 20px;
  font-size: 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  cursor: pointer;
  border-radius: 3px;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #45a049;
}
</style>
