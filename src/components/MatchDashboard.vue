<template>
  <div class="match-dashboard">
    <LoadingIndicator :visible="loading" />
    <MatchContent
        :match="match"
        :matchId="matchId"
        :signedInUserId="signedInUserId"
    />
  </div>
</template>

<script>
import LoadingIndicator from '@/components/LoadingIndicator.vue';
import MatchContent from '@/components/MatchContent.vue';
import { mapState, mapActions } from 'vuex';

export default {
  name: 'MatchDashboard',
  components: {
    LoadingIndicator,
    MatchContent,
  },
  data() {
    return {
      matchId: parseInt(this.$route.params.id, 10),
      signedInUserId: parseInt(localStorage.getItem('user_id'), 10),
    };
  },
  computed: {
    ...mapState(['loading', 'match']),
  },
  async created() {
    await this.fetchMatch(this.matchId);
    await this.fetchMatchPlayers(this.matchId);
  },
  methods: {
    ...mapActions(['fetchMatch', 'fetchMatchPlayers']),
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
