<template>
  <div class="match-dashboard">
    <MatchContent/>
  </div>
</template>

<script>
import MatchContent from '@/components/MatchContent.vue';
import {mapActions} from 'vuex';
import matchPhaseMixin from '@/mixins/matchPhaseMixin';

export default {
  name: 'MatchDashboard',
  components: {
    MatchContent,
  },
  mixins: [matchPhaseMixin],
  async created() {
    await this.initializeMatchId(this.$route);
    await this.fetchMatch({matchId: this.matchId});
    await this.fetchPlayersMatchData({matchId: this.matchId});
  },
  methods: {
    ...mapActions({
      fetchMatch: 'matches/matches/fetchMatch',
      initializeMatchId: 'trackers/matchPhase/initializeMatchId',
      fetchPlayersMatchData: 'players/match/fetchPlayersMatchData',
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
