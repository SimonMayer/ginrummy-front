<template>
  <div class="create-match">
    <h1>Create Match</h1>
    <button @click="createMatch">Create Match</button>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import apiClient from '@/api/axios';

export default {
  name: 'CreateMatch',
  methods: {
    ...mapActions(['setLoading', 'setError']),
    async createMatch() {
      this.setLoading(true);
      try {
        const response = await apiClient.post('/matches');
        alert(`Match created! Match ID: ${response.data.match_id}`);
      } catch (error) {
        this.setError({title: 'Failed to create match', error});
      } finally {
        this.setLoading(false);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/globalVariables';

.create-match {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
