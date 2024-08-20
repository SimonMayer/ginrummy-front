<template>
  <div class="item-search">
    <input v-model="searchInput" :placeholder="placeholder" @input="onSearchInput"/>
    <ul v-if="filteredResults.length">
      <li v-for="item in filteredResults" :key="item.id" class="search-item" @click="selectItem(item)">
        {{ item[displayProperty] }}
      </li>
    </ul>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';

export default {
  name: 'ItemSearch',
  props: {
    placeholder: {
      type: String,
      default: 'Search…',
    },
    searchFunction: {
      type: Function,
      required: true,
    },
    displayProperty: {
      type: String,
      default: 'name',
    },
    excludeItems: {
      type: Array,
      default: () => [],
    },
    excludeProperty: {
      type: String,
      required: true,
    },
    searchKey: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      searchInput: '',
    };
  },
  computed: {
    ...mapGetters({
      searchResultsList: 'storage/search/searches/getSearchResults',
      searchTerm: 'storage/search/searches/getSearchTerm',
    }),
    filteredResults() {
      return this.searchResultsList(this.searchKey).filter(
          result => !this.excludeItems.some(
              excludeItem => excludeItem[this.excludeProperty] === result[this.excludeProperty],
          ),
      );
    },
  },
  methods: {
    ...mapActions({
      setSearchTerm: 'storage/search/searches/setSearchTerm',
      registerSearchFunction: 'storage/search/searchFunctions/registerSearchFunction',
    }),
    onSearchInput() {
      this.setSearchTerm({key: this.searchKey, term: this.searchInput});
    },
    selectItem(item) {
      this.$emit('item-selected', item);
    },
  },
  mounted() {
    this.searchInput = this.searchTerm(this.searchKey);
    this.registerSearchFunction({key: this.searchKey, searchFunction: this.searchFunction});
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/globalVariables';

.item-search {
  margin-top: var(--base-margin);

  input {
    width: 100%;
    box-sizing: border-box;
  }

  ul {
    list-style-type: none;
    padding: 0;
    margin: var(--base-margin) 0 0 0;

    li.search-item {
      margin: var(--base-margin) 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      cursor: pointer;
      padding: var(--base-padding);
      border: solid var(--border-width-medium) var(--primary-color);
      border-radius: var(--border-radius);
      transition: background-color var(--transition-time);

      &:hover {
        background-color: var(--button-hover-color);
      }
    }
  }
}
</style>
