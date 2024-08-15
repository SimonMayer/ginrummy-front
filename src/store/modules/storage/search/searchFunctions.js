const state = {
    searchFunctions: {},
};

const mutations = {
    REGISTER_SEARCH_FUNCTION(state, {key, searchFunction}) {
        state.searchFunctions[key] = searchFunction;
    },
};

const actions = {
    registerSearchFunction({commit}, {key, searchFunction}) {
        commit('REGISTER_SEARCH_FUNCTION', {key, searchFunction});
    },
};

const getters = {
    getSearchFunction: state => key => state.searchFunctions[key],
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
