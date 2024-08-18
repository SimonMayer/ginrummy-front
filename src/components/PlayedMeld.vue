<template>
  <div
      :class="['meld', type, `size-${sortedCards.length}`, { 'selected': isSelected, 'selectable': selectable }]"
      @click="handleClick"
  >
    <VisibleCard
        v-for="card in sortedCards"
        :key="card.card_id"
        :cardProp="card"
        :selectable="false"
        class="card"
    />
  </div>
</template>

<script>
import VisibleCard from '@/components/VisibleCard.vue';
import {mapActions, mapGetters} from 'vuex';
import meldsService from '@/services/meldsService';

export default {
  name: 'PlayedMeld',
  components: {
    VisibleCard,
  },
  props: {
    cards: {
      type: Array,
      required: true,
    },
    id: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapGetters({
      runOrders: 'storage/gameConfig/runOrders',
      selectable: 'sessionState/permissions/melds/canSelectMelds',
      selectedMeldId: 'sessionState/selections/selectedMeldId',
    }),
    isSelected() {
      return this.selectedMeldId === this.id;
    },
    sortedCards() {
      return meldsService.sortCardsByRunOrders(this.cards, this.runOrders);
    },
  },
  methods: {
    ...mapActions({
      toggleSelectedMeldId: 'sessionState/selections/toggleSelectedMeldId',
    }),
    handleClick() {
      if (this.selectable) {
        this.toggleSelectedMeldId(this.id);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/globalVariables';
@import '@/assets/cards/variables.css';

@mixin fan-shape($maximumCardCount, $span, $rotationOffset, $shownFirstCards, $shownFinalCards, $innerCardRotationFactor) {
  $uncompactedMeldSize: $shownFirstCards + $shownFinalCards + 2;
  $defaultCardRotation: calc($span / $maximumCardCount);
  $innerCardRotation: $defaultCardRotation * $innerCardRotationFactor;
  $rotation: 0;

  @for $meldSize from 1 through $maximumCardCount {
    $preFinalCards: $meldSize - $shownFinalCards;
    @for $card from 1 through $meldSize {

      @if $meldSize <= $uncompactedMeldSize {
        $rotation: ($card * $defaultCardRotation) + $rotationOffset;
      } @else {
        $firstCardRotations: min($card, ($shownFirstCards + 1)) * $defaultCardRotation;
        $innerCardRotations: max(min($card, ($preFinalCards + 1)) - ($shownFirstCards + 1), 0) * $innerCardRotation;
        $finalCardRotations: max($card - ($preFinalCards + 1), 0) * $defaultCardRotation;
        $rotation: $firstCardRotations + $innerCardRotations + $finalCardRotations + $rotationOffset;
      }

      &.size-#{$meldSize} {
        .card:nth-child(#{$card}) {
          transform: rotate($rotation);
        }
      }
    }
  }
}

.meld {
  position: relative;
  display: flex;
  justify-content: right;
  align-items: flex-start;
  width: calc(var(--card-width) * 0.8);
  height: var(--card-height);
  padding-top: calc(var(--card-width) * 0.12);
  padding-bottom: calc(var(--card-width) * 0.1);
  padding-left: calc((var(--card-width) * 0.2) + (var(--card-height) * 0.27));

  &.size-4 {
    padding-right: calc(var(--card-width) * 0.02);
  }

  &.size-5 {
    padding-right: calc(var(--card-width) * 0.18);
  }

  &.size-6 {
    padding-right: calc(var(--card-width) * 0.06);
  }

  &.size-7 {
    padding-right: calc(var(--card-width) * 0.12);
  }

  &.size-8 {
    padding-right: calc(var(--card-width) * 0.18);
  }

  &.size-9 {
    padding-right: calc(var(--card-width) * 0.24);
  }

  &.size-10 {
    padding-right: calc(var(--card-width) * 0.30);
  }

  &.size-11 {
    padding-right: calc(var(--card-width) * 0.36);
    padding-bottom: calc(var(--card-width) * 0.15);
  }

  &.size-12 {
    padding-right: calc(var(--card-width) * 0.42);
    padding-bottom: calc(var(--card-width) * 0.18);
  }

  &.size-13 {
    padding-right: calc(var(--card-width) * 0.48);
    padding-bottom: calc(var(--card-width) * 0.22);
  }

  &.selected {
    .card {
      filter: var(--card-selected-filter);
    }
  }

  &.selectable {
    cursor: pointer;
  }

  .card {
    position: absolute;
    transform-origin: 20% 150%;
  }

  &.run {
    @include fan-shape(13, 56.5deg, -20, 2, 1, 0.4);
  }

  &.set {
    @include fan-shape(4, 20deg, -20, 2, 1, 1);
  }
}
</style>
