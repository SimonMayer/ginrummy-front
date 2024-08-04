<template>
  <div class="match-content" v-if="match">
    <MatchTable
        ref="matchTable"
        :matchId="matchId"
        :signedInUserId="signedInUserId"
    />
    <button v-if="canStartMatch" @click="startMatch">Start Match</button>
    <ItemSearch
        v-if="!match.start_time && players.length < maxPlayers"
        :placeholder="'Search for a player…'"
        :searchFunction="searchUsers"
        :displayProperty="'username'"
        :excludeItems="players"
        :excludeProperty="'user_id'"
        :searchKey="'userSearch'"
        @item-selected="addPlayer"
    />
  </div>
</template>

<script>
import MatchTable from '@/components/MatchTable.vue';
import ItemSearch from '@/components/ItemSearch.vue';
import matchesService from '@/services/matchesService';
import usersService from '@/services/usersService';
import { mapState, mapActions } from 'vuex';

export default {
  name: 'MatchContent',
  components: {
    MatchTable,
    ItemSearch,
  },
  props: {
    matchId: {
      type: Number,
      required: true
    },
    signedInUserId: {
      type: Number,
      required: true
    }
  },
  computed: {
    ...mapState({
      maxPlayers: state => state.gameConfig.maxPlayers,
      minPlayers: state => state.gameConfig.minPlayers,
      loading: state => state.loading.loading,
      match: state => state.matches.match,
      players: state => state.players.players,
    }),
    canStartMatch() {
      return this.match && this.match.create_time && this.players.length >= this.minPlayers && this.players.length <= this.maxPlayers && !this.match.start_time;
    }
  },
  async created() {
    await this.fetchGameConfig();
    await this.fetchMatch({matchId: this.matchId});
    await this.fetchPlayers(this.matchId);
  },
  methods: {
    ...mapActions({
      setError: 'error/setError',
      fetchGameConfig: 'gameConfig/fetchGameConfig',
      setLoading: 'loading/setLoading',
      fetchMatch: 'matches/fetchMatch',
      fetchPlayers: 'players/fetchPlayers',
    }),
    async startMatch() {
      if (!this.loading) {
        this.setLoading(true);
        try {
          await matchesService.startMatch(this.matchId);
          await this.$refs.matchTable.loadAllData();
          this.fetchMatch({matchId: this.matchId, forceFetch: true});
        } catch (error) {
          this.setError({title: 'Failed to start match!', error: error});
        } finally {
          this.setLoading(false);
        }
      }
    },
    async searchUsers(term) {
      try {
        return await usersService.searchUsers(term);
      } catch (error) {
        this.setError({title: 'Failed to search users!', error: error});
        return [];
      }
    },
    async addPlayer(user) {
      if (this.players.length < this.maxPlayers) {
        try {
          await matchesService.addPlayers(this.matchId, [user.user_id]);
          await this.fetchPlayers(this.matchId);
        } catch (error) {
          this.setError({title: 'Failed to add player!', error: error});
        }
      } else {
        alert('Maximum number of players reached.');
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import '@/assets/globalVariables';

.match-content {
  width: 100%;
}
</style>
