import meldsService from '@/services/meldsService';

const getters = {
    canMeldOnThisRotation(state, getters, rootState, rootGetters) {
        const rotationNumber = rootGetters['sessionState/derived/turn/currentRotationNumber'];
        const allowMeldsFromRotation = rootGetters['storage/gameConfig/allowMeldsFromRotation'];

        return rotationNumber && rotationNumber >= allowMeldsFromRotation;
    },
    canPlayMeld(state, getters, rootState, rootGetters) {
        return rootGetters['sessionState/permissions/core/canAct'] &&
            !rootGetters['sessionState/selections/selectedMeldId'] &&
            getters.canMeldOnThisRotation;
    },
    canPlayMeldFromHand(state, getters, rootState, rootGetters) {
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

        return getters.canPlayMeldFromHand && meldsService.doCardsMakeValidRun(selectedHandCards, runOrders);
    },
    canPlaySetFromHand(state, getters, rootState, rootGetters) {
        const selectedHandCards = rootGetters['sessionState/derived/selectedItems/selectedHandCards'];
        return getters.canPlayMeldFromHand && meldsService.areAllCardsOfSameRank(selectedHandCards);
    },
    canSelectMelds(state, getters, rootState, rootGetters) {
        return rootGetters['sessionState/permissions/core/canAct'] &&
            rootGetters['sessionState/derived/players/currentSelfHasPlayedMeld'] &&
            getters.canMeldOnThisRotation;
    },
    canExtendMeld(state, getters, rootState, rootGetters) {
        return getters.canSelectMelds && rootGetters['sessionState/selections/selectedMeldId'];
    },
    canExtendMeldFromHand(state, getters, rootState, rootGetters) {
        const cards = [
            ...rootGetters['sessionState/derived/selectedItems/selectedHandCards'],
            ...rootGetters['sessionState/derived/selectedItems/selectedMeldCards'],
        ];
        const runOrders = rootGetters['storage/gameConfig/runOrders'];

        return getters.canExtendMeld &&
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
