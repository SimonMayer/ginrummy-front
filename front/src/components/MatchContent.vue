<template>
  <div>
    <MatchTable
        :matchId="matchId"
        :players="players"
        :signedInUserId="signedInUserId"
        :loading="loading"
        @loading="updateLoading"
        @error="handleError"
        @update-stock-pile-size="updateStockPileSize"
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
    matchId: {
      type: Number,
      required: true
    },
    players: {
      type: Array,
      required: true
    },
    signedInUserId: {
      type: Number,
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
    updateStockPileSize(size) {
      this.$emit('update-stock-pile-size', size);
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
