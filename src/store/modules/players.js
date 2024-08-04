import matchesService from '@/services/matchesService';

const FETCH_PLAYERS_TIMEOUT = 24 * 60 * 60 * 1000;

const state = {
    players: [],
};

const mutations = {
    SET_PLAYERS(state, players) {
        state.players = players;
    },
    UPDATE_PLAYERS_CURRENT_TURN(state, currentTurnUserId) {
        state.players = state.players.map(player => ({
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
            commit('SET_PLAYERS', playersData);
            dispatch('fetchStatus/recordSuccessfulFetch', key, { root: true });
        } catch (error) {
            dispatch('error/setError', { title: 'Failed to fetch match players!', error }, { root: true });
            dispatch('fetchStatus/recordFailedFetch', key, { root: true });
        } finally {
            dispatch('loading/setLoading', false, { root: true });
        }
    },
};

const getters = {
    players: state => state.players,
    selfPlayer: state => {
        const userId = parseInt(localStorage.getItem('user_id'), 10);
        return state.players.find(player => player.user_id === userId);
    },
    nonSelfPlayers: state => {
        const userId = parseInt(localStorage.getItem('user_id'), 10);
        return state.players.filter(player => player.user_id !== userId);
    },
    getPlayerById: state => id => state.players.find(player => player.user_id === id),
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
