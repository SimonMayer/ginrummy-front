import {getLocalStorage, setLocalStorage} from '@/utils/localStorage';

const state = {
    isAuthenticated: !!getLocalStorage('rest_access_token'),
    userId: getLocalStorage('user_id'),
};

const mutations = {
    SET_AUTHENTICATED(state, payload) {
        state.isAuthenticated = payload;
    },
    SET_USER_ID(state, userId) {
        state.userId = userId;
    },
};

const actions = {
    setAuthenticated({commit}, payload) {
        commit('SET_AUTHENTICATED', payload);
    },
    setUserId({commit}, userId) {
        commit('SET_USER_ID', parseInt(userId, 10));
        setLocalStorage('user_id', parseInt(userId, 10));
    },
};

const getters = {
    isAuthenticated: state => state.isAuthenticated,
    userId: state => state.userId,
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
