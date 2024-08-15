import meldsService from '@/services/meldsService';

const getters = {
    canDraw(state, getters, rootState, rootGetters) {
        return rootGetters['sessionState/permissions/core/canAct'] &&
            !rootGetters['sessionState/derived/draw/hasDrawActionInCurrentTurn'];
    },
    canDrawOne(state, getters, rootState, rootGetters) {
        return getters.canDraw &&
            rootGetters['sessionState/derived/selected/hasNoHandCardsSelected'] &&
            !rootGetters['sessionState/selections/selectedMeldId'];
    },
    canDrawOneFromStockPile(state, getters, rootState, rootGetters) {
        return getters.canDrawOne && rootGetters['sessionState/derived/selected/hasNoDiscardPileCardsSelected'];
    },
    canDrawOneFromDiscardPile(state, getters, rootState, rootGetters) {
        return getters.canDrawOne &&
            rootGetters['sessionState/derived/discardPile/currentTopDiscardPileCardId'] &&
            (
                rootGetters['sessionState/derived/selected/hasNoDiscardPileCardsSelected'] ||
                rootGetters['sessionState/derived/selected/isOnlyTopDiscardPileCardSelected']
            );
    },
    canDrawMultiple(state, getters, rootState, rootGetters) {
        return getters.canDraw &&
            rootGetters['sessionState/derived/players/currentSelfHasPlayedMeld'] &&
            rootGetters['sessionState/permissions/melds/canMeldOnThisRotation'];
    },
    canDrawMultipleFromDiscardPile(state, getters, rootState, rootGetters) {
        const futureMeldedCardCount = rootGetters['sessionState/derived/selected/selectedHandCardCount'] + rootGetters['sessionState/derived/selected/selectedDiscardPileCardCount'];
        const currentAndFutureMeldedCards = rootGetters['sessionState/derived/selected/allSelectedCards'];

        const handCardLength = rootGetters['sessionState/derived/hand/currentHandCardLength'];
        const drawnCardsLength = rootGetters['sessionState/derived/selected/countSelectedAndHigherDiscardPileCards'];

        const minimumMeldSize = rootGetters['storage/gameConfig/minimumMeldSize'];
        const runOrders = rootGetters['storage/gameConfig/runOrders'];

        return getters.canDrawMultiple  &&
            rootGetters['sessionState/derived/selected/isAnyDiscardPileCardSelectedBelowTop'] &&
            futureMeldedCardCount < (handCardLength + drawnCardsLength) &&
            currentAndFutureMeldedCards.length >= minimumMeldSize &&
            meldsService.doCardsMakeValidMeld(currentAndFutureMeldedCards, runOrders);
    },
};

export default {
    namespaced: true,
    getters,
};
