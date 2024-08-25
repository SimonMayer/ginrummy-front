<template>
  <div class="container">
    <NavigationMenu/>
    <LoadingIndicator/>
    <ErrorBox/>
    <router-view @auth-success="handleAuthSuccess"/>
  </div>
</template>

<script>
import {useRouter} from 'vue-router';
import ErrorBox from '@/components/ErrorBox.vue';
import NavigationMenu from '@/components/NavigationMenu.vue';
import LoadingIndicator from '@/components/LoadingIndicator.vue';

export default {
  name: 'App',
  components: {
    NavigationMenu,
    ErrorBox,
    LoadingIndicator,
  },
  setup() {
    const router = useRouter();

    const handleAuthSuccess = () => {
      router.push('/matches');
    };

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

#app {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: color.$text;
  min-height: 100vh;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 spacing.$padding-standard;
  box-sizing: border-box;
}
</style>
