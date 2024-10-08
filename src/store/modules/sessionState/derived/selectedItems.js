import meldsService from '@/services/meldsService';

const getters = {
    selectedHandCardIds(state, getters, rootState, rootGetters) {
        const handCardIds = rootGetters['sessionState/derived/hand/currentHandCardIds'] || [];
        const selectedCardIds = rootGetters['sessionState/uiOperations/selections/selectedCardIds'];

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
    isCardOnlyOneNotSelectedInHand: (state, getters, rootState, rootGetters) => (cardId) => {
        const handSize = rootGetters['sessionState/derived/hand/currentHandCardLength'];
        return ((handSize - getters.selectedHandCardCount) === 1) &&
            !getters.selectedHandCardIds.includes(cardId);
    },
    selectedDiscardPileCardIds(state, getters, rootState, rootGetters) {
        const discardPileCardIds = rootGetters['sessionState/derived/discardPile/currentDiscardPileCardIds'];
        const selectedCardIds = rootGetters['sessionState/uiOperations/selections/selectedCardIds'];

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
        return rootGetters['sessionState/derived/discardPile/getCountOfCurrentDiscardPileCardsFromCardAndHigher'](
            getters.lowestSelectedCardIdInDiscardPile,
        );
    },
    selectedMeld(state, getters, rootState, rootGetters) {
        const selectedMeldId = rootGetters['sessionState/uiOperations/selections/selectedMeldId'];
        return rootGetters['storage/rounds/melds/getMeldById'](selectedMeldId);
    },
    selectedMeldCardIds(state, getters) {
        const selectedMeld = getters.selectedMeld;
        return selectedMeld ? selectedMeld.cardIds : [];
    },
    selectedMeldCards(state, getters) {
        const selectedMeld = getters.selectedMeld;
        return selectedMeld ? selectedMeld.cards : [];
    },
    allSelectedCardIds(state, getters) {
        return [...getters.selectedMeldCardIds, ...getters.selectedHandCardIds, ...getters.selectedDiscardPileCardIds];
    },
    allSelectedCards(state, getters) {
        return [...getters.selectedMeldCards, ...getters.selectedHandCards, ...getters.selectedDiscardPileCards];
    },
    hasSelectedMeldOrCards(state, getters, rootState, rootGetters) {
        return !!rootGetters['sessionState/uiOperations/selections/selectedMeldId'] ||
            getters.selectedDiscardPileCardCount > 0 ||
            getters.selectedHandCardCount > 0;
    },
    hasOnlySelectedCardsOfMatchingRank(state, getters) {
        return meldsService.areAllCardsOfSameRank(getters.allSelectedCards);
    },
};

export default {
    namespaced: true,
    getters,
};
