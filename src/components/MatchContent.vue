<template>
  <div class="match-content" v-if="match">
    <MatchTable
        ref="matchTable"
        :matchId="matchId"
        :players="matchPlayers"
        :signedInUserId="signedInUserId"
        @error="handleError"
    />
    <button v-if="canStartMatch" @click="startMatch">Start Match</button>
    <ItemSearch
        v-if="!match.start_time && matchPlayers.length < maxPlayers"
        :placeholder="'Search for a player…'"
        :searchFunction="searchUsers"
        :displayProperty="'username'"
        :excludeItems="matchPlayers"
        :excludeProperty="'user_id'"
        @item-selected="addPlayer"
    />
  </div>
</template>

<script>
import MatchTable from '@/components/MatchTable.vue';
import ItemSearch from '@/components/ItemSearch.vue';
import matchesService from '@/services/matchesService';
import configService from '@/services/configService';
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
    ...mapState(['loading', 'config', 'match', 'matchPlayers']),
    minPlayers() {
      return this.config.minPlayers;
    },
    maxPlayers() {
      return this.config.maxPlayers;
    },
    canStartMatch() {
      return this.match && this.match.create_time && this.matchPlayers.length >= this.minPlayers && this.matchPlayers.length <= this.maxPlayers && !this.match.start_time;
    }
  },
  async created() {
    await this.loadConfig();
    await this.fetchMatch(this.matchId);
    await this.fetchMatchPlayers(this.matchId);
  },
  methods: {
    ...mapActions(['setLoading', 'setError', 'fetchMatch', 'fetchMatchPlayers']),
    async loadConfig() {
      this.setLoading(true);
      try {
        const config = await configService.getGameConfig();
        this.$store.dispatch('setConfig', {
          allowMeldsFromRotation: config.allowMeldsFromRotation,
          minimumMeldSize: config.minimumMeldSize,
          runOrders: config.runOrders,
          minPlayers: config.players.minimumAllowed,
          maxPlayers: config.players.maximumAllowed
        });
      } catch (error) {
        this.setError({title: 'Failed to fetch game configuration!', error: error});
      } finally {
        this.setLoading(false);
      }
    },
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
