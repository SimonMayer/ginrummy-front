const getters = {
    canDiscard(state, getters, rootState, rootGetters) {
        return rootGetters['sessionState/permissions/core/canAct'] &&
            rootGetters['sessionState/derived/turn/hasDrawActionInCurrentTurn'] &&
            !rootGetters['sessionState/selections/selectedMeldId'] &&
            rootGetters['sessionState/derived/selectedItems/hasOneHandCardSelected'];
    },
};

export default {
    namespaced: true,
    getters,
};
