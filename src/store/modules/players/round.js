import roundsService from '@/services/roundsService';

const FETCH_PLAYERS_ROUND_DATA_TIMEOUT = 5 * 60 * 1000;

const state = {
    playersRoundData: {},
};

const mutations = {
    SET_PLAYERS_ROUND_DATA(state, { roundId, players }) {
        state.playersRoundData = {
            ...state.playersRoundData,
            [roundId]: players,
        };
    },
};

const actions = {
    async fetchPlayersRoundData({ dispatch, commit, rootGetters }, { roundId, forceFetch = false }) {
        if(!roundId) {
            return;
        }
        const key = `playersRoundData_${roundId}`;
        const shouldFetch = await dispatch('trackers/fetch/shouldFetch', { key, timeout: FETCH_PLAYERS_ROUND_DATA_TIMEOUT, forceFetch }, { root: true });

        if (!shouldFetch) {
            return;
        }

        dispatch('trackers/loading/setLoading', true, { root: true });
        dispatch('trackers/fetch/recordAttempt', key, { root: true });
        try {
            const playersData = await roundsService.getPlayers(roundId);
            commit('SET_PLAYERS_ROUND_DATA', { roundId, players: playersData });
            const selfPlayerHandId = rootGetters['players/self/getSelfPlayerRoundDataByRoundId'](roundId)?.hand?.hand_id;
            await dispatch('hands/fetchHand', { handId: selfPlayerHandId }, { root: true });
            dispatch('trackers/fetch/recordSuccess', key, { root: true });
        } catch (error) {
            dispatch('error/setError', { title: 'Failed to fetch round players!', error }, { root: true });
            dispatch('trackers/fetch/recordFail', key, { root: true });
        } finally {
            dispatch('trackers/loading/setLoading', false, { root: true });
        }
    },
};

const getters = {
    getPlayerRoundDataByRoundAndPlayerIds: state => ({ roundId, playerId }) => {
        return state.playersRoundData[roundId]?.find(player => player.user_id === playerId);
    },
    isCurrentTurnForPlayer: (state, getters, rootState, rootGetters) => ({ roundId, playerId }) => {
        const currentTurnId = rootGetters['registry/roundTurn/getCurrentTurnIdByRoundId'](roundId);
        if (!currentTurnId) {
            return false;
        }

        const turn = rootGetters['turns/getTurnById'](currentTurnId);
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
