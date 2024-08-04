import router from '@/router';

const state = {
    isAuthenticated: !!localStorage.getItem('rest_access_token'),
};

const mutations = {
    SET_AUTHENTICATED(state, payload) {
        state.isAuthenticated = payload;
    },
};

const actions = {
    setAuthenticated({ commit }, payload) {
        commit('SET_AUTHENTICATED', payload);
    },
    signOut({ commit }) {
        localStorage.removeItem('rest_access_token');
        localStorage.removeItem('sse_access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_id');
        commit('SET_AUTHENTICATED', false);
        router.push('/');
    },
};

const getters = {
    isAuthenticated: state => state.isAuthenticated,
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
