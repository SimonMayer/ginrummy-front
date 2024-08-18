import meldsService from '@/services/meldsService';

const getters = {
    canDraw(state, getters, rootState, rootGetters) {
        return rootGetters['sessionState/permissions/core/canAct'] &&
            !rootGetters['sessionState/derived/turn/hasDrawActionInCurrentTurn'];
    },
    canDrawOne(state, getters, rootState, rootGetters) {
        return getters.canDraw &&
            rootGetters['sessionState/derived/selectedItems/hasNoHandCardsSelected'] &&
            !rootGetters['sessionState/uiOperations/selections/selectedMeldId'];
    },
    canDrawOneFromStockPile(state, getters, rootState, rootGetters) {
        return getters.canDrawOne && rootGetters['sessionState/derived/selectedItems/hasNoDiscardPileCardsSelected'];
    },
    canDrawOneFromDiscardPile(state, getters, rootState, rootGetters) {
        return getters.canDrawOne &&
            rootGetters['sessionState/derived/discardPile/currentTopDiscardPileCardId'] &&
            (
                rootGetters['sessionState/derived/selectedItems/hasNoDiscardPileCardsSelected'] ||
                rootGetters['sessionState/derived/selectedItems/isOnlyTopDiscardPileCardSelected']
            );
    },
    canDrawMultiple(state, getters, rootState, rootGetters) {
        return getters.canDraw &&
            rootGetters['sessionState/derived/players/currentSelfHasPlayedMeld'] &&
            rootGetters['sessionState/permissions/melds/canMeldOnThisRotation'];
    },
    canDrawMultipleFromDiscardPile(state, getters, rootState, rootGetters) {
        const futureMeldedCardCount = rootGetters['sessionState/derived/selectedItems/selectedHandCardCount'] + rootGetters['sessionState/derived/selectedItems/selectedDiscardPileCardCount'];
        const currentAndFutureMeldedCards = rootGetters['sessionState/derived/selectedItems/allSelectedCards'];

        const handCardLength = rootGetters['sessionState/derived/hand/currentHandCardLength'];
        const drawnCardsLength = rootGetters['sessionState/derived/selectedItems/countSelectedAndHigherDiscardPileCards'];

        const minimumMeldSize = rootGetters['storage/gameConfig/minimumMeldSize'];
        const runOrders = rootGetters['storage/gameConfig/runOrders'];

        return getters.canDrawMultiple &&
            rootGetters['sessionState/derived/selectedItems/isAnyDiscardPileCardSelectedBelowTop'] &&
            futureMeldedCardCount < (handCardLength + drawnCardsLength) &&
            currentAndFutureMeldedCards.length >= minimumMeldSize &&
            meldsService.doCardsMakeValidMeld(currentAndFutureMeldedCards, runOrders);
    },
};

export default {
    namespaced: true,
    getters,
};
