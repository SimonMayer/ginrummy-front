const state = {
    searches: {},
    searchFunctions: {},
};

const mutations = {
    SET_SEARCH_TERM(state, { key, term }) {
        if (!state.searches[key]) {
            state.searches[key] = {};
        }
        state.searches[key].term = term;
    },
    SET_SEARCH_RESULTS(state, { key, results }) {
        if (!state.searches[key]) {
            state.searches[key] = {};
        }
        state.searches[key].results = results;
    },
    REGISTER_SEARCH_FUNCTION(state, { key, searchFunction }) {
        state.searchFunctions[key] = searchFunction;
    },
};

const actions = {
    setSearchTerm({ commit, dispatch, state }, { key, term }) {
        commit('SET_SEARCH_TERM', { key, term });
        if (term.length >= 3) {
            dispatch('performSearch', { key, term, searchFunction: state.searchFunctions[key] });
        } else {
            commit('SET_SEARCH_RESULTS', { key, results: [] });
        }
    },
    async performSearch({ commit }, { key, term, searchFunction }) {
        commit('loading/SET_LOADING', true, { root: true });
        commit('SET_SEARCH_TERM', { key, term });
        try {
            const results = await searchFunction(term);
            commit('SET_SEARCH_RESULTS', { key, results });
        } catch (error) {
            commit('error/SET_ERROR', { title: 'Search failed!', error }, { root: true });
        } finally {
            commit('loading/SET_LOADING', false, { root: true });
        }
    },
    registerSearchFunction({ commit }, { key, searchFunction }) {
        commit('REGISTER_SEARCH_FUNCTION', { key, searchFunction });
    },
};

const getters = {
    getSearchTerm: state => key => state.searches[key]?.term || '',
    getSearchResults: state => key => state.searches[key]?.results || [],
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
