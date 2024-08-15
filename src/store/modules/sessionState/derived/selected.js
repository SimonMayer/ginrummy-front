const getters = {
    selectedHandCardIds(state, getters, rootState, rootGetters) {
        const handCardIds = rootGetters['sessionState/derived/hand/currentHandCardIds'] || [];
        const selectedCardIds = rootGetters['sessionState/selections/getSelectedCardIds'];

        return handCardIds.filter(cardId => selectedCardIds.includes(cardId));
    },
    selectedHandCards(state, getters, rootState, rootGetters) {
        return getters.selectedHandCardIds.map(cardId => rootGetters['storage/cards/cards/getCardById'](cardId));
    },
    selectedHandCardCount(state, getters) {
        return getters.selectedHandCardIds.length;
    },
    hasNoHandCardsSelected(state, getters) {
        return getters.selectedHandCardCount === 0;
    },
    hasOneHandCardSelected(state, getters) {
        return getters.selectedHandCardCount === 1;
    },
    hasAllHandCardsSelected(state, getters, rootState, rootGetters) {
        const handCardIds = rootGetters['sessionState/derived/hand/currentHandCardIds'];
        return getters.selectedHandCardCount === handCardIds.length;
    },
    selectedDiscardPileCardIds(state, getters, rootState, rootGetters) {
        const discardPileCardIds = rootGetters['sessionState/derived/discardPile/currentDiscardPileCardIds'];
        const selectedCardIds = rootGetters['sessionState/selections/getSelectedCardIds'];

        return discardPileCardIds.filter(cardId => selectedCardIds.includes(cardId));
    },
    selectedDiscardPileCards(state, getters, rootState, rootGetters) {
        return getters.selectedDiscardPileCardIds.map(cardId => rootGetters['storage/cards/cards/getCardById'](cardId));
    },
    selectedDiscardPileCardCount(state, getters) {
        return getters.selectedDiscardPileCardIds.length;
    },
    lowestSelectedCardIdInDiscardPile(state, getters) {
        return getters.selectedDiscardPileCardCount ? getters.selectedDiscardPileCardIds[0] : null;
    },
    hasNoDiscardPileCardsSelected(state, getters) {
        return getters.selectedDiscardPileCardCount === 0;
    },
    hasOneDiscardPileCardSelected(state, getters) {
        return getters.selectedDiscardPileCardCount === 1;
    },
    isAnyDiscardPileCardSelected(state, getters) {
        return getters.selectedDiscardPileCardCount > 0;
    },
    isAnyDiscardPileCardSelectedBelowTop(state, getters, rootState, rootGetters) {
        const topCardId = rootGetters['sessionState/derived/discardPile/currentTopDiscardPileCardId'];
        return getters.isAnyDiscardPileCardSelected && getters.lowestSelectedCardIdInDiscardPile !== topCardId;
    },
    isOnlyTopDiscardPileCardSelected(state, getters, rootState, rootGetters) {
        const topCardId = rootGetters['sessionState/derived/discardPile/currentTopDiscardPileCardId'];
        return getters.hasOneDiscardPileCardSelected && topCardId === getters.selectedDiscardPileCardIds[0];
    },
    countSelectedAndHigherDiscardPileCards(state, getters, rootState, rootGetters) {
        const discardPileCardIds = rootGetters['sessionState/derived/discardPile/currentDiscardPileCardIds'];
        const lowestCardIndex = discardPileCardIds.findIndex(cardId => cardId === getters.lowestSelectedCardIdInDiscardPile);

        return lowestCardIndex !== -1 ? discardPileCardIds.length - lowestCardIndex : 0;
    },
    selectedMeld(state, getters, rootState, rootGetters) {
        const selectedMeldId = rootGetters['sessionState/selections/selectedMeldId'];
        return rootGetters['storage/rounds/melds/getMeldById'](selectedMeldId);
    },
    selectedMeldCards(state, getters) {
        const selectedMeld = getters.selectedMeld;
        return selectedMeld ? selectedMeld.cards : [];
    },
    allSelectedCards(state, getters) {
        return [...getters.selectedMeldCards, ...getters.selectedHandCards, ...getters.selectedDiscardPileCards];
    },
    hasSelectedMeldOrCards(state, getters, rootState, rootGetters) {
        return !!rootGetters['sessionState/selections/selectedMeldId'] ||
            getters.selectedDiscardPileCardCount > 0 ||
            getters.selectedHandCardCount > 0;
    },
};

export default {
    namespaced: true,
    getters,
};
