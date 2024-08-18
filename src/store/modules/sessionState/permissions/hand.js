const getters = {
    canSelectHandCards(state, getters, rootState, rootGetters) {
        return rootGetters['sessionState/permissions/draw/canDrawMultiple'] ||
            (
                rootGetters['sessionState/permissions/core/canAct'] &&
                rootGetters['sessionState/derived/turn/hasDrawActionInCurrentTurn']
            );
    },
};

export default {
    namespaced: true,
    getters,
};
