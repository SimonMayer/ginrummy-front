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
@use '@/assets/core/animation/variables' as animation;
@use '@/assets/core/color/variables' as color;
@use '@/assets/core/decorative/variables' as decorative;
@use '@/assets/core/spacing/variables' as spacing;

nav {
  display: flex;
  justify-content: space-between;
  gap: spacing.$margin-standard;
  margin-bottom: spacing.$margin-standard;
  background-color: color.$secondary;
  padding: spacing.$padding-standard;
  border-radius: decorative.$border-radius;

  .nav-links, .auth-links {
    display: flex;
    gap: spacing.$margin-standard;
  }

  a {
    color: color.$text;
    text-decoration: none;
    padding: spacing.$padding-standard;
    border-radius: decorative.$border-radius;
    transition: background-color animation.$transition-time-standard;

    &:hover {
      background-color: color.$button-hover;
    }

    &.active {
      font-weight: bold;
      border-bottom: solid 2px color.$accent;
    }
  }
}
</style>
