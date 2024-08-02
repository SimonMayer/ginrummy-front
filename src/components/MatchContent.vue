<template>
  <div class="match-content" v-if="match">
    <MatchTable
        ref="matchTable"
        :matchId="matchId"
        :players="matchPlayers"
        :signedInUserId="signedInUserId"
    />
    <button v-if="canStartMatch" @click="startMatch">Start Match</button>
    <ItemSearch
        v-if="!match.start_time && matchPlayers.length < maxPlayers"
        :placeholder="'Search for a player…'"
        :searchFunction="searchUsers"
        :displayProperty="'username'"
        :excludeItems="matchPlayers"
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
    ...mapState(['loading', 'gameConfig', 'match', 'matchPlayers']),
    minPlayers() {
      return this.gameConfig.minPlayers;
    },
    maxPlayers() {
      return this.gameConfig.maxPlayers;
    },
    canStartMatch() {
      return this.match && this.match.create_time && this.matchPlayers.length >= this.minPlayers && this.matchPlayers.length <= this.maxPlayers && !this.match.start_time;
    }
  },
  async created() {
    await this.fetchGameConfig();
    await this.fetchMatch(this.matchId);
    await this.fetchMatchPlayers(this.matchId);
  },
  methods: {
    ...mapActions([
      'setLoading',
      'setError',
      'fetchGameConfig',
      'fetchMatch',
      'fetchMatchPlayers'
    ]),
    async startMatch() {
      if (!this.loading) {
        this.setLoading(true);
        try {
          await matchesService.startMatch(this.matchId);
          await this.$refs.matchTable.loadAllData();
          this.fetchMatch(this.matchId);
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
      if (this.matchPlayers.length < this.maxPlayers) {
        try {
          await matchesService.addPlayers(this.matchId, [user.user_id]);
          await this.fetchMatchPlayers(this.matchId);
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
