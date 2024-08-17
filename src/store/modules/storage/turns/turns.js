import turnsService from '@/services/turnsService';

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

const mutations = {
    ADD_TURN(state, turn) {
        state.turns = {...state.turns, [turn.id]: turn};
    },
    APPEND_ACTION_TO_TURN(state, {turnId, action}) {
        state.turns[turnId].actions.push(action);
    },
};

const actions = {
    async fetchTurn({commit, dispatch}, {turnId, forceFetch = false}) {
        return await dispatch(
            'utils/fetchHandler/handleFetch',
            {
                errorTitle: 'Failed to fetch turn!',
                forceFetch,
                key: `turn_${turnId}`,
                fetchFunction: () => turnsService.getTurn(turnId),
                onSuccess: async (data) => {
                    const turn = createTurn(data.turn_id, data.user_id, data.rotation_number, data.actions || []);
                    commit('ADD_TURN', turn);

                    return turn;
                },
                timeout: FETCH_TURN_TIMEOUT,
            },
            {root: true},
        );
    },
    async appendActionToTurn({commit, dispatch, getters}, {turnId, action}) {
        if (!getters.getTurnById(turnId)) {
            return;
        }

        const isAppendableAction = await dispatch(
            'storage/turns/actions/isAppendableAction',
            {turnId, action},
            {root: true},
        );
        if (!isAppendableAction) {
            return;
        }
        commit('APPEND_ACTION_TO_TURN', {turnId, action});
    },
};

const getters = {
    getTurnById: state => turnId => state.turns[turnId] || null,
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
