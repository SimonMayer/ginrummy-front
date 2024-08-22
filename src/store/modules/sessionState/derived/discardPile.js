const getters = {
    currentDiscardPileCardIds(state, getters, rootState, rootGetters) {
        const currentRoundId = rootGetters['sessionState/derived/rounds/currentRoundId'];
        return rootGetters['storage/rounds/discardPiles/getDiscardPileCardIdsByRoundId'](currentRoundId) || [];
    },
    currentDiscardPileCardCount(state, getters) {
        return getters.currentDiscardPileCardIds.length;
    },
    currentDiscardPileCards(state, getters, rootState, rootGetters) {
        return getters.currentDiscardPileCardIds.map(cardId => rootGetters['storage/cards/cards/getCardById'](cardId));
    },
    getIndexOfCardInCurrentDiscardPile: (state, getters, rootState, rootGetters) => (searchedCardId) => {
        return rootGetters['sessionState/derived/discardPile/currentDiscardPileCardIds']
            .findIndex(cardId => cardId === searchedCardId);
    },
    getCountOfCurrentDiscardPileCardsFromCardAndHigher: (state, getters, rootState, rootGetters) => (lowestCardId) => {
        const lowestCardIndex = getters.getIndexOfCardInCurrentDiscardPile(lowestCardId);
        return lowestCardIndex !== -1
            ? rootGetters['sessionState/derived/discardPile/currentDiscardPileCardCount'] - lowestCardIndex
            : 0;
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
        return rootGetters['sessionState/permissions/draw/canDrawMultipleAsNextMove']
            ? getters.currentDiscardPileCards
            : rootGetters['sessionState/permissions/draw/canDrawOneAsNextMove']
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
    visibleTopDiscardPileCardId(state, getters) {
        const discardPileCardIds = getters.visibleDiscardPileCardIds;
        if (discardPileCardIds.length === 0) {
            return null;
        }
        return discardPileCardIds[discardPileCardIds.length - 1];
    },
};

export default {
    namespaced: true,
    getters,
};
