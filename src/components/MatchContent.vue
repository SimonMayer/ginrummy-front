<template>
  <div class="match-content" v-if="match">
    <MatchTable/>
    <button v-if="canStartMatch" @click="startMatch">Start Match</button>
    <ItemSearch
        v-if="canAddPlayerToMatch"
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
      canAddPlayerToMatch: 'sessionState/permissions/match/canAddPlayerToMatch',
      canStartMatch: 'sessionState/permissions/match/canStartMatch',
    }),
  },
  methods: {
    ...mapActions({
      addPlayer: 'interactions/matches/players/addPlayer',
      startMatch: 'interactions/matches/start/startMatch',
      logError: 'sessionState/indicators/errorLog/addLogEntry',
    }),

    async searchUsers(term) {
      try {
        return await usersService.searchUsers(term);
      } catch (error) {
        this.logError({title: 'Failed to search users!', error: error});
        return [];
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
