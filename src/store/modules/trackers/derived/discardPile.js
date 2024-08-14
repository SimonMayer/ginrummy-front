const getters = {
    currentDiscardPileCardIds(state, getters, rootState, rootGetters) {
        const currentRoundId = rootGetters['trackers/derived/rounds/currentRoundId'];
        return rootGetters['rounds/discardPiles/getDiscardPileCardIdsByRoundId'](currentRoundId) || [];
    },
    currentTopDiscardPileCardId(state, getters) {
        const discardPileCardIds = getters.currentDiscardPileCardIds;
        if (discardPileCardIds.length === 0) {
            return null;
        }
        return discardPileCardIds[discardPileCardIds.length - 1];
    },
    currentTopDiscardPileCard(state, getters, rootState, rootGetters) {
        const topCardId = getters.currentTopDiscardPileCardId;
        if (!topCardId) {
            return null;
        }
        return rootGetters['cards/cards/getCardById'](topCardId);
    },
};

export default {
    namespaced: true,
    getters,
};
