<template>
  <div class="match-dashboard">
    <MatchTable v-if="isMatchLoaded"/>
  </div>
</template>

<script>
import MatchTable from '@/components/MatchTable.vue';
import {mapActions} from 'vuex';

export default {
  name: 'MatchDashboard',
  components: {
    MatchTable,
  },
  data() {
    return {
      isMatchLoaded: false,
    };
  },
  async created() {
    this.fetchGameConfig({});
    const response = await this.initializeMatchId(this.$route);
    if (!response.fetchRequired || response.isSuccess) {
      this.isMatchLoaded = true;
    }
  },
  methods: {
    ...mapActions({
      initializeMatchId: 'sessionState/matchIdentifier/initializeMatchId',
      fetchGameConfig: 'storage/gameConfig/fetchGameConfig',
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
