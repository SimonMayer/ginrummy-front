<template>
  <div class="match-dashboard">
    <MatchContent :signedInUserId="signedInUserId" />
  </div>
</template>

<script>
import MatchContent from '@/components/MatchContent.vue';
import {mapActions} from 'vuex';
import matchPhaseMixin from "@/mixins/matchPhaseMixin";

export default {
  name: 'MatchDashboard',
  components: {
    MatchContent,
  },
  mixins: [matchPhaseMixin],
  data() {
    return {
      signedInUserId: parseInt(localStorage.getItem('user_id'), 10), // todo move sign in and storage to auth store
    };
  },
  async created() {
    await this.initializeMatchId(this.$route);
    await this.fetchMatch({ matchId: this.matchId });
    await this.fetchPlayersMatchData({ matchId: this.matchId });
  },
  methods: {
    ...mapActions({
      fetchMatch: 'matches/fetchMatch',
      initializeMatchId: 'matchPhaseTracker/initializeMatchId',
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
