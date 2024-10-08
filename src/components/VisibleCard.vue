<template>
  <div
      v-if="cardData"
      :class="{ tile: tileMode, bridge: !tileMode, selected: isSelected, draggable: draggable }"
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
      <CardCorner v-if="!tileMode" :rank="displayRank" :suit="suitEmoji" class="top-left"/>
      <CardPattern v-if="!tileMode" :suitEmoji="suitEmoji" :suitRepeat="suitRepeat"/>
      <CardCorner v-if="!tileMode" :rank="displayRank" :suit="suitEmoji" class="bottom-right"/>
      <CardTile v-if="tileMode" :rank="displayRank" :suitEmoji="suitEmoji"/>
    </div>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import CardCorner from '@/components/CardCorner.vue';
import CardPattern from '@/components/CardPattern.vue';
import CardTile from '@/components/CardTile.vue';
import {touchHandlingMixin} from '@/mixins/touchHandlingMixin';
import cardsService from '@/services/cardsService';
import {getDisplayRank, getSuitEmoji, getSuitRepeat} from '@/utils/cardUtils';

export default {
  name: 'VisibleCard',
  mixins: [touchHandlingMixin],
  components: {
    CardCorner,
    CardPattern,
    CardTile,
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
    tileMode: {
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
@use '@/assets/core/animation/variables' as animation;
@use '@/assets/cards/variables' as card;
@import '@/assets/cards/styles';

.card {
  user-select: none;
  transition: transform animation.$transition-time-standard, filter animation.$transition-time-standard;

  &.selected {
    filter: card.$selectedFilter;
  }

  .card-content {
    position: relative;
    height: 100%;
    width: 100%;
    border-radius: var(--card-border-radius);
    background-color: card.$backgroundColor;
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
      color: card.$suitSpadesColor;
    }

    &.hearts {
      color: card.$suitHeartsColor;
    }

    &.clubs {
      color: card.$suitClubsColor;
    }

    &.diamonds {
      color: card.$suitDiamondsColor;
    }
  }

  &.draggable {
    cursor: grab;
  }
}
</style>
