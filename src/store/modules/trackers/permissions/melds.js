import meldsService from '@/services/meldsService';

const getters = {
    canMeldOnThisRotation(state, getters, rootState, rootGetters) {
        const rotationNumber = rootGetters['trackers/derived/turns/currentRotationNumber'];
        const allowMeldsFromRotation = rootGetters['gameConfig/allowMeldsFromRotation'];

        return rotationNumber && rotationNumber >= allowMeldsFromRotation;
    },
    canPlayMeld(state, getters, rootState, rootGetters) {
        return rootGetters['trackers/permissions/core/canAct'] &&
            !rootGetters['trackers/selections/selectedMeldId'] &&
            getters.canMeldOnThisRotation;
    },
    canPlayMeldFromHand(state, getters, rootState, rootGetters) {
        const selectedHandCardCount = rootGetters['trackers/derived/selected/selectedHandCardCount'];
        const minimumMeldSize = rootGetters['gameConfig/minimumMeldSize'];

        return getters.canPlayMeld &&
            rootGetters['trackers/derived/draw/hasDrawActionInCurrentTurn'] &&
            selectedHandCardCount >= minimumMeldSize &&
            !rootGetters['trackers/derived/selected/hasAllHandCardsSelected'];
    },
    canPlayRunFromHand(state, getters, rootState, rootGetters) {
        const selectedHandCards = rootGetters['trackers/derived/selected/selectedHandCards'];
        const runOrders = rootGetters['gameConfig/runOrders'];

        return getters.canPlayMeldFromHand && meldsService.doCardsMakeValidRun(selectedHandCards, runOrders);
    },
    canPlaySetFromHand(state, getters, rootState, rootGetters) {
        const selectedHandCards = rootGetters['trackers/derived/selected/selectedHandCards'];
        return getters.canPlayMeldFromHand && meldsService.areAllCardsOfSameRank(selectedHandCards);
    },
    canSelectMelds(state, getters, rootState, rootGetters) {
        return rootGetters['trackers/permissions/core/canAct'] &&
            rootGetters['trackers/derived/self/hasPlayedMeld'] &&
            getters.canMeldOnThisRotation;
    },
    canExtendMeld(state, getters, rootState, rootGetters) {
        return getters.canSelectMelds && rootGetters['trackers/selections/selectedMeldId'];
    },
    canExtendMeldFromHand(state, getters, rootState, rootGetters) {
        const cards = [
            ...rootGetters['trackers/derived/selected/selectedHandCards'],
            ...rootGetters['trackers/derived/selected/selectedMeldCards'],
        ];
        const runOrders = rootGetters['gameConfig/runOrders'];

        return getters.canExtendMeld &&
            rootGetters['trackers/derived/draw/hasDrawActionInCurrentTurn'] &&
            !rootGetters['trackers/derived/selected/hasNoHandCardsSelected'] &&
            !rootGetters['trackers/derived/selected/hasAllHandCardsSelected'] &&
            meldsService.doCardsMakeValidMeld(cards, runOrders);
    },
};

export default {
    namespaced: true,
    getters,
};
