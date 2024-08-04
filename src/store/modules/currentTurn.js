import roundsService from '@/services/roundsService';

const state = {
    currentTurn: {
        actions: [],
        userId: null,
        id: null,
        rotationNumber: null,
    },
    latestActionId: null,
};

const mutations = {
    SET_CURRENT_TURN(state, turn) {
        state.currentTurn = turn;
    },
    CLEAR_CURRENT_TURN(state) {
        state.currentTurn = {
            actions: [],
            userId: null,
            id: null,
            rotationNumber: null,
        };
    },
    APPEND_CURRENT_TURN_ACTION(state, action) {
        state.currentTurn.actions.push(action);
    },
    SET_LATEST_ACTION_ID(state, actionId) {
        state.latestActionId = actionId;
    },
};

const actions = {
    async fetchCurrentTurn({ commit, rootGetters }) {
        const currentRoundId = rootGetters['currentRound/currentRoundId'];
        if (!currentRoundId) {
            commit('CLEAR_CURRENT_TURN');
            commit('players/UPDATE_PLAYERS_CURRENT_TURN', null, { root: true });
            return;
        }

        commit('loading/SET_LOADING', true, { root: true });
        try {
            const data = await roundsService.getCurrentTurn(currentRoundId);
            const turn = {
                actions: data.actions || [],
                userId: data.user_id,
                id: data.turn_id,
                rotationNumber: data.rotation_number,
            };
            commit('SET_CURRENT_TURN', turn);
            commit('players/UPDATE_PLAYERS_CURRENT_TURN', turn.userId, { root: true });
            commit('SET_LATEST_ACTION_ID', data.latest_action_id);
        } catch (error) {
            commit('error/SET_ERROR', { title: 'Failed to fetch current turn!', error }, { root: true });
        } finally {
            commit('loading/SET_LOADING', false, { root: true });
        }
    },
    clearCurrentTurn({ commit }) {
        commit('CLEAR_CURRENT_TURN');
    },
    appendCurrentTurnAction({ commit }, action) {
        commit('APPEND_CURRENT_TURN_ACTION', action);
    },
    setLatestActionId({ commit }, actionId) {
        commit('SET_LATEST_ACTION_ID', actionId);
    },
};

const getters = {
    currentTurn: state => state.currentTurn,
    latestActionId: state => state.latestActionId,
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
