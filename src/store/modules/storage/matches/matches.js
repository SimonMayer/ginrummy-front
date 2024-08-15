import matchesService from '@/services/matchesService';

const FETCH_MATCH_TIMEOUT = 60 * 60 * 1000;

const state = {
    matches: {},
};

const mutations = {
    SET_MATCH(state, {matchId, match}) {
        state.matches = {
            ...state.matches,
            [matchId]: match,
        };
    },
};

const actions = {
    async fetchMatch({dispatch, commit}, {matchId, forceFetch = false}) {
        return await dispatch(
            'utils/fetchHandler/handleFetch',
            {
                errorTitle: 'Failed to fetch match details!',
                forceFetch,
                key: `match_${matchId}`,
                fetchFunction: () => matchesService.getMatchDetails(matchId),
                onSuccess: async (match) => {
                    commit('SET_MATCH', {matchId, match});
                    const responses = {};
                    responses.fetchPlayersMatchData = await dispatch('storage/players/match/fetchPlayersMatchData', {matchId, forceFetch}, {root: true});
                    responses.setCurrentRoundId = await dispatch('storage/registry/matchRound/setCurrentRoundId', {
                        matchId: matchId,
                        roundId: match.current_round_id,
                    }, {root: true});
                    responses.setLatestRoundId = await dispatch('storage/registry/matchRound/setLatestRoundId', {
                        matchId: matchId,
                        roundId: match.latest_round_id,
                    }, {root: true});
                    dispatch('storage/registry/matchRound/setAllRoundIds', {
                        matchId: matchId,
                        roundId: match.all_round_ids,
                    }, {root: true});

                    return responses;
                },
                timeout: FETCH_MATCH_TIMEOUT,
            },
            {root: true},
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
