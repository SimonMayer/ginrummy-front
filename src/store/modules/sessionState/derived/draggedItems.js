const getters = {
    draggedDiscardPileCardIds(state, getters, rootState, rootGetters) {
        const discardPileCardIds = rootGetters['sessionState/derived/discardPile/currentDiscardPileCardIds'];
        const draggedVisibleCardIds = rootGetters['sessionState/uiOperations/dragState/draggedVisibleCardIds'];

        return discardPileCardIds.filter(cardId => draggedVisibleCardIds.includes(cardId));
    },
    draggedDiscardPileCardCount(state, getters) {
        return getters.draggedDiscardPileCardIds.length;
    },
    lowestDraggedCardIdInDiscardPile(state, getters) {
        return getters.draggedDiscardPileCardCount ? getters.draggedDiscardPileCardIds[0] : null;
    },
    draggedDiscardPileCards(state, getters, rootState, rootGetters) {
        return getters.draggedDiscardPileCardIds.map(cardId => rootGetters['storage/cards/cards/getCardById'](cardId));
    },
    hasOneDiscardPileCardDragged(state, getters) {
        return getters.draggedDiscardPileCardCount === 1;
    },
    isOnlyTopDiscardPileCardDragged(state, getters, rootState, rootGetters) {
        const topCardId = rootGetters['sessionState/derived/discardPile/currentTopDiscardPileCardId'];
        return getters.hasOneDiscardPileCardDragged && topCardId === getters.draggedDiscardPileCardIds[0];
    },
    countDraggedAndHigherDiscardPileCards(state, getters, rootState, rootGetters) {
        return rootGetters['sessionState/derived/discardPile/getCountOfCurrentDiscardPileCardsFromCardAndHigher'](
            getters.lowestDraggedCardIdInDiscardPile,
        );
    },
    draggedHandCardIds(state, getters, rootState, rootGetters) {
        const handCardIds = rootGetters['sessionState/derived/hand/currentHandCardIds'];
        const draggedVisibleCardIds = rootGetters['sessionState/uiOperations/dragState/draggedVisibleCardIds'];

        return handCardIds.filter(cardId => draggedVisibleCardIds.includes(cardId));
    },
    draggedHandCardCount(state, getters) {
        return getters.draggedHandCardIds.length;
    },
    draggedHandCards(state, getters, rootState, rootGetters) {
        return getters.draggedHandCardIds.map(cardId => rootGetters['storage/cards/cards/getCardById'](cardId));
    },
    hasOneHandCardDragged(state, getters) {
        return getters.draggedHandCardCount === 1;
    },
    allDraggedCardIds(state, getters) {
        return [...getters.draggedHandCardIds, ...getters.draggedDiscardPileCardIds];
    },
    allDraggedCardCount(state, getters) {
        return getters.allDraggedCardIds.length;
    },
};

export default {
    namespaced: true,
    getters,
};
