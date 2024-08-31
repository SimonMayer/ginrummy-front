<template>
  <div class="match-dashboard">
    <MatchTable v-if="isMatchLoaded"/>
  </div>
</template>

<script>
import {mapActions} from 'vuex';
import MatchTable from '@/components/MatchTable.vue';

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
.match-dashboard {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  width: 100%;
  align-items: center;
}
</style>
