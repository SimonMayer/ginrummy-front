<template>
  <div class="match-list">
    <h1>Your Matches</h1>
    <ul>
      <li v-for="match in sortedMatchList" :key="match.match_id">
        <router-link :to="`/matches/${match.match_id}`">
          <p>Match ID: {{ match.match_id }}</p>
          <p>Create Time: {{ formatDateTime(match.create_time) }}</p>
          <p v-if="match.start_time">Start Time: {{ formatDateTime(match.start_time) }}</p>
          <p v-if="match.end_time">End Time: {{ formatDateTime(match.end_time) }}</p>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import {formatDateTime} from '@/utils/dateFormatter';

export default {
  name: 'MatchList',
  computed: {
    ...mapGetters({
      matchList: 'storage/matches/list/matchList',
    }),
    sortedMatchList() {
      return this.matchList.slice().sort((a, b) => new Date(b.create_time) - new Date(a.create_time));
    },
  },
  async created() {
    await this.fetchMatchList({forceFetch: true});
  },
  methods: {
    ...mapActions({
      fetchMatchList: 'storage/matches/list/fetchMatchList',
    }),
    formatDateTime,
  },
};
</script>

<style lang="scss" scoped>
.match-list {
  display: flex;
  flex-direction: column;
  align-items: center;

  ul {
    list-style-type: none;
    padding: 0;
    width: 100%;

    li {
      background-color: var(--secondary-color);
      padding: calc(var(--base-padding) / 2) var(--base-padding);
      margin: var(--base-margin) 0;
      border-radius: var(--border-radius);
      transition: background-color var(--transition-time), box-shadow var(--transition-time);

      &:hover {
        background-color: var(--button-hover-color);
        box-shadow: var(--box-shadow-3-medium);
      }

      a {
        text-decoration: none;
        color: inherit;
      }
    }
  }
}
</style>
