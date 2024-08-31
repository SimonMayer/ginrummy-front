<template>
  <div
      ref="meldsContainer"
      :class="['melds-container', { 'tile': tileMode, 'bridge': !tileMode }]"
  >
    <PlayedMeld
        v-for="meld in visibleMelds"
        :id="meld.meld_id"
        :key="meld.meld_id"
        :cards="meld.cards"
        :tileMode="tileMode"
        :type="meld.meld_type"
    />
    <PlayArea :tileMode="tileMode"/>
  </div>
</template>

<script>
import {onMounted, onUnmounted, ref, watch} from 'vue';
import {mapGetters, useStore} from 'vuex';
import PlayArea from '@/components/PlayArea.vue';
import PlayedMeld from '@/components/PlayedMeld.vue';
import {debounce} from '@/utils/timingUtils';

const BRIDGE_TILE_TOGGLE_PROPORTION_BUFFER = 0.1;
const RESIZE_DEBOUNCE_INTERVAL_MILLISECONDS = 100;
const MAXIMUM_VIEWPORT_HEIGHT_PROPORTION = 0.25;

export default {
  name: 'MeldsContainer',
  components: {
    PlayArea,
    PlayedMeld,
  },
  data() {
    return {
      tileMode: false,
    };
  },
  setup() {
    const store = useStore();
    const meldsContainer = ref(null);
    let resizeObserver = null;

    const onResize = debounce(
        () => store.dispatch('sessionState/domSizing/melds/initializeCalculations'),
        RESIZE_DEBOUNCE_INTERVAL_MILLISECONDS,
    );

    onMounted(() => {
      store.dispatch('sessionState/domSizing/melds/registerContainerElement', meldsContainer.value);
      store.dispatch('sessionState/domSizing/melds/setMaximumViewportHeightProportion', MAXIMUM_VIEWPORT_HEIGHT_PROPORTION);
      store.dispatch('sessionState/domSizing/melds/initializeCalculations');

      resizeObserver = new ResizeObserver(onResize);
      resizeObserver.observe(meldsContainer.value);
    });

    onUnmounted(() => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    });

    watch(() => store.getters['sessionState/domSizing/viewport/innerWidth'], onResize);
    watch(() => store.getters['sessionState/domSizing/viewport/innerHeight'], onResize);

    return {
      meldsContainer,
    };
  },
  computed: {
    ...mapGetters({
      visibleMelds: 'sessionState/derived/melds/visibleMelds',
      visibleMeldsCardCount: 'sessionState/derived/melds/visibleMeldsCardCount',
      unallocatedHeightProportion: 'sessionState/domSizing/melds/unallocatedHeightProportion',
      unallocatedWidthProportion: 'sessionState/domSizing/melds/unallocatedWidthProportion',
    }),
  },
  methods: {
    setTileMode() {
      if ((this.unallocatedWidthProportion === null) || (this.unallocatedHeightProportion === null)) {
        return;
      }
      if (!this.tileMode && (this.unallocatedWidthProportion < 0 || this.unallocatedHeightProportion < 0)) {
        this.tileMode = true;
      }

      if (
          this.tileMode &&
          this.unallocatedWidthProportion >= BRIDGE_TILE_TOGGLE_PROPORTION_BUFFER &&
          this.unallocatedHeightProportion >= BRIDGE_TILE_TOGGLE_PROPORTION_BUFFER
      ) {
        this.tileMode = false;
      }
    },
  },
  watch: {
    unallocatedHeightProportion() {
      this.setTileMode();
    },
    unallocatedWidthProportion() {
      this.setTileMode();
    },
    visibleMeldsCardCount() {
      this.setTileMode();
    },
  },
};
</script>

<style lang="scss" scoped>
@use '@/assets/core/spacing/variables' as spacing;

.melds-container {
  display: flex;
  gap: var(--spacing-margin-standard);
  justify-content: left;

  &.tile {
    flex-wrap: wrap;
  }
}
</style>
