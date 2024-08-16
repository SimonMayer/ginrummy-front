const state = {
    lastFetchedTimestamps: {},
    isFetchingFlags: {},
};

const mutations = {
    RECORD_FETCH_ATTEMPT(state, key) {
        state.isFetchingFlags[key] = true;
    },
    RECORD_SUCCESSFUL_FETCH(state, key) {
        state.lastFetchedTimestamps[key] = Date.now();
        state.isFetchingFlags[key] = false;
    },
    RECORD_FAILED_FETCH(state, key) {
        state.isFetchingFlags[key] = false;
    },
};

const actions = {
    recordAttempt({commit}, key) {
        commit('RECORD_FETCH_ATTEMPT', key);
    },
    recordSuccess({commit}, key) {
        commit('RECORD_SUCCESSFUL_FETCH', key);
    },
    recordFail({commit}, key) {
        commit('RECORD_FAILED_FETCH', key);
    },
    shouldFetch({state}, {key, timeout, forceFetch}) {
        const isFetchingFlags = state.isFetchingFlags[key];
        const lastFetchedTimestamp = state.lastFetchedTimestamps[key];

        if (forceFetch) {
            return true;
        } else if (isFetchingFlags || (lastFetchedTimestamp && (Date.now() - lastFetchedTimestamp < timeout))) {
            return false;
        }
        return true;
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
};
