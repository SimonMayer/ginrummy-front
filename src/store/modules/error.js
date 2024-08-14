const state = {
    errorTitle: '',
    error: null,
};

const mutations = {
    SET_ERROR(state, {title, error}) {
        state.errorTitle = title;
        state.error = error;
    },
    CLEAR_ERROR(state) {
        state.errorTitle = '';
        state.error = null;
    },
};

const actions = {
    setError({commit}, error) {
        commit('SET_ERROR', error);
    },
    clearError({commit}) {
        commit('CLEAR_ERROR');
    },
};

const getters = {
    errorTitle: state => state.errorTitle,
    error: state => state.error,
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
