import meldsService from '@/services/meldsService';

const getters = {
    canDrawAsNextMove(state, getters, rootState, rootGetters) {
        return rootGetters['sessionState/permissions/core/canAct'] &&
            !rootGetters['sessionState/derived/turn/hasDrawActionInCurrentTurn'];
    },
    canDrawOneAsNextMove(state, getters, rootState, rootGetters) {
        return getters.canDrawAsNextMove &&
            rootGetters['sessionState/derived/selectedItems/hasNoHandCardsSelected'] &&
            !rootGetters['sessionState/uiOperations/selections/selectedMeldId'];
    },
    canDrawOneFromStockPileAsNextMove(state, getters, rootState, rootGetters) {
        return getters.canDrawOneAsNextMove && rootGetters['sessionState/derived/selectedItems/hasNoDiscardPileCardsSelected'];
    },
    canDrawOneFromStockPileNowByButton(state, getters) {
        return getters.canDrawOneFromStockPileAsNextMove;
    },
    canStartDraggingNowToDrawOneFromStockPile(state, getters) {
        return getters.canDrawOneFromStockPileAsNextMove;
    },
    canDrawCurrentlyDraggedItemAsOneFromStockPile(state, getters, rootState, rootGetters) {
        return getters.canDrawOneFromStockPileAsNextMove &&
            rootGetters['sessionState/uiOperations/dragState/draggedNamedHiddenCard'] === 'topCardInStockPile';
    },
    canDrawOneFromDiscardPileAsNextMove(state, getters, rootState, rootGetters) {
        return getters.canDrawOneAsNextMove &&
            rootGetters['sessionState/derived/discardPile/currentTopDiscardPileCardId'] &&
            (
                rootGetters['sessionState/derived/selectedItems/hasNoDiscardPileCardsSelected'] ||
                rootGetters['sessionState/derived/selectedItems/isOnlyTopDiscardPileCardSelected']
            );
    },
    canDrawOneFromDiscardPileNowByButton(state, getters) {
        return getters.canDrawOneFromDiscardPileAsNextMove;
    },
    canStartDraggingCardNowToDrawOneFromDiscardPile: (state, getters, rootState, rootGetters) => (cardId) => {
        return getters.canDrawOneFromDiscardPileAsNextMove &&
            rootGetters['sessionState/derived/discardPile/currentTopDiscardPileCardId'] === cardId;
    },
    canDrawCurrentlyDraggedItemAsOneFromDiscardPile(state, getters, rootState, rootGetters) {
        return getters.canDrawOneFromDiscardPileAsNextMove &&
            rootGetters['sessionState/derived/draggedItems/isOnlyTopDiscardPileCardDragged'];
    },
    canDrawMultipleToPlayMeldAsNextMove(state, getters, rootState, rootGetters) {
        const minimumMeldSize = rootGetters['storage/gameConfig/minimumMeldSize'];
        const handSize = rootGetters['sessionState/derived/hand/currentHandCardLength'];
        const discardPileSize = rootGetters['sessionState/derived/discardPile/currentDiscardPileCardCount'];

        return getters.canDrawAsNextMove &&
            rootGetters['sessionState/derived/players/currentSelfHasPlayedMeld'] &&
            rootGetters['sessionState/permissions/melds/canMeldOnThisRotation'] &&
            !rootGetters['sessionState/uiOperations/selections/selectedMeldId'] &&
            (handSize + discardPileSize) >= minimumMeldSize;
    },
    canDrawMultipleToPlayMeldNowByButton(state, getters, rootState, rootGetters) {
        const minimumMeldSize = rootGetters['storage/gameConfig/minimumMeldSize'];
        const runOrders = rootGetters['storage/gameConfig/runOrders'];
        const selectedCards = [
            ...rootGetters['sessionState/derived/selectedItems/selectedHandCards'],
            ...rootGetters['sessionState/derived/selectedItems/selectedDiscardPileCards'],
        ];
        const handCardLength = rootGetters['sessionState/derived/hand/currentHandCardLength'];
        const drawnCardsLength = rootGetters['sessionState/derived/selectedItems/countSelectedAndHigherDiscardPileCards'];

        return getters.canDrawMultipleToPlayMeldAsNextMove &&
            rootGetters['sessionState/derived/selectedItems/isAnyDiscardPileCardSelectedBelowTop'] &&
            selectedCards.length < (handCardLength + drawnCardsLength) &&
            meldsService.doCardsMakeValidMeld(selectedCards, runOrders, minimumMeldSize);
    },
    canStartDraggingCardNowToDrawMultipleAndPlayMeld: (state, getters, rootState, rootGetters) => (cardId) => {
        const minimumMeldSize = rootGetters['storage/gameConfig/minimumMeldSize'];
        const runOrders = rootGetters['storage/gameConfig/runOrders'];

        const handCardLength = rootGetters['sessionState/derived/hand/currentHandCardLength'];
        const drawnCardsLength = Math.max(
            rootGetters['sessionState/derived/selectedItems/countSelectedAndHigherDiscardPileCards'],
            rootGetters['sessionState/derived/discardPile/getCountOfCurrentDiscardPileCardsFromCardAndHigher'](cardId),
        );

        const potentialDraggedCardIds = [
            ...rootGetters['sessionState/derived/selectedItems/selectedHandCardIds'],
            ...rootGetters['sessionState/derived/selectedItems/selectedDiscardPileCardIds'],
        ];
        if (!potentialDraggedCardIds.includes(cardId)) {
            potentialDraggedCardIds.push(cardId);
        }
        const potentialDraggedCards = potentialDraggedCardIds.map(cardId => rootGetters['storage/cards/cards/getCardById'](cardId));

        const isNonTopCardSelected = rootGetters['sessionState/derived/selectedItems/isAnyDiscardPileCardSelectedBelowTop'];
        const isThisCardBelowTopOfDiscardPile = (
            (rootGetters['sessionState/derived/discardPile/currentDiscardPileCardCount'] -
                rootGetters['sessionState/derived/discardPile/getIndexOfCardInCurrentDiscardPile'](cardId)) > 1
        );

        return getters.canDrawMultipleToPlayMeldAsNextMove &&
            potentialDraggedCardIds.length < (handCardLength + drawnCardsLength) &&
            (isNonTopCardSelected || isThisCardBelowTopOfDiscardPile) &&
            meldsService.doCardsMakeValidMeld(potentialDraggedCards, runOrders, minimumMeldSize);
    },
    canDrawMultipleAndPlayMeldUsingCurrentlyDraggedCards(state, getters, rootState, rootGetters) {
        const draggedCards = [
            ...rootGetters['sessionState/derived/draggedItems/draggedHandCards'],
            ...rootGetters['sessionState/derived/draggedItems/draggedDiscardPileCards'],
        ];

        const handCardLength = rootGetters['sessionState/derived/hand/currentHandCardLength'];
        const drawnCardsLength = rootGetters['sessionState/derived/draggedItems/countDraggedAndHigherDiscardPileCards'];

        const runOrders = rootGetters['storage/gameConfig/runOrders'];
        const minimumMeldSize = rootGetters['storage/gameConfig/minimumMeldSize'];

        return getters.canDrawMultipleToPlayMeldAsNextMove &&
            draggedCards.length < (handCardLength + drawnCardsLength) &&
            meldsService.doCardsMakeValidMeld(draggedCards, runOrders, minimumMeldSize);
    },
    canDrawMultipleToExtendMeldAsNextMove(state, getters, rootState, rootGetters) {
        return getters.canDrawAsNextMove &&
            rootGetters['sessionState/derived/players/currentSelfHasPlayedMeld'] &&
            rootGetters['sessionState/permissions/melds/canMeldOnThisRotation'];
    },
    canDrawMultipleToExtendMeldNowByButton(state, getters, rootState, rootGetters) {
        const minimumMeldSize = rootGetters['storage/gameConfig/minimumMeldSize'];
        const runOrders = rootGetters['storage/gameConfig/runOrders'];

        const futureMeldedCardCount = rootGetters['sessionState/derived/selectedItems/selectedHandCardCount'] +
            rootGetters['sessionState/derived/selectedItems/selectedDiscardPileCardCount'];
        const currentAndFutureMeldedCards = rootGetters['sessionState/derived/selectedItems/allSelectedCards'];

        const handCardLength = rootGetters['sessionState/derived/hand/currentHandCardLength'];
        const drawnCardsLength = rootGetters['sessionState/derived/selectedItems/countSelectedAndHigherDiscardPileCards'];

        return getters.canDrawMultipleToExtendMeldAsNextMove &&
            !!rootGetters['sessionState/uiOperations/selections/selectedMeldId'] &&
            rootGetters['sessionState/derived/selectedItems/isAnyDiscardPileCardSelectedBelowTop'] &&
            futureMeldedCardCount < (handCardLength + drawnCardsLength) &&
            meldsService.doCardsMakeValidMeld(currentAndFutureMeldedCards, runOrders, minimumMeldSize);
    },
    canStartDraggingCardNowToDrawMultipleAndExtendMeld: (state, getters, rootState, rootGetters) => (cardId) => {
        const handCardLength = rootGetters['sessionState/derived/hand/currentHandCardLength'];
        const drawnCardsLength = Math.max(
            rootGetters['sessionState/derived/selectedItems/countSelectedAndHigherDiscardPileCards'],
            rootGetters['sessionState/derived/discardPile/getCountOfCurrentDiscardPileCardsFromCardAndHigher'](cardId),
        );

        const potentialDraggedCardIds = [
            ...rootGetters['sessionState/derived/selectedItems/selectedHandCardIds'],
            ...rootGetters['sessionState/derived/selectedItems/selectedDiscardPileCardIds'],
        ];
        if (!potentialDraggedCardIds.includes(cardId)) {
            potentialDraggedCardIds.push(cardId);
        }
        const potentialDraggedCards = potentialDraggedCardIds.map(cardId => rootGetters['storage/cards/cards/getCardById'](cardId));

        const isNonTopCardSelected = rootGetters['sessionState/derived/selectedItems/isAnyDiscardPileCardSelectedBelowTop'];
        const isThisCardBelowTopOfDiscardPile = (
            (rootGetters['sessionState/derived/discardPile/currentDiscardPileCardCount'] -
                rootGetters['sessionState/derived/discardPile/getIndexOfCardInCurrentDiscardPile'](cardId)) > 1
        );

        return getters.canDrawMultipleToPlayMeldAsNextMove &&
            potentialDraggedCardIds.length < (handCardLength + drawnCardsLength) &&
            (isNonTopCardSelected || isThisCardBelowTopOfDiscardPile) &&
            rootGetters['sessionState/permissions/melds/canAnyMeldsExtendWithCards'](potentialDraggedCards);
    },
    canDrawMultipleAsNextMove(state, getters) {
        return getters.canDrawMultipleToPlayMeldAsNextMove || getters.canDrawMultipleToExtendMeldAsNextMove;
    },
    canDrawMultipleAndExtendSpecificMeldUsingCurrentlyDraggedCards: (state, getters, rootState, rootGetters) => (meldId) => {
        const draggedCards = [
            ...rootGetters['sessionState/derived/draggedItems/draggedHandCards'],
            ...rootGetters['sessionState/derived/draggedItems/draggedDiscardPileCards'],
        ];

        const handCardLength = rootGetters['sessionState/derived/hand/currentHandCardLength'];
        const drawnCardsLength = rootGetters['sessionState/derived/draggedItems/countDraggedAndHigherDiscardPileCards'];

        const runOrders = rootGetters['storage/gameConfig/runOrders'];
        const minimumMeldSize = rootGetters['storage/gameConfig/minimumMeldSize'];

        const meld = rootGetters['storage/rounds/melds/getMeldById'](meldId);
        const cards = [...draggedCards, ...meld.cards];

        return getters.canDrawMultipleToExtendMeldAsNextMove &&
            draggedCards.length > 0 &&
            draggedCards.length < (handCardLength + drawnCardsLength) &&
            !rootGetters['sessionState/derived/draggedItems/isOnlyTopDiscardPileCardDragged'] &&
            meldsService.doCardsMakeValidMeld(cards, runOrders, minimumMeldSize);
    },
    canDrawMultipleNowByButton(state, getters) {
        return getters.canDrawMultipleToPlayMeldNowByButton || getters.canDrawMultipleToExtendMeldNowByButton;
    },
    canStartDraggingCardNowToDrawMultiple: (state, getters) => (cardId) => {
        return getters.canStartDraggingCardNowToDrawMultipleAndPlayMeld(cardId) ||
            getters.canStartDraggingCardNowToDrawMultipleAndExtendMeld(cardId);
    },
};

export default {
    namespaced: true,
    getters,
};
