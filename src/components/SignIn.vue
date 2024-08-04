<template>
  <div class="sign-in">
    <h1>Sign in</h1>
    <form @submit.prevent="signIn">
      <input v-model="username" placeholder="Username" />
      <input v-model="password" type="password" placeholder="Password" />
      <button type="submit">Sign in</button>
    </form>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import apiClient from '@/api/axios';

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
      setAuthenticated: 'auth/setAuthenticated',
      setError: 'error/setError',
      setLoading: 'loading/setLoading',
    }),
    async signIn() {
      this.setLoading(true);
      try {
        const response = await apiClient.post('/auth/sign-in', { // todo — use a service
          username: this.username,
          password: this.password
        });
        localStorage.setItem('rest_access_token', response.data.rest_access_token);
        localStorage.setItem('sse_access_token', response.data.sse_access_token);
        localStorage.setItem('refresh_token', response.data.refresh_token);
        localStorage.setItem('user_id', response.data.user_id);

        this.setAuthenticated(true);

        this.$emit('auth-success');
      } catch (error) {
        this.setError({title: 'Sign in failed', error});
      } finally {
        this.setLoading(false);
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/globalVariables';

.sign-in {
  display: flex;
  flex-direction: column;
  align-items: center;

  form {
    display: flex;
    flex-direction: column;
    width: 300px;

    input {
      font-size: 16px;
    }

    button {
      padding: var(--base-padding);
      font-size: 16px;
    }
  }
}
</style>
