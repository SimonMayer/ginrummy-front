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
      canAddPlayerToMatch: 'sessionState/permissions/match/canAddPlayerToMatch',
      canStartMatch: 'sessionState/permissions/match/canStartMatch',
    }),
  },
  methods: {
    ...mapActions({
      addPlayer: 'interactions/matches/players/addPlayer',
      startMatch: 'interactions/matches/start/startMatch',
      logError: 'sessionState/indicators/errorLog/addLogEntry',
      searchUsers: 'interactions/searches/users/searchUsers',
    }),
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/globalVariables';

.match-content {
  width: 100%;
}
</style>
