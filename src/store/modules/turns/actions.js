function isValidAction(action) {
    const validActionTypes = ['round_start', 'draw', 'play_meld', 'extend_meld', 'discard', 'round_end'];

    return (
        typeof action.action_id === 'number' &&
        validActionTypes.includes(action.action_type) &&
        typeof action.public_details === 'string'
    );
}

const actions = {
    async isDuplicateAction({getters}, {turnId, action}) {
        const existingActions = getters.getActionsByTurnId(turnId);
        return existingActions.some(existingAction => existingAction.action_id === action.action_id);
    },
    async isAppendableAction({dispatch}, {turnId, action}) {
        const isDuplicate = await dispatch('isDuplicateAction', {turnId, action});
        return isValidAction(action) && !isDuplicate;
    },
};

const getters = {
    getActionsByTurnId: (state, getters, rootState, rootGetters) => (turnId) => {
        const turn = rootGetters['turns/turns/getTurnById'](turnId);
        return turn.actions;
    },
};

export default {
    namespaced: true,
    actions,
    getters,
};
