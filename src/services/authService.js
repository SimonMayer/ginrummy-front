import apiClient from '@/api/axios';
import store from '@/store';
import router from '@/router';

const authService = {
    async signIn(username, password) {
        const response = await apiClient.post('/auth/sign-in', {username, password});
        return response.data;
    },
    async signOutAndRedirect() {
        await store.dispatch('authentication/interactions/signOut');
        router.push('/');
    },
};

export default authService;
