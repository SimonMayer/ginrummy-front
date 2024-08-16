<template>
  <div class="create-match">
    <h1>Create Match</h1>
    <button @click="createMatch">Create Match</button>
  </div>
</template>

<script>
import {mapActions} from 'vuex';
import apiClient from '@/api/axios';

export default {
  name: 'CreateMatch',
  methods: {
    ...mapActions({
      logError: 'sessionState/indicators/errorLog/addLogEntry',
      recordLoadingStart: 'sessionState/indicators/loading/recordLoadingStart',
      recordLoadingEnd: 'sessionState/indicators/loading/recordLoadingEnd',
    }),
    async createMatch() {
      const key = 'createMatch';
      this.recordLoadingStart(key);
      try {
        const response = await apiClient.post('/matches'); // todo — use a service
        alert(`Match created! Match ID: ${response.data.match_id}`);
      } catch (error) {
        this.logError({title: 'Failed to create match', error});
      } finally {
        this.recordLoadingEnd(key);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/globalVariables';

.create-match {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
