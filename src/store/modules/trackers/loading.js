const state = {
    loading: false,
};

const mutations = {
    SET_LOADING(state, payload) {
        state.loading = payload;
    },
};

const actions = {
    setLoading({ commit }, payload) {
        commit('SET_LOADING', payload);
    },
};

const getters = {
    loading: state => state.loading,
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
