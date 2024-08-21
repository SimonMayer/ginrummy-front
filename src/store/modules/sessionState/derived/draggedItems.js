const getters = {
    draggedDiscardPileCardIds(state, getters, rootState, rootGetters) {
        const discardPileCardIds = rootGetters['sessionState/derived/discardPile/currentDiscardPileCardIds'];
        const draggedVisibleCardIds = rootGetters['sessionState/uiOperations/dragState/draggedVisibleCardIds'];

        return discardPileCardIds.filter(cardId => draggedVisibleCardIds.includes(cardId));
    },
    draggedDiscardPileCardCount(state, getters) {
        return getters.draggedDiscardPileCardIds.length;
    },
    hasOneDiscardPileCardDragged(state, getters) {
        return getters.draggedDiscardPileCardCount === 1;
    },
    isOnlyTopDiscardPileCardDragged(state, getters, rootState, rootGetters) {
        const topCardId = rootGetters['sessionState/derived/discardPile/currentTopDiscardPileCardId'];
        return getters.hasOneDiscardPileCardDragged && topCardId === getters.draggedDiscardPileCardIds[0];
    },
};

export default {
    namespaced: true,
    getters,
};
