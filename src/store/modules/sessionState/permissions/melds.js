import meldsService from '@/services/meldsService';

const getters = {
    canMeldOnThisRotation(state, getters, rootState, rootGetters) {
        const rotationNumber = rootGetters['sessionState/derived/turn/currentRotationNumber'];
        const allowMeldsFromRotation = rootGetters['storage/gameConfig/allowMeldsFromRotation'];

        return rotationNumber && rotationNumber >= allowMeldsFromRotation;
    },
    canPlayMeldFromHandAsNextMove(state, getters, rootState, rootGetters) {
        const minimumMeldSize = rootGetters['storage/gameConfig/minimumMeldSize'];

        return rootGetters['sessionState/permissions/core/canAct'] &&
            !rootGetters['sessionState/uiOperations/selections/selectedMeldId'] &&
            getters.canMeldOnThisRotation &&
            rootGetters['sessionState/derived/turn/hasDrawActionInCurrentTurn'] &&
            rootGetters['sessionState/derived/hand/currentHandCardLength'] >= minimumMeldSize;
    },
    canPlayMeldFromHandNowByButton(state, getters, rootState, rootGetters) {
        const selectedHandCards = rootGetters['sessionState/derived/selectedItems/selectedHandCards'];
        const minimumMeldSize = rootGetters['storage/gameConfig/minimumMeldSize'];
        const runOrders = rootGetters['storage/gameConfig/runOrders'];

        return getters.canPlayMeldFromHandAsNextMove &&
            !rootGetters['sessionState/derived/selectedItems/hasAllHandCardsSelected'] &&
            meldsService.doCardsMakeValidMeld(selectedHandCards, runOrders, minimumMeldSize);
    },
    canStartDraggingCardNowFromHandToPlayMeld: (state, getters, rootState, rootGetters) => (cardId) => {
        const cardIds = [...rootGetters['sessionState/derived/selectedItems/selectedHandCardIds']];
        if (!cardIds.includes(cardId)) {
            cardIds.push(cardId);
        }
        const cards = cardIds.map(cardId => rootGetters['storage/cards/cards/getCardById'](cardId));

        const minimumMeldSize = rootGetters['storage/gameConfig/minimumMeldSize'];
        const runOrders = rootGetters['storage/gameConfig/runOrders'];

        return getters.canPlayMeldFromHandAsNextMove &&
            !rootGetters['sessionState/derived/selectedItems/hasAllHandCardsSelected'] &&
            !rootGetters['sessionState/derived/selectedItems/isCardOnlyOneNotSelectedInHand'](cardId) &&
            meldsService.doCardsMakeValidMeld(cards, runOrders, minimumMeldSize);
    },
    canPlayCurrentlyDraggedCardsFromHandAsMeld(state, getters, rootState, rootGetters) {
        const draggedHandCards = rootGetters['sessionState/derived/draggedItems/draggedHandCards'];
        const runOrders = rootGetters['storage/gameConfig/runOrders'];
        const minimumMeldSize = rootGetters['storage/gameConfig/minimumMeldSize'];

        return getters.canPlayMeldFromHandAsNextMove &&
            !rootGetters['sessionState/derived/selectedItems/hasAllHandCardsSelected'] &&
            meldsService.doCardsMakeValidMeld(draggedHandCards, runOrders, minimumMeldSize);
    },
    canExtendMeldFromHandAsNextMove(state, getters, rootState, rootGetters) {
        return rootGetters['sessionState/permissions/core/canAct'] &&
            rootGetters['sessionState/derived/players/currentSelfHasPlayedMeld'] &&
            getters.canMeldOnThisRotation &&
            rootGetters['sessionState/derived/turn/hasDrawActionInCurrentTurn'] &&
            rootGetters['sessionState/derived/hand/currentHandCardLength'] > 1;
    },
    canExtendMeldFromHandNowByButton(state, getters, rootState, rootGetters) {
        const cards = [
            ...rootGetters['sessionState/derived/selectedItems/selectedHandCards'],
            ...rootGetters['sessionState/derived/selectedItems/selectedMeldCards'],
        ];
        const minimumMeldSize = rootGetters['storage/gameConfig/minimumMeldSize'];
        const runOrders = rootGetters['storage/gameConfig/runOrders'];

        return getters.canExtendMeldFromHandAsNextMove &&
            rootGetters['sessionState/uiOperations/selections/selectedMeldId'] &&
            !rootGetters['sessionState/derived/selectedItems/hasNoHandCardsSelected'] &&
            !rootGetters['sessionState/derived/selectedItems/hasAllHandCardsSelected'] &&
            meldsService.doCardsMakeValidMeld(cards, runOrders, minimumMeldSize);
    },
    canAnyMeldsExtendWithCards: (state, getters, rootState, rootGetters) => (extendingCards) => {
        const minimumMeldSize = rootGetters['storage/gameConfig/minimumMeldSize'];
        const runOrders = rootGetters['storage/gameConfig/runOrders'];
        const melds = rootGetters['sessionState/derived/melds/currentMelds'];

        for (const meld of melds) {
            const cards = [...extendingCards, ...meld.cards];
            if (meldsService.doCardsMakeValidMeld(cards, runOrders, minimumMeldSize)) {
                return true;
            }
        }
        return false;
    },
    canStartDraggingCardNowFromHandToExtendMeld: (state, getters, rootState, rootGetters) => (cardId) => {
        const handCardIds = [...rootGetters['sessionState/derived/selectedItems/selectedHandCardIds']];
        if (!handCardIds.includes(cardId)) {
            handCardIds.push(cardId);
        }
        const handCards = handCardIds.map(cardId => rootGetters['storage/cards/cards/getCardById'](cardId));

        return getters.canExtendMeldFromHandAsNextMove &&
            !rootGetters['sessionState/derived/selectedItems/hasAllHandCardsSelected'] &&
            !rootGetters['sessionState/derived/selectedItems/isCardOnlyOneNotSelectedInHand'](cardId) &&
            getters.canAnyMeldsExtendWithCards(handCards);
    },
    canExtendSpecificMeldFromHandWithCurrentlyDraggedCards: (state, getters, rootState, rootGetters) => (meldId) => {
        const draggedHandCards = rootGetters['sessionState/derived/draggedItems/draggedHandCards'];
        const runOrders = rootGetters['storage/gameConfig/runOrders'];
        const minimumMeldSize = rootGetters['storage/gameConfig/minimumMeldSize'];
        const meld = rootGetters['storage/rounds/melds/getMeldById'](meldId);
        const cards = [...draggedHandCards, ...meld.cards];

        return getters.canExtendMeldFromHandAsNextMove &&
            !rootGetters['sessionState/derived/selectedItems/hasAllHandCardsSelected'] &&
            meldsService.doCardsMakeValidMeld(cards, runOrders, minimumMeldSize);
    },
};

export default {
    namespaced: true,
    getters,
};
