import turnsService from "@/services/turnsService";

const FETCH_TURN_TIMEOUT = 30 * 1000;

const state = {
    turns: {},
};

function createTurn(id, userId, rotationNumber, actions) {
    return {
        id: id,
        actions: actions,
        userId: userId,
        rotationNumber: rotationNumber,
    };
}

function isValidAction(action) {
    const validActionTypes = ['round_start', 'draw', 'play_meld', 'extend_meld', 'discard', 'round_end'];

    return (
        typeof action.action_id === 'number' &&
        validActionTypes.includes(action.action_type) &&
        typeof action.public_details === 'string'
    );
}

function isDuplicateAction(action, existingActions) {
    return existingActions.some(existingAction => existingAction.action_id === action.action_id);
}

const mutations = {
    ADD_TURN(state, turn) {
        state.turns = { ...state.turns, [turn.id]: turn };
    },
    APPEND_ACTION_TO_TURN(state, { turnId, action }) {
        if (!state.turns[turnId] || isDuplicateAction(action, state.turns[turnId].actions) || !isValidAction(action)) {
            return;
        }
        state.turns[turnId].actions.push(action);
    },
};

const actions = {
    async fetchTurn({ commit, dispatch }, { turnId, forceFetch = false }) {
        const key = `turn_${turnId}`;
        const shouldFetch = await dispatch('trackers/fetch/shouldFetch', { key, timeout: FETCH_TURN_TIMEOUT, forceFetch }, { root: true });

        if (!shouldFetch) {
            return;
        }

        dispatch('trackers/loading/setLoading', true, { root: true });
        dispatch('trackers/fetch/recordAttempt', key, { root: true });
        try {
            const data = await turnsService.getTurn(turnId);
            const turn = createTurn(data.turn_id, data.user_id, data.rotation_number, data.actions || []);
            commit('ADD_TURN', turn);
            dispatch('trackers/fetch/recordSuccess', key, { root: true });
        } catch (error) {
            dispatch('error/setError', { title: 'Failed to fetch turn!', error }, { root: true });
            dispatch('trackers/fetch/recordFail', key, { root: true });
        } finally {
            dispatch('trackers/loading/setLoading', false, { root: true });
        }
    },
    appendActionToTurn({ commit }, { turnId, action }) {
        commit('APPEND_ACTION_TO_TURN', { turnId, action });
    },
};

const getters = {
    getTurnById: state => turnId => state.turns[turnId] || {},
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
