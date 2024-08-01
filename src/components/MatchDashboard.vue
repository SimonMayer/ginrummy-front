<template>
  <div class="match-dashboard">
    <ErrorBox v-if="errorTitle" :title="errorTitle" :message="errorMessage" @close="clearErrorBox" />
    <LoadingIndicator :visible="loading" />
    <MatchContent
        :match="match"
        :matchId="matchId"
        :signedInUserId="signedInUserId"
        @error="handleError"
        @match-started="loadMatchDetails"
    />
  </div>
</template>

<script>
import matchesService from '@/services/matchesService';
import { setErrorMessage, clearErrorMessage } from '@/utils/errorHandler';
import ErrorBox from '@/components/ErrorBox.vue';
import LoadingIndicator from '@/components/LoadingIndicator.vue';
import MatchContent from '@/components/MatchContent.vue';
import { mapState, mapActions } from 'vuex';

export default {
  name: 'MatchDashboard',
  components: {
    ErrorBox,
    LoadingIndicator,
    MatchContent,
  },
  data() {
    return {
      matchId: parseInt(this.$route.params.id, 10),
      match: {
        create_time: '',
        created_by: null,
        end_time: null,
        match_id: null,
        start_time: null,
      },
      errorTitle: '',
      errorMessage: '',
      signedInUserId: parseInt(localStorage.getItem('user_id'), 10),
    };
  },
  computed: {
    ...mapState(['loading'])
  },
  async created() {
    await this.loadData([
      { method: this.loadMatchDetails, errorTitle: 'Failed to fetch match details!' }
    ]);
  },
  methods: {
    ...mapActions(['setLoading']),
    async loadData(tasks) {
      for (const { method, errorTitle } of tasks) {
        await this.handleApiCall(method, errorTitle);
      }
    },
    async handleApiCall(apiCall, errorTitle) {
      this.setLoading(true);
      try {
        await apiCall();
      } catch (error) {
        setErrorMessage(this, errorTitle, error);
        console.error(error);
      } finally {
        this.setLoading(false);
      }
    },
    async loadMatchDetails() {
      this.match = await matchesService.getMatchDetails(this.matchId);
      this.match.match_id = this.matchId; // Ensure match_id is set
    },
    handleError(title, error) {
      setErrorMessage(this, title, error);
    },
    clearErrorBox() {
      clearErrorMessage(this);
    }
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
