<template>
  <div
      v-if="visibleRoundId"
      :ref="componentSpecificDropAreaRef"
      :class="['discard-pile', { 'invites-drop': invitesDrop, 'accepts-drop': acceptsDrop }]"
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
    <div class="guidance-text-holder">
      <span class="guidance-text">Drop card here to discard it</span>
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
      canDiscardCurrentlyDraggedCard: 'sessionState/permissions/discard/canDiscardCurrentlyDraggedCard',
      canStartDraggingCardNowToDrawOneFromDiscardPile: 'sessionState/permissions/draw/canStartDraggingCardNowToDrawOneFromDiscardPile',
      canStartDraggingCardNowToDrawMultiple: 'sessionState/permissions/draw/canStartDraggingCardNowToDrawMultiple',
    }),
    isEmpty() {
      return this.visibleCards?.length === 0;
    },
    componentSpecificDropCriteria() {
      return this.canDiscardCurrentlyDraggedCard;
    },
    componentSpecificDropAreaRef() {
      return 'discardPileDropArea';
    },
  },
  methods: {
    ...mapActions({
      discardCard: 'interactions/turns/discard/discardCard',
    }),
    isCardDraggable(card) {
      const cardId = card.card_id;
      return this.canStartDraggingCardNowToDrawMultiple(cardId) ||
          this.canStartDraggingCardNowToDrawOneFromDiscardPile(cardId);
    },
    isCardSelectable(card) {
      return this.selectableCards.includes(card);
    },
    async componentSpecificDropHandler() {
      if (this.canDiscardCurrentlyDraggedCard) {
        return await this.discardCard();
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@use '@/assets/core/animation/variables' as animation;
@use '@/assets/core/color/variables' as color;
@use '@/assets/core/spacing/variables' as spacing;
@use '@/assets/cards/variables' as card;
@import '@/assets/dropRecipient';

.discard-pile {
  position: relative;
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
        margin-left: calc(var(--card-maximum-overlap) * -1);
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
    background-color: rgba(color.$secondary, 0.8);
    border: dashed calc(var(--card-border-width) * 5) color.$muted-light;
    border-radius: var(--card-border-radius);
    font-size: var(--card-placeholder-font-size);
    color: color.$muted-light;

    div {
      transform: rotate(-90deg);
      margin: spacing.$margin-standard;
    }
  }

  @include drop-recipient;

  .guidance-text-holder {
    position: absolute;
    height: var(--card-width);
    width: var(--card-height);
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    transform: rotate(-90deg) translateX(calc(var(--card-height) / 3 * -0.8 - spacing.$margin-standard)) translateY(calc(var(--card-width) / 3 * -0.8));
    transition: z-index 0s animation.$transition-time-slower;
    user-select: none;
    z-index: -1;

    .guidance-text {
      margin: spacing.$margin-standard;
      width: var(--card-height);
    }
  }

  &.invites-drop,
  &.accepts-drop {
    .guidance-text-holder {
      transition: z-index 0s 0s;
      z-index: 2;

      .guidance-text {
        z-index: 3;
      }
    }
  }
}
</style>
