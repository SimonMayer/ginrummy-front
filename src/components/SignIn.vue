<template>
  <div class="sign-in">
    <h1>Sign in</h1>
    <form @submit.prevent="handleSignIn">
      <input v-model="username" placeholder="Username"/>
      <input v-model="password" placeholder="Password" type="password"/>
      <button type="submit">Sign in</button>
    </form>
  </div>
</template>

<script>
import {mapActions} from 'vuex';

export default {
  name: 'SignIn',
  data() {
    return {
      username: '',
      password: '',
    };
  },
  methods: {
    ...mapActions({
      signIn: 'authentication/interactions/signIn',
    }),
    async handleSignIn() {
      const isAuthenticated = await this.signIn({username: this.username, password: this.password});
      if (isAuthenticated) {
        this.$emit('auth-success');
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@use '@/assets/core/spacing/variables' as spacing;

.sign-in {
  display: flex;
  flex-direction: column;
  align-items: center;

  form {
    display: flex;
    flex-direction: column;
    width: 300px;

    button {
      padding: spacing.$padding-standard;
    }
  }
}
</style>
