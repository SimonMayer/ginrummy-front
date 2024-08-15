import axios from 'axios';
import store from '@/store';
import authService from '@/services/authService';

const BASE_URL = process.env.VUE_APP_BASE_URL;

const refreshClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

async function refreshToken(endpoint, tokenPropertyName, tokenSetter) {
    const refreshToken = store.getters['authentication/tokens/refreshToken'];
    if (!refreshToken) {
        throw new Error('Refresh token not found');
    }
    try {
        const response = await refreshClient.post(endpoint, {}, {
            headers: {'Authorization': `Bearer ${refreshToken}`},
        });
        const newAccessToken = response.data[tokenPropertyName];
        await store.dispatch(tokenSetter, newAccessToken);
        return newAccessToken;
    } catch (error) {
        authService.signOutAndRedirect();
        throw error;
    }
}

const tokenService = {
    async refreshSseToken() {
        return await refreshToken('/auth/refresh/sse', 'sse_access_token', 'authentication/tokens/setSseAccessToken');
    },
    async refreshRestToken() {
        return await refreshToken('/auth/refresh/rest', 'rest_access_token', 'authentication/tokens/setRestAccessToken');
    },
};

export default tokenService;
