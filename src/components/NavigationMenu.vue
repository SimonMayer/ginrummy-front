<template>
  <nav>
    <div class="nav-links">
      <router-link
          v-if="isAuthenticated"
          v-slot="{ href, navigate, isActive, isExactActive }"
          custom
          to="/create-match"
      >
        <a :class="{ active: isActive, exactActive: isExactActive }" :href="href" @click="navigate">Create Match</a>
      </router-link>
      <router-link
          v-if="isAuthenticated"
          v-slot="{ href, navigate, isActive, isExactActive }"
          custom
          to="/matches"
      >
        <a :class="{ active: isActive, exactActive: isExactActive }" :href="href" @click="navigate">Your Matches</a>
      </router-link>
    </div>
    <div class="auth-links">
      <router-link
          v-if="!isAuthenticated"
          v-slot="{ href, navigate, isActive, isExactActive }"
          custom
          to="/"
      >
        <a :class="{ active: isActive, exactActive: isExactActive }" :href="href" @click="navigate">Sign In</a>
      </router-link>
      <a v-if="isAuthenticated" class="sign-out" href="#" @click.prevent="handleSignOut">Sign Out</a>
    </div>
  </nav>
</template>

<script>
import {mapGetters} from 'vuex';
import authService from '@/services/authService';

export default {
  name: 'NavigationMenu',
  computed: {
    ...mapGetters({
      isAuthenticated: 'authentication/user/isAuthenticated',
    }),
  },
  methods: {
    async handleSignOut() {
      authService.signOutAndRedirect();
    },
  },
};
</script>

<style lang="scss" scoped>
@import '@/assets/globalVariables';

nav {
  display: flex;
  justify-content: space-between;
  gap: var(--base-margin);
  margin-bottom: var(--base-margin);
  background-color: var(--secondary-color);
  padding: var(--base-padding);
  border-radius: var(--border-radius);

  .nav-links, .auth-links {
    display: flex;
    gap: var(--base-margin);
  }

  a {
    color: var(--text-color);
    text-decoration: none;
    padding: var(--base-padding);
    border-radius: var(--border-radius);
    transition: background-color 0.3s, color 0.3s;

    &:hover {
      background-color: var(--button-hover-color);
    }

    &.active {
      font-weight: bold;
      border-bottom: solid 2px var(--accent-color);
    }
  }
}
</style>
