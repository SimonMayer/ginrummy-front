import meldsService from '@/services/meldsService';

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
        return getters.canDrawOne &&
            rootGetters['trackers/derived/discardPile/currentTopDiscardPileCardId'] &&
            (
                rootGetters['trackers/derived/selected/hasNoDiscardPileCardsSelected'] ||
                rootGetters['trackers/derived/selected/isOnlyTopDiscardPileCardSelected']
            );
    },
    canDrawMultiple(state, getters, rootState, rootGetters) {
        return getters.canDraw &&
            rootGetters['trackers/derived/players/currentSelfHasPlayedMeld'] &&
            rootGetters['trackers/permissions/melds/canMeldOnThisRotation'];
    },
    canDrawMultipleFromDiscardPile(state, getters, rootState, rootGetters) {
        const futureMeldedCardCount = rootGetters['trackers/derived/selected/selectedHandCardCount'] + rootGetters['trackers/derived/selected/selectedDiscardPileCardCount'];
        const currentAndFutureMeldedCards = rootGetters['trackers/derived/selected/allSelectedCards'];

        const handCardLength = rootGetters['trackers/derived/hand/currentHandCardLength'];
        const drawnCardsLength = rootGetters['trackers/derived/selected/countSelectedAndHigherDiscardPileCards'];

        const minimumMeldSize = rootGetters['gameConfig/minimumMeldSize'];
        const runOrders = rootGetters['gameConfig/runOrders'];

        return getters.canDrawMultiple  &&
            rootGetters['trackers/derived/selected/isAnyDiscardPileCardSelectedBelowTop'] &&
            futureMeldedCardCount < (handCardLength + drawnCardsLength) &&
            currentAndFutureMeldedCards.length >= minimumMeldSize &&
            meldsService.doCardsMakeValidMeld(currentAndFutureMeldedCards, runOrders);
    },
};

export default {
    namespaced: true,
    getters,
};
