<template>
  <div class="game-button-container">
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
              :is="iconMap[buttonConfig.icon]"
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

export default {
  name: 'GameButtonContainer',
  components: {GameButton},
  props: {
    buttonConfigs: {
      type: Array,
      required: true,
      validator(value) {
        return value.every(config =>
            Object.prototype.hasOwnProperty.call(config, 'pressHandler') &&
            Object.prototype.hasOwnProperty.call(config, 'isDisabled') &&
            Object.prototype.hasOwnProperty.call(config, 'labelEnabled') &&
            Object.prototype.hasOwnProperty.call(config, 'labelDisabled') &&
            Object.prototype.hasOwnProperty.call(config, 'icon'),
        );
      },
    },
  },
  computed: {
    iconMap() {
      return {
        DiscardIcon: DiscardIcon,
        DrawMultipleFromDiscardIcon: DrawMultipleFromDiscardIcon,
        DrawOneFromDiscardIcon: DrawOneFromDiscardIcon,
        DrawOneFromStockIcon: DrawOneFromStockIcon,
        ExtendMeldIcon: ExtendMeldIcon,
        PlayMeldIcon: PlayMeldIcon,
        UnselectCardsIcon: UnselectCardsIcon,
      };
    },
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
