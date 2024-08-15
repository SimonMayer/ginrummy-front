import roundsService from '@/services/roundsService';

const FETCH_PLAYERS_ROUND_DATA_TIMEOUT = 5 * 60 * 1000;

const state = {
    playersRoundData: {},
};

const mutations = {
    SET_PLAYERS_ROUND_DATA(state, {roundId, players}) {
        state.playersRoundData = {
            ...state.playersRoundData,
            [roundId]: players,
        };
    },
};

const actions = {
    async fetchPlayersRoundData({dispatch, commit, rootGetters}, {roundId, forceFetch = false}) {
        if (!roundId) {
            return;
        }
        return await dispatch(
            'fetchHandler/handleFetch',
            {
                errorTitle: 'Failed to fetch round players!',
                forceFetch,
                key: `playersRoundData_${roundId}`,
                fetchFunction: () => roundsService.getPlayers(roundId),
                onSuccess: async (playersData) => {
                    await commit('SET_PLAYERS_ROUND_DATA', {roundId, players: playersData});
                    const selfPlayerHandId = rootGetters['players/self/getSelfPlayerRoundDataByRoundId'](roundId)?.hand?.hand_id;
                    return await dispatch('hands/fetchHand', {handId: selfPlayerHandId}, {root: true});
                },
                timeout: FETCH_PLAYERS_ROUND_DATA_TIMEOUT,
            },
            {root: true},
        );
    },
};

const getters = {
    getPlayerRoundDataByRoundAndPlayerIds: state => ({roundId, playerId}) => {
        return state.playersRoundData[roundId]?.find(player => player.user_id === playerId);
    },
    isCurrentTurnForPlayer: (state, getters, rootState, rootGetters) => ({roundId, playerId}) => {
        const currentTurnId = rootGetters['registry/roundTurn/getCurrentTurnIdByRoundId'](roundId);
        if (!currentTurnId) {
            return false;
        }

        const turn = rootGetters['turns/turns/getTurnById'](currentTurnId);
        return turn && turn.userId === playerId;
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
