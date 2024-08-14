const getters = {
    canDraw(state, getters, rootState, rootGetters) {
        if (!rootGetters['trackers/permissions/core/canAct']) {
            return false;
        }
        return !rootGetters['trackers/derived/draw/hasDrawActionInCurrentTurn'];
    },
    canDrawOne(state, getters, rootState, rootGetters) {
        return getters.canDraw &&
            rootGetters['trackers/derived/selected/hasNoHandCardsSelected'] &&
            !rootGetters['trackers/selections/selectedMeldId'];
    },
    canDrawFromStockPile(state, getters, rootState, rootGetters) {
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
