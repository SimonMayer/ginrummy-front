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
import { mapState, mapActions } from 'vuex';

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
    ...mapState({
      match: state => state.matches.match,
    }),
  },
  async created() {
    await this.fetchMatch(this.matchId);
    await this.fetchPlayers(this.matchId);
  },
  methods: {
    ...mapActions({
      fetchMatch: 'matches/fetchMatch',
      fetchPlayers: 'players/fetchPlayers',
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
