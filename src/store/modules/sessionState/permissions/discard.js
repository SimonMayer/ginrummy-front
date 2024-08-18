const getters = {
    canDiscard(state, getters, rootState, rootGetters) {
        return rootGetters['sessionState/permissions/core/canAct'] &&
            rootGetters['sessionState/derived/turn/hasDrawActionInCurrentTurn'] &&
            !rootGetters['sessionState/selections/selectedMeldId'] &&
            (
                rootGetters['sessionState/derived/selectedItems/hasOneHandCardSelected'] ||
                rootGetters['sessionState/derived/hand/currentHandCardLength'] === 1
            );
    },
};

export default {
    namespaced: true,
    getters,
};
