<template>
  <div
      v-if="cardData"
      :class="{ selected: isSelected, draggable: draggable }"
      :draggable="draggable"
      class="card visible-card"
      @click="handleClick"
      @dragend="handleDragend"
      @dragstart="handleDragstart"
      @touchend="handleTouchend"
      @touchmove="handleTouchmove"
      @touchstart="handleTouchstart"
  >
    <div :class="['card-content', rankClass, suitClass]">
      <CardCorner :rank="displayRank" :suit="suitEmoji" class="top-left"/>
      <CardPattern :suitEmoji="suitEmoji" :suitRepeat="suitRepeat"/>
      <CardCorner :rank="displayRank" :suit="suitEmoji" class="bottom-right"/>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import CardCorner from '@/components/CardCorner.vue';
import CardPattern from '@/components/CardPattern.vue';
import {touchHandlingMixin} from '@/mixins/touchHandlingMixin';
import cardsService from '@/services/cardsService';
import {getDisplayRank, getSuitEmoji, getSuitRepeat} from '@/utils/cardUtils';

export default {
  name: 'VisibleCard',
  mixins: [touchHandlingMixin],
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
      allowClick: true,
      allowDrag: true,
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
    componentSpecificTouchSource() {
      return `VisibleCard${this.id}`;
    },
  },
  methods: {
    ...mapActions({
      startDraggingVisibleCards: 'sessionState/uiOperations/dragState/startDraggingVisibleCards',
      stopDraggingItems: 'sessionState/uiOperations/dragState/stopDraggingItems',
      toggleSelectedCard: 'sessionState/uiOperations/selections/toggleSelectedCard',
      removeSelectedCard: 'sessionState/uiOperations/selections/removeSelectedCard',
    }),
    handleClick() {
      if (this.selectable) {
        this.toggleSelectedCard(this.id);
      }
    },
    preHandleDragstartFromTouch() {
      this.handleDragstart(null);
    },
    async handleDragstart(event) {
      if (!this.draggable) {
        return;
      }
      document.body.classList.add('dragging');
      await this.startDraggingVisibleCards({eventCardId: this.id, event});
    },
    async handleDragend() {
      document.body.classList.remove('dragging');
      await this.stopDraggingItems();
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
@use '@/assets/cards/variables' as card;
@import '@/assets/cards/styles';

.card {
  user-select: none;
  transition: transform var(--transition-time), filter var(--transition-time);

  &.selected {
    filter: card.$selected-filter;
  }

  .card-content {
    position: relative;
    height: card.$height;
    border: solid card.$content-border-width card.$edge-color;
    border-radius: card.$border-radius;
    background-color: card.$background-color;
    text-align: center;

    .top-left {
      top: card.$corner-indentation-size;
      left: 0;
    }

    .bottom-right {
      bottom: card.$corner-indentation-size;
      right: 0;
      transform: rotate(180deg);
    }

    &.spades {
      color: card.$suit-spades-color;
    }

    &.hearts {
      color: card.$suit-hearts-color;
    }

    &.clubs {
      color: card.$suit-clubs-color;
    }

    &.diamonds {
      color: card.$suit-diamonds-color;
    }
  }

  &.draggable {
    cursor: grab;
  }
}
</style>
