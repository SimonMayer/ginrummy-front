import roundsService from '@/services/roundsService';

const FETCH_CURRENT_TURN_TIMEOUT = 30 * 1000;

const state = {
    currentTurns: {},
    latestActionIds: {},
};

function createTurn(id, userId, rotationNumber, actions) {
    return {
        id: id,
        actions: actions,
        userId: userId,
        rotationNumber: rotationNumber,
    };
}

const mutations = {
    SET_CURRENT_TURN(state, { matchId, turn }) {
        state.currentTurns = {
            ...state.currentTurns,
            [matchId]: turn,
        };
    },
    CLEAR_CURRENT_TURN(state, matchId) {
        state.currentTurns = {
            ...state.currentTurns,
            [matchId]: createTurn(null, null, null, []),
        };
    },
    APPEND_CURRENT_TURN_ACTION(state, { matchId, action }) {
        state.currentTurns[matchId].actions.push(action);
    },
    SET_LATEST_ACTION_ID(state, { matchId, actionId }) {
        state.latestActionIds = {
            ...state.latestActionIds,
            [matchId]: actionId,
        };
    },
};

const actions = {
    async fetchCurrentTurn({ commit, dispatch, rootGetters }, { matchId, forceFetch = false }) {
        const currentRoundId = rootGetters['matchRoundRegistry/getCurrentRoundIdByMatchId'](matchId);
        if (!currentRoundId) {
            commit('CLEAR_CURRENT_TURN', matchId);
            dispatch('players/updatePlayersCurrentTurn', { matchId, currentTurnUserId: null }, { root: true });
            return;
        }

        const key = `currentTurn_${matchId}`;
        const shouldFetch = await dispatch('fetchStatus/shouldFetch', { key, timeout: FETCH_CURRENT_TURN_TIMEOUT, forceFetch }, { root: true });

        if (!shouldFetch) {
            return;
        }

        dispatch('loading/setLoading', true, { root: true });
        dispatch('fetchStatus/recordFetchAttempt', key, { root: true });
        try {
            const data = await roundsService.getCurrentTurn(currentRoundId);
            const turn = createTurn(data.turn_id, data.user_id, data.rotation_number, data.actions || []);
            commit('SET_CURRENT_TURN', { matchId, turn });
            dispatch('players/updatePlayersCurrentTurn', { matchId, currentTurnUserId: turn.userId }, { root: true });
            commit('SET_LATEST_ACTION_ID', { matchId, actionId: data.latest_action_id });
            dispatch('fetchStatus/recordSuccessfulFetch', key, { root: true });
        } catch (error) {
            dispatch('error/setError', { title: 'Failed to fetch current turn!', error }, { root: true });
            dispatch('fetchStatus/recordFailedFetch', key, { root: true });
        } finally {
            dispatch('loading/setLoading', false, { root: true });
        }
    },
    appendCurrentTurnAction({ commit }, { matchId, action }) {
        commit('APPEND_CURRENT_TURN_ACTION', { matchId, action });
    },
    setLatestActionId({ commit }, { matchId, actionId }) {
        commit('SET_LATEST_ACTION_ID', { matchId, actionId });
    },
};

const getters = {
    getCurrentTurnByMatchId: state => matchId => state.currentTurns[matchId] || {},
    getLatestActionIdByMatchId: state => matchId => state.latestActionIds[matchId],
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
