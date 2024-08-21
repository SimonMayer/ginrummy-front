<template>
  <div ref="draggedVisibleCardsImage" class="dragged-visible-cards-image">
    <VisibleCard
        v-for="card in [...selectedDiscardPileCards, ...selectedHandCards]"
        :key="card.card_id"
        :cardProp="card"
        :class="'card'"
    />
  </div>
  <div ref="draggedHiddenCardImage" class="dragged-hidden-card-image">
    <HiddenCard class="card"/>
  </div>
</template>

<script>
import VisibleCard from '@/components/VisibleCard.vue';
import {mapActions, mapGetters} from 'vuex';
import HiddenCard from '@/components/HiddenCard.vue';

export default {
  name: 'DragImages',
  components: {
    HiddenCard,
    VisibleCard,
  },
  computed: {
    ...mapGetters({
      selectedHandCards: 'sessionState/derived/selectedItems/selectedHandCards',
      selectedDiscardPileCards: 'sessionState/derived/selectedItems/selectedDiscardPileCards',
      event: 'sessionState/uiOperations/dragState/event',
    }),
  },
  methods: {
    ...mapActions({
      registerVisibleCardsImage: 'sessionState/uiOperations/dragState/registerVisibleCardsImage',
      registerDraggedHiddenCardImage: 'sessionState/uiOperations/dragState/registerDraggedHiddenCardImage',
    }),
  },
  mounted() {
    this.registerVisibleCardsImage(this.$refs.draggedVisibleCardsImage);
    this.registerDraggedHiddenCardImage(this.$refs.draggedHiddenCardImage);
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/globalVariables';
@import '@/assets/cards/variables.css';
@import '@/assets/players';

.dragged-visible-cards-image,
.dragged-hidden-card-image {
  position: absolute;
}

.dragged-visible-cards-image {
  top: calc(-1 * (var(--card-height) + var(--card-width)));
  display: flex;
  flex-direction: row;
  justify-content: center;

  .card {
    &:not(:first-child) {
      margin-left: calc(var(--card-width) * -0.8);
    }
  }
}

.dragged-hidden-card-image {
  top: calc(-2 * (var(--card-height) + var(--card-width)));
}
</style>
