import matchesService from '@/services/matchesService';

const FETCH_MATCH_LIST_TIMEOUT = 60 * 60 * 1000;

const state = {
    matchList: [],
};

const mutations = {
    SET_MATCH_LIST(state, matchList) {
        state.matchList = matchList;
    },
};

const actions = {
    async fetchMatchList({ dispatch, commit }, { forceFetch = false }) {
        const key = 'matchList';
        const shouldFetch = await dispatch('trackers/fetch/shouldFetch', { key, timeout: FETCH_MATCH_LIST_TIMEOUT, forceFetch }, { root: true });

        if (!shouldFetch) {
            return;
        }

        dispatch('trackers/loading/setLoading', true, { root: true });
        dispatch('trackers/fetch/recordAttempt', key, { root: true });
        try {
            const matchList = await matchesService.getMatchList();
            commit('SET_MATCH_LIST', matchList);
            dispatch('trackers/fetch/recordSuccess', key, { root: true });
        } catch (error) {
            dispatch('error/setError', { title: 'Failed to fetch match list!', error }, { root: true });
            dispatch('trackers/fetch/recordFail', key, { root: true });
        } finally {
            dispatch('trackers/loading/setLoading', false, { root: true });
        }
    },
};

const getters = {
    matchList: state => state.matchList,
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
