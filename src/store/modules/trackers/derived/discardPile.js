const getters = {
    currentDiscardPileCardIds(state, getters, rootState, rootGetters) {
        const currentRoundId = rootGetters['trackers/derived/rounds/currentRoundId'];
        return rootGetters['rounds/discardPiles/getDiscardPileCardIdsByRoundId'](currentRoundId) || [];
    },
    currentDiscardPileCards(state, getters, rootState, rootGetters) {
        return getters.currentDiscardPileCardIds.map(cardId => rootGetters['cards/cards/getCardById'](cardId));
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
    selectableDiscardPileCards(state, getters, rootState, rootGetters) {
        return rootGetters['trackers/permissions/draw/canDrawMultiple']
            ? getters.currentDiscardPileCards
            : rootGetters['trackers/permissions/draw/canDrawOneFromDiscardPile']
                ? [getters.currentTopDiscardPileCard]
                : [];
    },
    visibleDiscardPileCardIds(state, getters, rootState, rootGetters) {
        const visibleRoundId = rootGetters['trackers/derived/rounds/visibleRoundId'];
        return rootGetters['rounds/discardPiles/getDiscardPileCardIdsByRoundId'](visibleRoundId) || [];
    },
    visibleDiscardPileCards(state, getters, rootState, rootGetters) {
        return getters.visibleDiscardPileCardIds.map(cardId => rootGetters['cards/cards/getCardById'](cardId));
    },
};

export default {
    namespaced: true,
    getters,
};
