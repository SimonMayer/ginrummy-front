<template>
  <div class="match-dashboard">
    <MatchContent
        :match="match"
        :matchId="matchId"
        :signedInUserId="signedInUserId"
    />
  </div>
</template>

<script>
import MatchContent from '@/components/MatchContent.vue';
import {mapActions, mapGetters} from 'vuex';

export default {
  name: 'MatchDashboard',
  components: {
    MatchContent,
  },
  data() {
    return {
      matchId: parseInt(this.$route.params.id, 10),
      signedInUserId: parseInt(localStorage.getItem('user_id'), 10),
    };
  },
  computed: {
    ...mapGetters({
      getMatchById: 'matches/getMatchById',
    }),
    match() {
      return this.getMatchById(this.matchId);
    },
  },
  async created() {
    await this.fetchMatch({ matchId: this.matchId });
    await this.fetchPlayersMatchData({ matchId: this.matchId });
  },
  methods: {
    ...mapActions({
      fetchMatch: 'matches/fetchMatch',
      fetchPlayersMatchData: 'players/fetchPlayersMatchData',
    }),
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/globalVariables';

.match-dashboard {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}
</style>
