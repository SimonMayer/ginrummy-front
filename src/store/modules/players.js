import matchesService from '@/services/matchesService';

const FETCH_PLAYERS_TIMEOUT = 24 * 60 * 60 * 1000;

const state = {
    players: {},
};

const mutations = {
    SET_PLAYERS(state, { matchId, players }) {
        state.players = {
            ...state.players,
            [matchId]: players,
        };
    },
    UPDATE_PLAYERS_CURRENT_TURN(state, { matchId, currentTurnUserId }) {
        state.players[matchId] = state.players[matchId].map(player => ({
            ...player,
            hasCurrentTurn: player.user_id === currentTurnUserId,
        }));
    },
};

const actions = {
    async fetchPlayers({ dispatch, commit }, { matchId, forceFetch = false }) {
        const key = `players_${matchId}`;
        const shouldFetch = await dispatch('fetchStatus/shouldFetch', { key, timeout: FETCH_PLAYERS_TIMEOUT, forceFetch }, { root: true });

        if (!shouldFetch) {
            return;
        }

        dispatch('loading/setLoading', true, { root: true });
        dispatch('fetchStatus/recordFetchAttempt', key, { root: true });
        try {
            const playersData = await matchesService.getPlayers(matchId);
            commit('SET_PLAYERS', { matchId, players: playersData });
            dispatch('fetchStatus/recordSuccessfulFetch', key, { root: true });
        } catch (error) {
            dispatch('error/setError', { title: 'Failed to fetch match players!', error }, { root: true });
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
    getPlayersByMatchId: state => matchId => state.players[matchId] || [],
    getSelfPlayerByMatchId: (state, getters) => matchId => {
        const userId = parseInt(localStorage.getItem('user_id'), 10);
        return getters.getPlayersByMatchId(matchId).find(player => player.user_id === userId);
    },
    getNonSelfPlayersByMatchId: (state, getters) => matchId => {
        const userId = parseInt(localStorage.getItem('user_id'), 10);
        return getters.getPlayersByMatchId(matchId).filter(player => player.user_id !== userId);
    },
    getPlayerByMatchAndPlayerIds: state => ({ matchId, playerId }) => {
        return state.players[matchId]?.find(player => player.user_id === playerId);
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
