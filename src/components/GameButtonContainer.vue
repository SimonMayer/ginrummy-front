<template>
  <div
      v-if="currentRoundId && isVisibleRoundCurrent"
      class="game-button-container"
  >
    <template v-for="(buttonConfig, index) in buttonConfigs" :key="index">
      <div v-if="buttonConfig.addSeparatorBefore" v-show="!isDraggingItems" class="button-separator"></div>
      <GameButton
          v-show="!isDraggingItems"
          :isDisabled="buttonConfig.isDisabled"
          :labelDisabled="buttonConfig.labelDisabled"
          :labelEnabled="buttonConfig.labelEnabled"
          @button:press="buttonConfig.pressHandler"
      >
        <template #icon="{}">
          <component
              :is="buttonConfig.icon"
              :active="!buttonConfig.isDisabled"
              class="icon"
          />
        </template>
      </GameButton>
    </template>
  </div>
</template>

<script>
import {mapActions, mapGetters} from 'vuex';
import GameButton from '@/components/GameButton.vue';
import DiscardIcon from '@/components/SvgIcons/DiscardIcon.vue';
import DrawMultipleFromDiscardIcon from '@/components/SvgIcons/DrawMultipleFromDiscardIcon.vue';
import DrawOneFromDiscardIcon from '@/components/SvgIcons/DrawOneFromDiscardIcon.vue';
import DrawOneFromStockIcon from '@/components/SvgIcons/DrawOneFromStockIcon.vue';
import ExtendMeldIcon from '@/components/SvgIcons/ExtendMeldIcon.vue';
import PlayMeldIcon from '@/components/SvgIcons/PlayMeldIcon.vue';
import UnselectCardsIcon from '@/components/SvgIcons/UnselectCardsIcon.vue';

export default {
  name: 'GameButtonContainer',
  components: {GameButton},
  computed: {
    ...mapGetters({
      currentRoundId: 'sessionState/derived/rounds/currentRoundId',
      isVisibleRoundCurrent: 'sessionState/derived/rounds/isVisibleRoundCurrent',
      hasSelectedMeldOrCards: 'sessionState/derived/selectedItems/hasSelectedMeldOrCards',
      canDiscardNowByButton: 'sessionState/permissions/discard/canDiscardNowByButton',
      canDrawOneFromDiscardPileNowByButton: 'sessionState/permissions/draw/canDrawOneFromDiscardPileNowByButton',
      canDrawOneFromStockPileNowByButton: 'sessionState/permissions/draw/canDrawOneFromStockPileNowByButton',
      canDrawMultipleNowByButton: 'sessionState/permissions/draw/canDrawMultipleNowByButton',
      canExtendMeldFromHandNowByButton: 'sessionState/permissions/melds/canExtendMeldFromHandNowByButton',
      canPlayMeldFromHandNowByButton: 'sessionState/permissions/melds/canPlayMeldFromHandNowByButton',
      isDraggingItems: 'sessionState/uiOperations/dragState/isDraggingItems',
    }),
    buttonConfigs() {
      return [
        {
          icon: DrawOneFromStockIcon,
          isDisabled: !this.canDrawOneFromStockPileNowByButton,
          labelDisabled: 'Draw from stock',
          labelEnabled: 'Draw from stock',
          pressHandler: this.drawOneFromStockPile,
        },
        {
          icon: DrawOneFromDiscardIcon,
          isDisabled: !this.canDrawOneFromDiscardPileNowByButton,
          labelDisabled: 'Draw from discards',
          labelEnabled: 'Draw from discards',
          pressHandler: this.drawOneFromDiscardPile,
        },
        {
          icon: DrawMultipleFromDiscardIcon,
          isDisabled: !this.canDrawMultipleNowByButton,
          labelDisabled: 'Draw multiple',
          labelEnabled: 'Draw multiple',
          pressHandler: this.drawMultipleFromDiscardPile,
        },
        {
          addSeparatorBefore: true,
          icon: PlayMeldIcon,
          isDisabled: !this.canPlayMeldFromHandNowByButton,
          labelDisabled: 'Play a meld',
          labelEnabled: 'Play a meld',
          pressHandler: this.playMeld,
        },
        {
          icon: ExtendMeldIcon,
          isDisabled: !this.canExtendMeldFromHandNowByButton,
          labelDisabled: 'Extend a meld',
          labelEnabled: 'Extend selected meld',
          pressHandler: this.extendMeld,
        },
        {
          addSeparatorBefore: true,
          icon: DiscardIcon,
          isDisabled: !this.canDiscardNowByButton,
          labelDisabled: 'Discard card',
          labelEnabled: 'Discard card',
          pressHandler: this.discardCard,
        },
        {
          addSeparatorBefore: true,
          icon: UnselectCardsIcon,
          isDisabled: !this.hasSelectedMeldOrCards,
          labelDisabled: 'Nothing selected',
          labelEnabled: 'Unselect all',
          pressHandler: this.unselectAllCards,
        },
      ];
    },
  },
  methods: {
    ...mapActions({
      discardCard: 'interactions/turns/discard/discardCard',
      drawOneFromStockPile: 'interactions/turns/draw/drawOneFromStockPile',
      drawOneFromDiscardPile: 'interactions/turns/draw/drawOneFromDiscardPile',
      drawMultipleFromDiscardPile: 'interactions/turns/draw/drawMultipleFromDiscardPile',
      extendMeld: 'interactions/turns/melds/extendMeld',
      playMeld: 'interactions/turns/melds/playMeld',
      unselectAllCards: 'sessionState/uiOperations/selections/unselectAllCards',
    }),
  },
};
</script>

<style lang="scss" scoped>
@use '@/assets/core/color/variables' as color;
@use '@/assets/core/spacing/variables' as spacing;

.game-button-container {
  display: flex;
  gap: var(--spacing-margin-standard);
  justify-content: center;
  width: 100%;

  .button-separator {
    width: 1px;
    height: 100%;
    background-color: color.$muted-light;
    margin: 0 var(--spacing-margin-half);
  }
}
</style>
