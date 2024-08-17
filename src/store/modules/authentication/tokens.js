import {getLocalStorage, setLocalStorage} from '@/utils/localStorage';
import authService from '@/services/authService';
import tokenService from '@/services/tokenService';

const state = {
    restAccessToken: getLocalStorage('rest_access_token'),
    sseAccessToken: getLocalStorage('sse_access_token'),
    refreshToken: getLocalStorage('refresh_token'),
};

const mutations = {
    SET_REST_ACCESS_TOKEN(state, token) {
        state.restAccessToken = token;
    },
    SET_SSE_ACCESS_TOKEN(state, token) {
        state.sseAccessToken = token;
    },
    SET_REFRESH_TOKEN(state, token) {
        state.refreshToken = token;
    },
};

const actions = {
    setRestAccessToken({commit}, token) {
        commit('SET_REST_ACCESS_TOKEN', token);
        setLocalStorage('rest_access_token', token);
    },
    setSseAccessToken({commit}, token) {
        commit('SET_SSE_ACCESS_TOKEN', token);
        setLocalStorage('sse_access_token', token);
    },
    setRefreshToken({commit}, token) {
        commit('SET_REFRESH_TOKEN', token);
        setLocalStorage('refresh_token', token);
    },
    async refreshRestAccessToken({dispatch}) {
        try {
            const newRestAccessToken = await tokenService.refreshRestToken();
            dispatch('setRestAccessToken', newRestAccessToken);
        } catch (error) {
            await authService.signOutAndRedirect();
        }
    },
    async refreshSseAccessToken({dispatch}) {
        try {
            const newSseAccessToken = await tokenService.refreshSseToken();
            dispatch('setSseAccessToken', newSseAccessToken);
        } catch (error) {
            await authService.signOutAndRedirect();
        }
    },
};

const getters = {
    restAccessToken: state => state.restAccessToken,
    sseAccessToken: state => state.sseAccessToken,
    refreshToken: state => state.refreshToken,
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
