<template>
  <div class="match-content" v-if="match">
    <MatchTable/>
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
import matchPhaseMixin from '@/mixins/matchPhaseMixin';

export default {
  name: 'MatchContent',
  components: {
    MatchTable,
    ItemSearch,
  },
  mixins: [matchPhaseMixin],
  computed: {
    ...mapGetters({
      players: 'sessionState/derived/players/playersMatchData',
      maxPlayers: 'storage/gameConfig/maxPlayers',
      canStartMatch: 'sessionState/permissions/match/canStartMatch',
    }),
  },
  methods: {
    ...mapActions({
      logError: 'sessionState/indicators/errorLog/addLogEntry',
      fetchMatch: 'storage/matches/matches/fetchMatch',
      fetchPlayersMatchData: 'storage/players/matchData/fetchPlayersMatchData',
      startMatch: 'interactions/matches/start/startMatch',
    }),

    async searchUsers(term) {
      try {
        return await usersService.searchUsers(term);
      } catch (error) {
        this.logError({title: 'Failed to search users!', error: error});
        return [];
      }
    },
    async addPlayer(user) {
      if (this.players.length < this.maxPlayers) {
        try {
          await matchesService.addPlayers(this.matchId, [user.user_id]);
          await this.fetchPlayersMatchData({matchId: this.matchId, forceFetch: true});
        } catch (error) {
          this.logError({title: 'Failed to add player!', error: error});
        }
      } else {
        alert('Maximum number of players reached.');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/globalVariables';

.match-content {
  width: 100%;
}
</style>
