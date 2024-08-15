const getters = {
    canDiscard(state, getters, rootState, rootGetters) {
        return rootGetters['sessionState/permissions/core/canAct'] &&
            rootGetters['sessionState/derived/draw/hasDrawActionInCurrentTurn'] &&
            !rootGetters['sessionState/selections/selectedMeldId'] &&
            rootGetters['sessionState/derived/selected/hasOneHandCardSelected'];
    },
};

export default {
    namespaced: true,
    getters,
};
