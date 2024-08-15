<template>
  <div class="match-dashboard">
    <MatchContent v-if="isMatchLoaded"/>
  </div>
</template>

<script>
import MatchContent from '@/components/MatchContent.vue';
import {mapActions} from 'vuex';

export default {
  name: 'MatchDashboard',
  components: {
    MatchContent,
  },
  data() {
    return {
      isMatchLoaded: false,
    };
  },
  async created() {
    const response = await this.initializeMatchId(this.$route);
    if (!response.fetchRequired || response.isSuccess) {
      this.isMatchLoaded = true;
    }
  },
  methods: {
    ...mapActions({
      initializeMatchId: 'sessionState/matchIdentifier/initializeMatchId',
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
