<template>
  <div class="game-button-container">
    <GameButton
        v-for="(buttonConfig, index) in buttonConfigs"
        :key="index"
        @button:press="buttonConfig.pressHandler"
        :isDisabled="buttonConfig.isDisabled"
        :labelEnabled="buttonConfig.labelEnabled"
        :labelDisabled="buttonConfig.labelDisabled"
    >
      <template #icon="{ mutedMidToMutedLight, mutedLightToSecondary, mutedMidToTertiary, mutedLightToWhite }">
        <component
            :is="iconMap[buttonConfig.icon]"
            :fillColor="mutedLightToWhite"
            :strokeColor="mutedMidToMutedLight"
            :strongIndicatorColor="mutedLightToSecondary"
            :sharpIndicatorColor="mutedMidToTertiary"
        />
      </template>
    </GameButton>
  </div>
</template>

<script>
import GameButton from '@/components/GameButton.vue';
import DrawOneFromStockIcon from '@/components/SvgIcons/DrawOneFromStockIcon.vue';
import DrawOneFromDiscardIcon from '@/components/SvgIcons/DrawOneFromDiscardIcon.vue';
import DrawMultipleFromDiscardIcon from '@/components/SvgIcons/DrawMultipleFromDiscardIcon.vue';
import PlayMeldIcon from '@/components/SvgIcons/PlayMeldIcon.vue';
import ExtendMeldIcon from '@/components/SvgIcons/ExtendMeldIcon.vue';
import DiscardIcon from '@/components/SvgIcons/DiscardIcon.vue';

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
        DrawOneFromStockIcon: DrawOneFromStockIcon,
        DrawOneFromDiscardIcon: DrawOneFromDiscardIcon,
        DrawMultipleFromDiscardIcon: DrawMultipleFromDiscardIcon,
        PlayMeldIcon: PlayMeldIcon,
        ExtendMeldIcon: ExtendMeldIcon,
        DiscardIcon: DiscardIcon,
      };
    },
  },
};
</script>

<style scoped>
.game-button-container {
  display: flex;
  gap: var(--base-margin);
  justify-content: center;
  width: 100%;
}
</style>
