import matchesService from '@/services/matchesService';
import roundsService from '@/services/roundsService';

const FETCH_PLAYERS_MATCH_DATA_TIMEOUT = 24 * 60 * 60 * 1000;
const FETCH_PLAYERS_ROUND_DATA_TIMEOUT = 5 * 60 * 1000;

const state = {
    playersMatchData: {},
    playersRoundData: {},
};

const mutations = {
    SET_PLAYERS_MATCH_DATA(state, { matchId, players }) {
        state.playersMatchData = {
            ...state.playersMatchData,
            [matchId]: players,
        };
    },
    SET_PLAYERS_ROUND_DATA(state, { roundId, players }) {
        state.playersRoundData = {
            ...state.playersRoundData,
            [roundId]: players,
        };
    },
    UPDATE_PLAYERS_CURRENT_TURN(state, { matchId, currentTurnUserId }) {
        if(!state.playersMatchData[matchId]) {
            return;
        }
        state.playersMatchData[matchId] = state.playersMatchData[matchId].map(player => ({
            ...player,
            hasCurrentTurn: player.user_id === currentTurnUserId,
        }));
    },
};

const actions = {
    async fetchPlayersMatchData({ dispatch, commit }, { matchId, forceFetch = false }) {
        const key = `playersMatchData_${matchId}`;
        const shouldFetch = await dispatch('fetchStatus/shouldFetch', { key, timeout: FETCH_PLAYERS_MATCH_DATA_TIMEOUT, forceFetch }, { root: true });

        if (!shouldFetch) {
            return;
        }

        dispatch('loading/setLoading', true, { root: true });
        dispatch('fetchStatus/recordFetchAttempt', key, { root: true });
        try {
            const playersData = await matchesService.getPlayers(matchId);
            commit('SET_PLAYERS_MATCH_DATA', { matchId, players: playersData });
            dispatch('fetchStatus/recordSuccessfulFetch', key, { root: true });
        } catch (error) {
            dispatch('error/setError', { title: 'Failed to fetch match players!', error }, { root: true });
            dispatch('fetchStatus/recordFailedFetch', key, { root: true });
        } finally {
            dispatch('loading/setLoading', false, { root: true });
        }
    },
    async fetchPlayersRoundData({ dispatch, commit }, { roundId, forceFetch = false }) {
        if(!roundId) {
            return;
        }
        const key = `playersRoundData_${roundId}`;
        const shouldFetch = await dispatch('fetchStatus/shouldFetch', { key, timeout: FETCH_PLAYERS_ROUND_DATA_TIMEOUT, forceFetch }, { root: true });

        if (!shouldFetch) {
            return;
        }

        dispatch('loading/setLoading', true, { root: true });
        dispatch('fetchStatus/recordFetchAttempt', key, { root: true });
        try {
            const playersData = await roundsService.getPlayers(roundId);
            commit('SET_PLAYERS_ROUND_DATA', { roundId, players: playersData });
            dispatch('fetchStatus/recordSuccessfulFetch', key, { root: true });
        } catch (error) {
            dispatch('error/setError', { title: 'Failed to fetch round players!', error }, { root: true });
            dispatch('fetchStatus/recordFailedFetch', key, { root: true });
        } finally {
            dispatch('loading/setLoading', false, { root: true });
        }
    },
    updatePlayersCurrentTurn({ commit }, { matchId, currentTurnUserId }) {
        commit('UPDATE_PLAYERS_CURRENT_TURN', { matchId, currentTurnUserId });
    },
};

const getters = {
    getPlayersMatchDataByMatchId: state => matchId => state.playersMatchData[matchId] || [],
    getSelfPlayerMatchDataByMatchId: (state, getters) => matchId => {
        const userId = parseInt(localStorage.getItem('user_id'), 10);
        return getters.getPlayersMatchDataByMatchId(matchId).find(player => player.user_id === userId);
    },
    getNonSelfPlayersMatchDataByMatchId: (state, getters) => matchId => {
        const userId = parseInt(localStorage.getItem('user_id'), 10);
        return getters.getPlayersMatchDataByMatchId(matchId).filter(player => player.user_id !== userId);
    },
    getPlayerMatchDataByMatchAndPlayerIds: state => ({ matchId, playerId }) => {
        return state.playersMatchData[matchId]?.find(player => player.user_id === playerId);
    },
    getPlayerRoundDataByRoundAndPlayerIds: state => ({ roundId, playerId }) => {
        return state.playersRoundData[roundId]?.find(player => player.user_id === playerId);
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
