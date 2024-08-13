import axios from 'axios';
import store from '@/store';
import authService from '@/services/authService';

const BASE_URL = process.env.VUE_APP_BASE_URL;

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(config => {
    const accessToken = store.getters['auth/tokens/restAccessToken'];
    if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
}, error => {
    return Promise.reject(error);
});

apiClient.interceptors.response.use(response => {
    return response;
}, async error => {
    if (!error.response || error.response.status !== 401) {
        console.error('error', error);
        return Promise.reject(error);
    }

    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
            await store.dispatch('auth/tokens/refreshRestAccessToken');
            const newRestAccessToken = store.getters['auth/tokens/restAccessToken'];
            originalRequest.headers['Authorization'] = `Bearer ${newRestAccessToken}`;
            return axios(originalRequest);
        } catch (refreshError) {
            authService.signOutAndRedirect();
            return Promise.reject(refreshError);
        }
    }

    return Promise.reject(error);
});

export default apiClient;
