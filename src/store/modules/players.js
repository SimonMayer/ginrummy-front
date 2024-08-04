import matchesService from '@/services/matchesService';

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
    async fetchPlayers({ commit }, matchId) {
        commit('loading/SET_LOADING', true, { root: true });
        try {
            const playersData = await matchesService.getPlayers(matchId);
            commit('SET_PLAYERS', playersData);
        } catch (error) {
            commit('error/SET_ERROR', { title: 'Failed to fetch match players!', error }, { root: true });
        } finally {
            commit('loading/SET_LOADING', false, { root: true });
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
