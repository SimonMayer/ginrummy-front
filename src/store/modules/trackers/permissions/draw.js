const getters = {
    canDraw(state, getters, rootState, rootGetters) {
        return rootGetters['trackers/permissions/core/canAct'] &&
            !rootGetters['trackers/derived/draw/hasDrawActionInCurrentTurn'];
    },
    canDrawOne(state, getters, rootState, rootGetters) {
        return getters.canDraw &&
            rootGetters['trackers/derived/selected/hasNoHandCardsSelected'] &&
            !rootGetters['trackers/selections/selectedMeldId'];
    },
    canDrawOneFromStockPile(state, getters, rootState, rootGetters) {
        return getters.canDrawOne && rootGetters['trackers/derived/selected/hasNoDiscardPileCardsSelected'];
    },
    canDrawOneFromDiscardPile(state, getters, rootState, rootGetters) {
        return getters.canDrawOne && rootGetters['trackers/derived/selected/isOnlyTopDiscardPileCardSelected'];
    },
};

export default {
    namespaced: true,
    getters,
};
