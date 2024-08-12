import matchesService from '@/services/matchesService';

const FETCH_PLAYERS_MATCH_DATA_TIMEOUT = 24 * 60 * 60 * 1000;

const state = {
    playersMatchData: {},
};

const mutations = {
    SET_PLAYERS_MATCH_DATA(state, { matchId, players }) {
        state.playersMatchData = {
            ...state.playersMatchData,
            [matchId]: players,
        };
    },
};

const actions = {
    async fetchPlayersMatchData({ dispatch, commit }, { matchId, forceFetch = false }) {
        await dispatch(
            'fetchHandler/handleFetch',
            {
                errorTitle: 'Failed to fetch match players!',
                forceFetch,
                key: `playersMatchData_${matchId}`,
                fetchFunction: () => matchesService.getPlayers(matchId),
                onSuccess: async (playersData) => {
                    commit('SET_PLAYERS_MATCH_DATA', { matchId, players: playersData });
                },
                timeout: FETCH_PLAYERS_MATCH_DATA_TIMEOUT,
            },
            { root: true }
        );
    },
};

const getters = {
    getPlayersMatchDataByMatchId: state => matchId => state.playersMatchData[matchId] || [],
    getPlayerMatchDataByMatchAndPlayerIds: state => ({ matchId, playerId }) => {
        return state.playersMatchData[matchId]?.find(player => player.user_id === playerId);
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
