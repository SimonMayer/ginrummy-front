import roundsService from '@/services/roundsService';

const FETCH_CURRENT_TURN_TIMEOUT = 30 * 1000;

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
    async fetchCurrentTurn({ commit, dispatch, rootGetters }, { forceFetch = false }) {
        const currentRoundId = rootGetters['currentRound/currentRoundId'];
        if (!currentRoundId) {
            commit('CLEAR_CURRENT_TURN');
            dispatch('players/updatePlayersCurrentTurn', null, { root: true });
            return;
        }

        const key = 'currentTurn';
        const shouldFetch = await dispatch('fetchStatus/shouldFetch', { key, timeout: FETCH_CURRENT_TURN_TIMEOUT, forceFetch }, { root: true });

        if (!shouldFetch) {
            return;
        }

        dispatch('loading/setLoading', true, { root: true });
        dispatch('fetchStatus/recordFetchAttempt', key, { root: true });
        try {
            const data = await roundsService.getCurrentTurn(currentRoundId);
            const turn = {
                actions: data.actions || [],
                userId: data.user_id,
                id: data.turn_id,
                rotationNumber: data.rotation_number,
            };
            commit('SET_CURRENT_TURN', turn);
            dispatch('players/updatePlayersCurrentTurn', turn.userId, { root: true });
            commit('SET_LATEST_ACTION_ID', data.latest_action_id);
            dispatch('fetchStatus/recordSuccessfulFetch', key, { root: true });
        } catch (error) {
            dispatch('error/setError', { title: 'Failed to fetch current turn!', error }, { root: true });
            dispatch('fetchStatus/recordFailedFetch', key, { root: true });
        } finally {
            dispatch('loading/setLoading', false, { root: true });
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
