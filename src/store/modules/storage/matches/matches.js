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
                    const currentRoundId = match.current_round_id;
                    const latestRoundId = match.latest_round_id;
                    const responses = {};
                    responses.fetchPlayersMatchData = await dispatch(
                        'storage/players/matchData/fetchPlayersMatchData',
                        {matchId, forceFetch},
                        {root: true},
                    );
                    responses.setCurrentRoundId = await dispatch(
                        'storage/registry/matchRounds/setCurrentRoundId',
                        {matchId, roundId: currentRoundId},
                        {root: true},
                    );
                    responses.setLatestRoundId = await dispatch(
                        'storage/registry/matchRounds/setLatestRoundId',
                        {matchId, roundId: latestRoundId},
                        {root: true},
                    );
                    if (currentRoundId) {
                        responses.fetchCurrentTurn = await dispatch(
                            'storage/registry/roundTurns/fetchCurrentTurn',
                            {matchId, roundId: currentRoundId},
                            {root: true},
                        );
                    }
                    if (latestRoundId) {
                        responses.fetchPlayersRoundData = await dispatch(
                            'storage/players/roundData/fetchPlayersRoundData',
                            {roundId: latestRoundId},
                            {root: true},
                        );
                    }
                    dispatch(
                        'storage/registry/matchRounds/setAllRoundIds',
                        {matchId, roundIds: match.all_round_ids},
                        {root: true},
                    );
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
