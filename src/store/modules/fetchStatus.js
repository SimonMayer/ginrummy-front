const state = {
    lastFetched: {},
    isFetching: {},
};

const mutations = {
    RECORD_FETCH_ATTEMPT(state, key) {
        state.isFetching[key] = true;
    },
    RECORD_SUCCESSFUL_FETCH(state, key) {
        state.lastFetched[key] = Date.now();
        state.isFetching[key] = false;
    },
    RECORD_FAILED_FETCH(state, key) {
        state.isFetching[key] = false;
    }
};

const actions = {
    recordFetchAttempt({ commit }, key) {
        commit('RECORD_FETCH_ATTEMPT', key);
    },
    recordSuccessfulFetch({ commit }, key) {
        commit('RECORD_SUCCESSFUL_FETCH', key);
    },
    recordFailedFetch({ commit }, key) {
        commit('RECORD_FAILED_FETCH', key);
    },
    shouldFetch({ state }, { key, timeout, forceFetch }) {
        const isFetching = state.isFetching[key];
        const lastFetched = state.lastFetched[key];

        if (forceFetch) {
            return true;
        } else if (isFetching || (lastFetched && (Date.now() - lastFetched < timeout))) {
            return false;
        }
        return true;
    }
};

const getters = {
    getLastFetched: (state) => (key) => state.lastFetched[key],
    getFetchingStatus: (state) => (key) => state.isFetching[key],
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
