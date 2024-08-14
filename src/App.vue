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
@import '@/assets/globalVariables';
@import '@/assets/globalStyles';
</style>

<style lang="scss" scoped>
#app {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--text-color);
  background-image: url('data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%231b5e20" fill-opacity="0.5"%3E%3Cpath d="M0 0h50v50H0zM50 50h50v50H50zM0 50h50v50H0zM50 0h50v50H50z"/%3E%3C/g%3E%3C/svg%3E%3E');
  background-size: 200px 200px;
  background-blend-mode: overlay;
  min-height: 100vh;
}

.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--base-padding);
  box-sizing: border-box;
}
</style>
