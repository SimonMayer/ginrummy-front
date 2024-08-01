<template>
  <div class="match-content">
    <MatchTable
        ref="matchTable"
        :matchId="matchId"
        :players="players"
        :signedInUserId="signedInUserId"
        @error="handleError"
    />
    <button v-if="canStartMatch" @click="startMatch">Start Match</button>
    <ItemSearch
        v-if="!match.start_time && players.length < maxPlayers"
        :placeholder="'Search for a player…'"
        :searchFunction="searchUsers"
        :displayProperty="'username'"
        :excludeItems="players"
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
    match: {
      type: Object,
      required: true
    },
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
    ...mapState(['loading']),
    canStartMatch() {
      return this.match.create_time && this.players.length >= this.minPlayers && this.players.length <= this.maxPlayers && !this.match.start_time;
    }
  },
  data() {
    return {
      minPlayers: null,
      maxPlayers: null,
      players: []
    };
  },
  async created() {
    await this.loadConfig();
    await this.loadPlayers();
  },
  methods: {
    ...mapActions(['setLoading', 'setError']),
    async loadConfig() {
      try {
        const config = await configService.getGameConfig();
        this.minPlayers = config.players.minimumAllowed;
        this.maxPlayers = config.players.maximumAllowed;
      } catch (error) {
        this.setError({title: 'Failed to fetch game configuration!', error: error});
      }
    },
    async loadPlayers() {
      this.setLoading(true);
      try {
        this.players = await matchesService.getPlayers(this.matchId);
      } catch (error) {
        this.setError({title: 'Failed to fetch players!', error: error});
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
          this.$emit('match-started');
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
          await this.loadPlayers();
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
