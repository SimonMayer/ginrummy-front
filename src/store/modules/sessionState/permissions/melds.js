import meldsService from '@/services/meldsService';

const getters = {
    canMeldOnThisRotation(state, getters, rootState, rootGetters) {
        const rotationNumber = rootGetters['sessionState/derived/turn/currentRotationNumber'];
        const allowMeldsFromRotation = rootGetters['storage/gameConfig/allowMeldsFromRotation'];

        return rotationNumber && rotationNumber >= allowMeldsFromRotation;
    },
    canPlayMeld(state, getters, rootState, rootGetters) {
        return rootGetters['sessionState/permissions/core/canAct'] &&
            !rootGetters['sessionState/uiOperations/selections/selectedMeldId'] &&
            getters.canMeldOnThisRotation;
    },
    canPlayMeldAfterDraw(state, getters, rootState, rootGetters) {
        const selectedHandCardCount = rootGetters['sessionState/derived/selectedItems/selectedHandCardCount'];
        const minimumMeldSize = rootGetters['storage/gameConfig/minimumMeldSize'];

        return getters.canPlayMeld &&
            rootGetters['sessionState/derived/turn/hasDrawActionInCurrentTurn'] &&
            selectedHandCardCount >= minimumMeldSize &&
            !rootGetters['sessionState/derived/selectedItems/hasAllHandCardsSelected'];
    },
    canPlayRunFromHand(state, getters, rootState, rootGetters) {
        const selectedHandCards = rootGetters['sessionState/derived/selectedItems/selectedHandCards'];
        const runOrders = rootGetters['storage/gameConfig/runOrders'];

        return getters.canPlayMeldAfterDraw && meldsService.doCardsMakeValidRun(selectedHandCards, runOrders);
    },
    canPlaySetFromHand(state, getters, rootState, rootGetters) {
        const selectedHandCards = rootGetters['sessionState/derived/selectedItems/selectedHandCards'];
        return getters.canPlayMeldAfterDraw && meldsService.areAllCardsOfSameRank(selectedHandCards);
    },
    canPlayMeldFromHand(state, getters) {
        return getters.canPlaySetFromHand || getters.canPlayRunFromHand;
    },
    canExtendMelds(state, getters, rootState, rootGetters) {
        return rootGetters['sessionState/permissions/core/canAct'] &&
            rootGetters['sessionState/derived/players/currentSelfHasPlayedMeld'] &&
            getters.canMeldOnThisRotation;
    },
    canExtendSelectedMeld(state, getters, rootState, rootGetters) {
        return getters.canExtendMelds && rootGetters['sessionState/uiOperations/selections/selectedMeldId'];
    },
    canExtendMeldFromHand(state, getters, rootState, rootGetters) {
        const cards = [
            ...rootGetters['sessionState/derived/selectedItems/selectedHandCards'],
            ...rootGetters['sessionState/derived/selectedItems/selectedMeldCards'],
        ];
        const runOrders = rootGetters['storage/gameConfig/runOrders'];

        return getters.canExtendSelectedMeld &&
            rootGetters['sessionState/derived/turn/hasDrawActionInCurrentTurn'] &&
            !rootGetters['sessionState/derived/selectedItems/hasNoHandCardsSelected'] &&
            !rootGetters['sessionState/derived/selectedItems/hasAllHandCardsSelected'] &&
            meldsService.doCardsMakeValidMeld(cards, runOrders);
    },
};

export default {
    namespaced: true,
    getters,
};
