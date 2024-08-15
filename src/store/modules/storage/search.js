const state = {
    searches: {},
    searchFunctions: {},
};

const mutations = {
    SET_SEARCH_TERM(state, {key, term}) {
        if (!state.searches[key]) {
            state.searches[key] = {};
        }
        state.searches[key].term = term;
    },
    SET_SEARCH_RESULTS(state, {key, results}) {
        if (!state.searches[key]) {
            state.searches[key] = {};
        }
        state.searches[key].results = results;
    },
    REGISTER_SEARCH_FUNCTION(state, {key, searchFunction}) {
        state.searchFunctions[key] = searchFunction;
    },
};

const actions = {
    async setSearchTerm({commit, dispatch, state}, {key, term}) {
        commit('SET_SEARCH_TERM', {key, term});
        if (term.length >= 3) {
            await dispatch('performSearch', {key, term, searchFunction: state.searchFunctions[key]});
        } else {
            commit('SET_SEARCH_RESULTS', {key, results: []});
        }
    },
    async performSearch({commit, dispatch}, {key, term, searchFunction}) {
        dispatch('sessionState/loading/setLoading', true, {root: true});
        commit('SET_SEARCH_TERM', {key, term});
        try {
            const results = await searchFunction(term);
            commit('SET_SEARCH_RESULTS', {key, results});
        } catch (error) {
            dispatch('sessionState/error/setError', {title: 'Search failed!', error}, {root: true});
        } finally {
            dispatch('sessionState/loading/setLoading', false, {root: true});
        }
    },
    registerSearchFunction({commit}, {key, searchFunction}) {
        commit('REGISTER_SEARCH_FUNCTION', {key, searchFunction});
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
