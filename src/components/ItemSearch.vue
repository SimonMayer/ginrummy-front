<template>
  <div class="item-search">
    <input v-model="searchInput" @input="onSearchInput" :placeholder="placeholder" />
    <ul v-if="filteredResults.length">
      <li v-for="item in filteredResults" :key="item.id" @click="selectItem(item)" class="search-item">
        {{ item[displayProperty] }}
      </li>
    </ul>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'ItemSearch',
  props: {
    placeholder: {
      type: String,
      default: 'Search…'
    },
    searchFunction: {
      type: Function,
      required: true
    },
    displayProperty: {
      type: String,
      default: 'name'
    },
    excludeItems: {
      type: Array,
      default: () => []
    },
    excludeProperty: {
      type: String,
      required: true
    },
    searchKey: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      searchInput: ''
    };
  },
  computed: {
    ...mapGetters({
      searchTerm: 'getSearchTerm',
      searchResultsList: 'getSearchResults'
    }),
    filteredResults() {
      return this.searchResultsList(this.searchKey).filter(
          result => !this.excludeItems.some(
              excludeItem => excludeItem[this.excludeProperty] === result[this.excludeProperty]
          )
      );
    }
  },
  methods: {
    ...mapActions(['setSearchTerm', 'registerSearchFunction']),
    onSearchInput() {
      this.setSearchTerm({key: this.searchKey, term: this.searchInput});
    },
    selectItem(item) {
      this.$emit('item-selected', item);
    }
  },
  mounted() {
    this.searchInput = this.searchTerm(this.searchKey);
    this.registerSearchFunction({key: this.searchKey, searchFunction: this.searchFunction});
  }
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
      border: 1px solid var(--primary-color);
      border-radius: var(--border-radius);
      transition: background-color 0.3s ease;

      &:hover {
        background-color: var(--button-hover-color);
      }
    }
  }
}
</style>
