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
        await dispatch(
            'fetchHandler/handleFetch',
            {
                errorTitle: 'Failed to fetch match details!',
                forceFetch,
                key: `match_${matchId}`,
                fetchFunction: () => matchesService.getMatchDetails(matchId),
                onSuccess: async (match) => {
                    commit('SET_MATCH', { matchId, match });
                    await dispatch('registry/matchRound/setCurrentRoundId', { matchId: matchId, roundId: match.current_round_id }, { root: true });
                    await dispatch('registry/matchRound/setLatestRoundId', { matchId: matchId, roundId: match.latest_round_id }, { root: true });
                    await dispatch('registry/matchRound/setAllRoundIds', { matchId: matchId, roundId: match.all_round_ids }, { root: true });
                },
                timeout: FETCH_MATCH_TIMEOUT,
            },
            { root: true }
        );
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
