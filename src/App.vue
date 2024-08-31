<template>
  <div class="outer-container">
    <NavigationMenu/>
    <LoadingIndicator/>
    <ErrorBox/>
    <div class="inner-container">
      <router-view @auth-success="handleAuthSuccess"/>
    </div>
  </div>
</template>

<script>
import {onMounted, onUnmounted} from 'vue';
import {useRouter} from 'vue-router';
import {useStore} from 'vuex';
import ErrorBox from '@/components/ErrorBox.vue';
import LoadingIndicator from '@/components/LoadingIndicator.vue';
import NavigationMenu from '@/components/NavigationMenu.vue';
import {debounce} from '@/utils/timingUtils';

const RESIZE_DEBOUNCE_INTERVAL_MILLISECONDS = 100;

export default {
  name: 'App',
  components: {
    ErrorBox,
    LoadingIndicator,
    NavigationMenu,
  },
  setup() {
    const router = useRouter();
    const store = useStore();

    const handleAuthSuccess = () => {
      router.push('/matches');
    };

    const onViewportResize = debounce(() => {
          store.dispatch('sessionState/domSizing/viewport/updateDimensions');
        },
        RESIZE_DEBOUNCE_INTERVAL_MILLISECONDS,
    );

    onMounted(() => {
      store.dispatch('sessionState/domSizing/viewport/updateDimensions');
      window.addEventListener('resize', onViewportResize);
    });

    onUnmounted(() => {
      window.removeEventListener('resize', onViewportResize);
    });

    return {
      handleAuthSuccess,
    };
  },
};
</script>

<style lang="scss">
@import '@/assets/globalStyles';
</style>

<style lang="scss" scoped>
@use '@/assets/core/color/variables' as color;
@use '@/assets/core/spacing/variables' as spacing;

.outer-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0;
  box-sizing: border-box;

  .inner-container {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    width: 100%;
    padding: var(--spacing-padding-standard);
    box-sizing: border-box;
  }
}
</style>
