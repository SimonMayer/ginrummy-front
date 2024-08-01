<template>
  <div class="item-search">
    <input v-model="searchTerm" @input="search" :placeholder="placeholder" />
    <ul v-if="filteredResults.length">
      <li v-for="item in filteredResults" :key="item.id" @click="selectItem(item)" class="search-item">
        {{ item[displayProperty] }}
      </li>
    </ul>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

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
    }
  },
  data() {
    return {
      searchTerm: '',
      searchResults: []
    };
  },
  computed: {
    filteredResults() {
      return this.searchResults.filter(
          result => !this.excludeItems.some(
              excludeItem => excludeItem[this.excludeProperty] === result[this.excludeProperty]
          )
      );
    }
  },
  methods: {
    ...mapActions(['setLoading', 'setError']),
    async search() {
      if (this.searchTerm.length > 2) {
        this.setLoading(true);
        try {
          this.searchResults = await this.searchFunction(this.searchTerm);
        } catch (error) {
          this.setError({ title: 'Search failed', error });
        } finally {
          this.setLoading(false);
        }
      } else {
        this.searchResults = [];
      }
    },
    selectItem(item) {
      this.$emit('item-selected', item);
    }
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
