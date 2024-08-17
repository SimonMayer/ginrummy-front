const state = {
    searches: {},
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
};

const actions = {
    async setSearchTerm({commit, dispatch, rootGetters}, {key, term}) {
        commit('SET_SEARCH_TERM', {key, term});
        if (term.length >= 3) {
            const searchFunction = rootGetters['storage/search/searchFunctions/getSearchFunction'](key);
            await dispatch('performSearch', {key, term, searchFunction});
        } else {
            commit('SET_SEARCH_RESULTS', {key, results: []});
        }
    },
    async performSearch({commit, dispatch}, {key, term, searchFunction}) {
        dispatch('sessionState/indicators/loading/recordLoadingStart', key, {root: true});
        commit('SET_SEARCH_TERM', {key, term});
        try {
            const response = await searchFunction(term);
            const searchResults = response.result || [];
            commit('SET_SEARCH_RESULTS', {key, results: searchResults});
        } catch (error) {
            dispatch('sessionState/indicators/errorLog/addLogEntry', {title: 'Search failed!', error}, {root: true});
        } finally {
            dispatch('sessionState/indicators/loading/recordLoadingEnd', key, {root: true});
        }
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
