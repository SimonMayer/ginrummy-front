import matchesService from '@/services/matchesService';

const FETCH_MATCHES_TIMEOUT = 60 * 60 * 1000;
const FETCH_MATCH_TIMEOUT = 60 * 60 * 1000;

const state = {
    matches: [],
    match: null,
};

const mutations = {
    SET_MATCHES(state, matches) {
        state.matches = matches;
    },
    SET_MATCH(state, match) {
        state.match = match;
    },
};

const actions = {
    async fetchMatches({ dispatch, commit }, forceFetch = false) {
        const key = 'matches';
        const shouldFetch = await dispatch('fetchStatus/shouldFetch', { key, timeout: FETCH_MATCHES_TIMEOUT, forceFetch }, { root: true });

        if (!shouldFetch) {
            return;
        }

        dispatch('loading/setLoading', true, { root: true });
        dispatch('fetchStatus/recordFetchAttempt', key, { root: true });
        try {
            const matchesData = await matchesService.getMatches();
            commit('SET_MATCHES', matchesData);
            dispatch('fetchStatus/recordSuccessfulFetch', key, { root: true });
        } catch (error) {
            dispatch('error/setError', { title: 'Failed to fetch matches!', error }, { root: true });
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
            dispatch('currentRound/setRoundId', match.current_round_id, { root: true });
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
    matches: state => state.matches,
    match: state => state.match,
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
