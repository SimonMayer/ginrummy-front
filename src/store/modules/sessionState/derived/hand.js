const getters = {
    currentHand(state, getters, rootState, rootGetters) {
        const selfPlayerData = rootGetters['sessionState/derived/players/currentSelfPlayerRoundData'];
        return selfPlayerData?.hand || null;
    },
    currentHandId(state, getters) {
        const hand = getters.currentHand;
        return hand?.hand_id || null;
    },
    currentHandCardIds(state, getters, rootState, rootGetters) {
        const handId = getters.currentHandId;
        return handId ? rootGetters['storage/hands/getCardIdsByHandId'](handId) : [];
    },
    currentHandCards(state, getters, rootState, rootGetters) {
        return getters.currentHandCardIds.map(cardId => rootGetters['storage/cards/cards/getCardById'](cardId));
    },
    currentHandCardLength(state, getters) {
        return getters.currentHandCardIds.length;
    },
    visibleHand(state, getters, rootState, rootGetters) {
        const selfPlayerData = rootGetters['sessionState/derived/players/visibleSelfPlayerRoundData'];
        return selfPlayerData?.hand || null;
    },
    visibleHandId(state, getters) {
        const hand = getters.visibleHand;
        return hand?.hand_id || null;
    },
    visibleHandCardIds(state, getters, rootState, rootGetters) {
        const handId = getters.visibleHandId;
        return handId ? rootGetters['storage/hands/getCardIdsByHandId'](handId) : [];
    },
    visibleHandCards(state, getters, rootState, rootGetters) {
        return getters.visibleHandCardIds.map(cardId => rootGetters['storage/cards/cards/getCardById'](cardId));
    },
};

export default {
    namespaced: true,
    getters,
};
