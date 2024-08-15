const getters = {
    currentDiscardPileCardIds(state, getters, rootState, rootGetters) {
        const currentRoundId = rootGetters['sessionState/derived/rounds/currentRoundId'];
        return rootGetters['storage/rounds/discardPiles/getDiscardPileCardIdsByRoundId'](currentRoundId) || [];
    },
    currentDiscardPileCards(state, getters, rootState, rootGetters) {
        return getters.currentDiscardPileCardIds.map(cardId => rootGetters['storage/cards/cards/getCardById'](cardId));
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
        return rootGetters['storage/cards/cards/getCardById'](topCardId);
    },
    selectableDiscardPileCards(state, getters, rootState, rootGetters) {
        return rootGetters['sessionState/permissions/draw/canDrawMultiple']
            ? getters.currentDiscardPileCards
            : rootGetters['sessionState/permissions/draw/canDrawOne']
                ? [getters.currentTopDiscardPileCard]
                : [];
    },
    visibleDiscardPileCardIds(state, getters, rootState, rootGetters) {
        const visibleRoundId = rootGetters['sessionState/derived/rounds/visibleRoundId'];
        return rootGetters['storage/rounds/discardPiles/getDiscardPileCardIdsByRoundId'](visibleRoundId) || [];
    },
    visibleDiscardPileCards(state, getters, rootState, rootGetters) {
        return getters.visibleDiscardPileCardIds.map(cardId => rootGetters['storage/cards/cards/getCardById'](cardId));
    },
};

export default {
    namespaced: true,
    getters,
};
