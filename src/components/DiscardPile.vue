<template>
  <div
      v-if="visibleRoundId"
      :class="['discard-pile', { 'accepts-drop': acceptsDrop }]"
      @dragenter="handleDragenter"
      @dragleave="handleDragleave"
      @drop="handleDrop"
      @dragover.prevent
  >
    <VisibleCard
        v-for="card in visibleCards"
        :key="card.card_id"
        :cardProp="card"
        :class="{ selectable: isCardSelectable(card) }"
        :draggable="isCardDraggable(card)"
        :selectable="isCardSelectable(card)"
    />
    <div v-if="isEmpty" class="empty-placeholder">
      <div>Discarded cards will appear here</div>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import VisibleCard from '@/components/VisibleCard.vue';
import {dropRecipientMixin} from '@/mixins/dropRecipientMixin';

export default {
  name: 'DiscardPile',
  mixins: [dropRecipientMixin],
  components: {
    VisibleCard,
  },
  computed: {
    ...mapGetters({
      selectableCards: 'sessionState/derived/discardPile/selectableDiscardPileCards',
      visibleCards: 'sessionState/derived/discardPile/visibleDiscardPileCards',
      visibleTopDiscardPileCardId: 'sessionState/derived/discardPile/visibleTopDiscardPileCardId',
      visibleRoundId: 'sessionState/derived/rounds/visibleRoundId',
      canDiscardByDragging: 'sessionState/permissions/discard/canDiscardByDragging',
      canDrawOneFromDiscardPile: 'sessionState/permissions/draw/canDrawOneFromDiscardPile',
      canDrawMultiple: 'sessionState/permissions/draw/canDrawMultiple',
    }),
    isEmpty() {
      return this.visibleCards?.length === 0;
    },
    acceptsDrop() {
      return this.provisionallyAcceptsDrop && this.canDiscardByDragging;
    },
  },
  methods: {
    ...mapActions({
      discardCard: 'interactions/turns/discard/discardCard',
    }),
    isCardDraggable(card) {
      return this.canDrawMultiple ||
          (this.canDrawOneFromDiscardPile && (card.card_id === this.visibleTopDiscardPileCardId));
    },
    isCardSelectable(card) {
      return this.selectableCards.includes(card);
    },
    async handleDrop() {
      if (this.canDiscardByDragging) {
        await this.discardCard();
      }
      this.clearDraggedCards();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/globalVariables';
@import '@/assets/cards/variables.css';

.discard-pile {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  padding: calc(var(--card-height) * 0.1) calc(var(--card-width) * 0.1);
  height: var(--card-height);

  .selectable {
    cursor: pointer;
  }

  @for $i from 1 through 52 {
    .card:nth-child(#{$i}) {
      $rotate: rotate(0);
      @if $i == 1 {
        $rotate: rotate(0.6deg);
      } @else if $i % 5 == 0 {
        $rotate: rotate(-0.3deg);
      } @else if $i % 3 == 0 {
        $rotate: rotate(-1.2deg);
      } @else if $i % 2 == 0 {
        $rotate: rotate(-0.8deg);
      } @else if $i % 2 != 0 {
        $rotate: rotate(1deg);
      }
      transform: $rotate;

      @if $i != 1 {
        margin-left: calc(var(--card-width) * -0.85);
      }

      &.selected {
        transform: $rotate translateY(calc(var(--card-height) * -0.2));
      }
    }
  }

  .empty-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--card-width);
    height: var(--card-height);
    background-color: rgba(var(--secondary-color-rgb), 0.8);
    border: calc(var(--card-border-width) * 5) dashed var(--muted-light-color);
    border-radius: var(--card-border-radius);
    font-size: calc(var(--card-base-size) * 18);
    color: var(--muted-light-color);

    div {
      transform: rotate(-90deg);
      margin: var(--base-margin);
    }
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: transparent;
    transition: background-color 0.3s ease;
    pointer-events: none;
    z-index: 1;
  }

  &.accepts-drop {
    &::before {
      background-color: rgba(var(--accent-color-rgb), 0.25);
    }
  }
}
</style>
