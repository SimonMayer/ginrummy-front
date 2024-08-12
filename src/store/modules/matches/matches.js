import matchesService from '@/services/matchesService';

const FETCH_MATCH_TIMEOUT = 60 * 60 * 1000;

const state = {
    matches: {},
};

const mutations = {
    SET_MATCH(state, { matchId, match }) {
        state.matches = {
            ...state.matches,
            [matchId]: match
        };
    },
};

const actions = {
    async fetchMatch({ dispatch, commit }, { matchId, forceFetch = false }) {
        const key = `match_${matchId}`;
        const shouldFetch = await dispatch('trackers/fetch/shouldFetch', { key, timeout: FETCH_MATCH_TIMEOUT, forceFetch }, { root: true });

        if (!shouldFetch) {
            return;
        }

        dispatch('trackers/loading/setLoading', true, { root: true });
        dispatch('trackers/fetch/recordAttempt', key, { root: true });
        try {
            const match = await matchesService.getMatchDetails(matchId);
            commit('SET_MATCH', { matchId, match });
            await dispatch('registry/matchRound/setCurrentRoundId', { matchId: matchId, roundId: match.current_round_id }, { root: true });
            await dispatch('registry/matchRound/setLatestRoundId', { matchId: matchId, roundId: match.latest_round_id }, { root: true });
            await dispatch('registry/matchRound/setAllRoundIds', { matchId: matchId, roundId: match.all_round_ids }, { root: true });
            dispatch('trackers/fetch/recordSuccess', key, { root: true });
        } catch (error) {
            dispatch('error/setError', { title: 'Failed to fetch match details!', error }, { root: true });
            dispatch('trackers/fetch/recordFail', key, { root: true });
        } finally {
            dispatch('trackers/loading/setLoading', false, { root: true });
        }
    },
};

const getters = {
    getMatchById: (state) => (matchId) => state.matches[matchId],
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
