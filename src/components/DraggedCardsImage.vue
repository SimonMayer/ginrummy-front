<template>
  <div class="dragged-cards-image">
    <VisibleCard
        v-for="card in allSelectedCards"
        :key="card.card_id"
        :cardProp="card"
        :class="'card'"
    />
  </div>
</template>

<script>
import VisibleCard from '@/components/VisibleCard.vue';
import {mapActions, mapGetters} from 'vuex';

export default {
  name: 'DraggedCardsImage',
  components: {
    VisibleCard,
  },
  computed: {
    ...mapGetters({
      allSelectedCards: 'sessionState/derived/selectedItems/allSelectedCards',
      event: 'sessionState/uiOperations/dragState/event',
    }),
  },
  methods: {
    ...mapActions({
      registerDraggedCardsImage: 'sessionState/uiOperations/dragState/registerDraggedCardsImage',
    }),
  },
  mounted() {
    this.registerDraggedCardsImage(this.$el);
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/globalVariables';
@import '@/assets/cards/variables.css';
@import '@/assets/players';

.dragged-cards-image {
  display: flex;
  flex-direction: row;
  justify-content: center;
  position: absolute;
  top: calc(-1 * (var(--card-height) + var(--card-width)));

  .card {
    &:not(:first-child) {
      margin-left: calc(var(--card-width) * -0.8);
    }
  }
}
</style>
