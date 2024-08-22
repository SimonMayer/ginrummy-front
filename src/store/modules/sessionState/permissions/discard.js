const getters = {
    canDiscardAsNextMove(state, getters, rootState, rootGetters) {
        return rootGetters['sessionState/permissions/core/canAct'] &&
            rootGetters['sessionState/derived/turn/hasDrawActionInCurrentTurn'] &&
            !rootGetters['sessionState/uiOperations/selections/selectedMeldId'];
    },
    canDiscardSelected(state, getters, rootState, rootGetters) {
        return getters.canDiscardAsNextMove && rootGetters['sessionState/derived/selectedItems/hasOneHandCardSelected'];
    },
    canOnlyDiscard(state, getters, rootState, rootGetters) {
        return getters.canDiscardAsNextMove && rootGetters['sessionState/derived/hand/currentHandCardLength'] === 1;
    },
    canDiscardNowByButton(state, getters) {
        return getters.canDiscardSelected || getters.canOnlyDiscard;
    },
    canStartDraggingCardNowToDiscard: (state, getters, rootState, rootGetters) => (cardId) => {
        return getters.canOnlyDiscard ||
            (
                getters.canDiscardSelected &&
                rootGetters['sessionState/derived/selectedItems/selectedHandCardIds'][0] === cardId
            ) ||
            (
                getters.canDiscardAsNextMove &&
                rootGetters['sessionState/derived/selectedItems/hasNoHandCardsSelected']
            );
    },
    canDiscardCurrentlyDraggedCard(state, getters, rootState, rootGetters) {
        return getters.canDiscardAsNextMove &&
            rootGetters['sessionState/uiOperations/dragState/draggedVisibleCardCount'] === 1 &&
            rootGetters['sessionState/derived/draggedItems/hasOneHandCardDragged'];
    },
};

export default {
    namespaced: true,
    getters,
};
