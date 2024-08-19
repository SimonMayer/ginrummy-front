<template>
  <div v-if="currentRoundId && isVisibleRoundCurrent" class="game-button-container">
    <template v-for="(buttonConfig, index) in buttonConfigs" :key="index">
      <div v-if="buttonConfig.addSeparatorBefore" class="button-separator"></div>
      <GameButton
          :isDisabled="buttonConfig.isDisabled"
          :labelDisabled="buttonConfig.labelDisabled"
          :labelEnabled="buttonConfig.labelEnabled"
          @button:press="buttonConfig.pressHandler"
      >
        <template #icon="{ mutedLightToSecondary, mutedLightToWhite, mutedMidToAccent, mutedMidToMutedLight}">
          <component
              :is="buttonConfig.icon"
              :fillColor="mutedLightToWhite"
              :sharpIndicatorColor="mutedMidToAccent"
              :strokeColor="mutedMidToMutedLight"
              :strongIndicatorColor="mutedLightToSecondary"
          />
        </template>
      </GameButton>
    </template>
  </div>
</template>

<script>
import GameButton from '@/components/GameButton.vue';
import DiscardIcon from '@/components/SvgIcons/DiscardIcon.vue';
import DrawMultipleFromDiscardIcon from '@/components/SvgIcons/DrawMultipleFromDiscardIcon.vue';
import DrawOneFromDiscardIcon from '@/components/SvgIcons/DrawOneFromDiscardIcon.vue';
import DrawOneFromStockIcon from '@/components/SvgIcons/DrawOneFromStockIcon.vue';
import ExtendMeldIcon from '@/components/SvgIcons/ExtendMeldIcon.vue';
import PlayMeldIcon from '@/components/SvgIcons/PlayMeldIcon.vue';
import UnselectCardsIcon from '@/components/SvgIcons/UnselectCardsIcon.vue';
import {mapActions, mapGetters} from 'vuex';

export default {
  name: 'GameButtonContainer',
  components: {GameButton},
  computed: {
    ...mapGetters({
      currentRoundId: 'sessionState/derived/rounds/currentRoundId',
      isVisibleRoundCurrent: 'sessionState/derived/rounds/isVisibleRoundCurrent',
      hasSelectedMeldOrCards: 'sessionState/derived/selectedItems/hasSelectedMeldOrCards',
      canDiscardSelected: 'sessionState/permissions/discard/canDiscardSelected',
      canOnlyDiscard: 'sessionState/permissions/discard/canOnlyDiscard',
      canDrawOneFromDiscardPile: 'sessionState/permissions/draw/canDrawOneFromDiscardPile',
      canDrawOneFromStockPile: 'sessionState/permissions/draw/canDrawOneFromStockPile',
      canDrawMultipleFromDiscardPile: 'sessionState/permissions/draw/canDrawMultipleFromDiscardPile',
      canExtendMeldFromHand: 'sessionState/permissions/melds/canExtendMeldFromHand',
      canPlayRunFromHand: 'sessionState/permissions/melds/canPlayRunFromHand',
      canPlaySetFromHand: 'sessionState/permissions/melds/canPlaySetFromHand',
    }),
    buttonConfigs() {
      return [
        {
          icon: DrawOneFromStockIcon,
          isDisabled: !this.canDrawOneFromStockPile,
          labelDisabled: 'Draw one card from the stock pile',
          labelEnabled: 'Draw one card from the stock pile',
          pressHandler: this.drawOneFromStockPile,
        },
        {
          icon: DrawOneFromDiscardIcon,
          isDisabled: !this.canDrawOneFromDiscardPile,
          labelDisabled: 'Draw one card from the discard pile',
          labelEnabled: 'Draw one card from the discard pile',
          pressHandler: this.drawOneFromDiscardPile,
        },
        {
          icon: DrawMultipleFromDiscardIcon,
          isDisabled: !this.canDrawMultipleFromDiscardPile,
          labelDisabled: 'Draw multiple cards to play or extend a meld',
          labelEnabled: 'Draw multiple cards to play or extend a meld',
          pressHandler: this.drawMultipleFromDiscardPile,
        },
        {
          addSeparatorBefore: true,
          icon: PlayMeldIcon,
          isDisabled: !this.canPlaySetFromHand && !this.canPlayRunFromHand,
          labelDisabled: 'Play a meld',
          labelEnabled: 'Play a meld from the selected cards',
          pressHandler: this.playMeld,
        },
        {
          icon: ExtendMeldIcon,
          isDisabled: !this.canExtendMeldFromHand,
          labelDisabled: 'Extend a meld',
          labelEnabled: 'Extend the selected meld',
          pressHandler: this.extendMeld,
        },
        {
          addSeparatorBefore: true,
          icon: DiscardIcon,
          isDisabled: !this.canDiscardSelected && !this.canOnlyDiscard,
          labelDisabled: 'Discard one card from your hand',
          labelEnabled: 'Discard one card from your hand',
          pressHandler: this.discardCard,
        },
        {
          addSeparatorBefore: true,
          icon: UnselectCardsIcon,
          isDisabled: !this.hasSelectedMeldOrCards,
          labelDisabled: 'You don\'t have any cards or melds selected.',
          labelEnabled: 'Unselect all cards and melds',
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
@import '@/assets/globalVariables';

.game-button-container {
  display: flex;
  gap: var(--base-margin);
  justify-content: center;
  width: 100%;

  .button-separator {
    width: 1px;
    height: 100%;
    background-color: var(--muted-light-color);
    margin-left: var(--base-margin);
    margin-right: var(--base-margin);
  }
}
</style>
