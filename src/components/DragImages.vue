<template>
  <div ref="draggedVisibleCardsImage" class="dragged-visible-cards-image">
    <VisibleCard
        v-for="card in [...selectedDiscardPileCards, ...selectedHandCards]"
        :key="card.card_id"
        :cardProp="card"
    />
  </div>
  <div ref="draggedHiddenCardImage" class="dragged-hidden-card-image">
    <HiddenCard class="card"/>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import HiddenCard from '@/components/HiddenCard.vue';
import VisibleCard from '@/components/VisibleCard.vue';

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
    }),
  },
  methods: {
    ...mapActions({
      registerDraggedVisibleCardsImage: 'sessionState/uiOperations/dragState/registerDraggedVisibleCardsImage',
      registerDraggedHiddenCardImage: 'sessionState/uiOperations/dragState/registerDraggedHiddenCardImage',
    }),
  },
  mounted() {
    this.registerDraggedVisibleCardsImage(this.$refs.draggedVisibleCardsImage);
    this.registerDraggedHiddenCardImage(this.$refs.draggedHiddenCardImage);
  },
};
</script>

<style lang="scss" scoped>
@use '@/assets/cards/variables' as card;
@import '@/assets/players';

.dragged-visible-cards-image,
.dragged-hidden-card-image {
  position: absolute;
}

.dragged-visible-cards-image {
  display: flex;
  flex-direction: row;
  justify-content: center;
  pointer-events: none;

  .card {
    &:not(:first-child) {
      margin-left: calc(var(--card-bridge-width) * -0.8);
    }
  }
}

.dragged-visible-cards-image {
  top: calc(-1 * (var(--card-bridge-height) + var(--card-bridge-width)));
}

.dragged-hidden-card-image {
  top: calc(-2 * (var(--card-bridge-height) + var(--card-bridge-width)));
}
</style>
