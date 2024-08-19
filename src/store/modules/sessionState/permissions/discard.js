const getters = {
    canDiscard(state, getters, rootState, rootGetters) {
        return rootGetters['sessionState/permissions/core/canAct'] &&
            rootGetters['sessionState/derived/turn/hasDrawActionInCurrentTurn'] &&
            !rootGetters['sessionState/uiOperations/selections/selectedMeldId'];
    },
    canDiscardByDragging(state, getters, rootState, rootGetters) {
        return getters.canDiscard && rootGetters['sessionState/derived/selectedItems/selectedHandCardCount'] <= 1;
    },
    canDiscardSelected(state, getters, rootState, rootGetters) {
        return getters.canDiscard && rootGetters['sessionState/derived/selectedItems/hasOneHandCardSelected'];
    },
    canOnlyDiscard(state, getters, rootState, rootGetters) {
        return getters.canDiscard && rootGetters['sessionState/derived/hand/currentHandCardLength'] === 1;
    },
};

export default {
    namespaced: true,
    getters,
};
