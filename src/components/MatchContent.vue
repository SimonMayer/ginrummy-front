<template>
  <div class="match-content" v-if="match">
    <MatchTable
        ref="matchTable"
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
import {mapActions, mapGetters} from 'vuex';
import matchPhaseMixin from "@/mixins/matchPhaseMixin";

export default {
  name: 'MatchContent',
  components: {
    MatchTable,
    ItemSearch,
  },
  mixins: [matchPhaseMixin],
  props: {
    signedInUserId: {
      type: Number,
      required: true
    }
  },
  computed: {
    ...mapGetters({
      getPlayersMatchDataByMatchId: 'players/match/getPlayersMatchDataByMatchId',
      gameConfig: 'gameConfig/gameConfig',
      loading: 'trackers/loading/loading',
    }),
    maxPlayers() {
      return this.gameConfig.maxPlayers;
    },
    minPlayers() {
      return this.gameConfig.minPlayers;
    },
    players() {
      return this.getPlayersMatchDataByMatchId(this.matchId);
    },
    canStartMatch() {
      return this.match && this.match.create_time && this.players.length >= this.minPlayers && this.players.length <= this.maxPlayers && !this.match.start_time;
    },
  },
  async created() {
    await this.fetchGameConfig({});
    await this.fetchMatch({ matchId: this.matchId });
    await this.fetchPlayersMatchData({ matchId: this.matchId });
  },
  methods: {
    ...mapActions({
      setError: 'error/setError',
      fetchGameConfig: 'gameConfig/fetchGameConfig',
      fetchMatch: 'matches/matches/fetchMatch',
      fetchPlayersMatchData: 'players/match/fetchPlayersMatchData',
      setLoading: 'trackers/loading/setLoading',
    }),
    async startMatch() {
      if (!this.loading) {
        this.setLoading(true);
        try {
          await matchesService.startMatch(this.matchId);
          await this.$refs.matchTable.loadAllData(true);
          this.fetchMatch({ matchId: this.matchId, forceFetch: true });
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
          await this.fetchPlayersMatchData({ matchId: this.matchId, forceFetch: true });
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
