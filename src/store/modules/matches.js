import matchesService from '@/services/matchesService';

const FETCH_MATCH_LIST_TIMEOUT = 60 * 60 * 1000;
const FETCH_MATCH_TIMEOUT = 60 * 60 * 1000;

const state = {
    matchList: [],
    match: null,
};

const mutations = {
    SET_MATCH_LIST(state, matchList) {
        state.matchList = matchList;
    },
    SET_MATCH(state, match) {
        state.match = match;
    },
};

const actions = {
    async fetchMatchList({ dispatch, commit }, { forceFetch = false }) {
        const key = 'matchList';
        const shouldFetch = await dispatch('fetchStatus/shouldFetch', { key, timeout: FETCH_MATCH_LIST_TIMEOUT, forceFetch }, { root: true });

        if (!shouldFetch) {
            return;
        }

        dispatch('loading/setLoading', true, { root: true });
        dispatch('fetchStatus/recordFetchAttempt', key, { root: true });
        try {
            const matchList = await matchesService.getMatchList();
            commit('SET_MATCH_LIST', matchList);
            dispatch('fetchStatus/recordSuccessfulFetch', key, { root: true });
        } catch (error) {
            dispatch('error/setError', { title: 'Failed to fetch match list!', error }, { root: true });
            dispatch('fetchStatus/recordFailedFetch', key, { root: true });
        } finally {
            dispatch('loading/setLoading', false, { root: true });
        }
    },
    async fetchMatch({ dispatch, commit }, { matchId, forceFetch = false }) {
        const key = `match_${matchId}`;
        const shouldFetch = await dispatch('fetchStatus/shouldFetch', { key, timeout: FETCH_MATCH_TIMEOUT, forceFetch }, { root: true });

        if (!shouldFetch) {
            return;
        }

        dispatch('loading/setLoading', true, { root: true });
        dispatch('fetchStatus/recordFetchAttempt', key, { root: true });
        try {
            const match = await matchesService.getMatchDetails(matchId);
            commit('SET_MATCH', match);
            dispatch('currentRound/setCurrentRoundId', match.current_round_id, { root: true });
            dispatch('fetchStatus/recordSuccessfulFetch', key, { root: true });
        } catch (error) {
            dispatch('error/setError', { title: 'Failed to fetch match details!', error }, { root: true });
            dispatch('fetchStatus/recordFailedFetch', key, { root: true });
        } finally {
            dispatch('loading/setLoading', false, { root: true });
        }
    },
};

const getters = {
    matchList: state => state.matchList,
    match: state => state.match,
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
