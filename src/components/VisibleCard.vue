<template>
  <div
      v-if="cardData"
      :class="{ selected: isSelected, draggable: draggable }"
      :draggable="draggable"
      class="card visible-card"
      @click="handleClick"
      @dragend="stopDraggingCards"
      @dragstart="handleDragStart"
  >
    <div :class="['card-content', rankClass, suitClass]">
      <CardCorner :rank="displayRank" :suit="suitEmoji" class="top-left"/>
      <CardPattern :suitEmoji="suitEmoji" :suitRepeat="suitRepeat"/>
      <CardCorner :rank="displayRank" :suit="suitEmoji" class="bottom-right"/>
    </div>
  </div>
</template>

<script>
import CardCorner from '@/components/CardCorner.vue';
import CardPattern from '@/components/CardPattern.vue';
import {getDisplayRank, getSuitEmoji, getSuitRepeat} from '@/utils/cardUtils';
import cardsService from '@/services/cardsService';
import {mapActions, mapGetters} from 'vuex';

export default {
  name: 'VisibleCard',
  components: {
    CardCorner,
    CardPattern,
  },
  props: {
    cardProp: {
      type: [Object, Number],
      required: true,
      validator(value) {
        if (typeof value === 'number') {
          return true;
        }
        return (
            value &&
            typeof value.card_id === 'number' &&
            typeof value.rank === 'string' &&
            typeof value.suit === 'string' &&
            typeof value.point_value === 'number'
        );
      },
    },
    selectable: {
      type: Boolean,
      default: false,
    },
    draggable: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      cardData: null,
    };
  },
  computed: {
    ...mapGetters({
      isCardSelected: 'sessionState/uiOperations/selections/isCardSelected',
    }),
    id() {
      return this.cardData?.card_id;
    },
    isSelected() {
      return this.isCardSelected(this.id);
    },
    suitEmoji() {
      return getSuitEmoji(this.cardData.suit);
    },
    displayRank() {
      return getDisplayRank(this.cardData.rank);
    },
    suitRepeat() {
      return getSuitRepeat(this.cardData.rank);
    },
    rankClass() {
      return `rank-${this.cardData.rank}`;
    },
    suitClass() {
      return this.cardData.suit.toLowerCase();
    },
  },
  methods: {
    ...mapActions({
      toggleSelectedCard: 'sessionState/uiOperations/selections/toggleSelectedCard',
      removeSelectedCard: 'sessionState/uiOperations/selections/removeSelectedCard',
      startDraggingCards: 'sessionState/uiOperations/dragState/startDraggingCards',
      stopDraggingCards: 'sessionState/uiOperations/dragState/stopDraggingCards',
    }),
    handleClick() {
      if (this.selectable) {
        this.toggleSelectedCard(this.id);
      }
    },
    async handleDragStart(event) {
      if (this.draggable) {
        await this.startDraggingCards({eventCardId: this.id, event});
      }
    },
  },
  async created() {
    if (typeof this.cardProp === 'number') {
      this.cardData = cardsService.getCard(this.cardProp);
    } else {
      this.cardData = this.cardProp;
    }
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/globalVariables';
@import '@/assets/cards/variables.css';
@import '@/assets/cards/styles.css';

.card {
  user-select: none;
  transition: transform var(--transition-time), filter var(--transition-time);

  &.selected {
    filter: var(--card-selected-filter);
  }

  .card-content {
    position: relative;
    height: var(--card-height);
    border: solid var(--card-content-border-width) var(--card-edge-color);
    border-radius: var(--card-border-radius);
    background-color: var(--card-background-color);
    text-align: center;

    .top-left {
      top: var(--card-corner-indentation-size);
      left: 0;
    }

    .bottom-right {
      bottom: var(--card-corner-indentation-size);
      right: 0;
      transform: rotate(180deg);
    }

    &.spades {
      color: var(--card-suit-spades-color);
    }

    &.hearts {
      color: var(--card-suit-hearts-color);
    }

    &.clubs {
      color: var(--card-suit-clubs-color);
    }

    &.diamonds {
      color: var(--card-suit-diamonds-color);
    }
  }

  &.draggable {
    cursor: grab;
  }
}
</style>
