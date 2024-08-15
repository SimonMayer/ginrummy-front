const getters = {
    currentHand(state, getters, rootState, rootGetters) {
        const selfPlayerData = rootGetters['trackers/derived/players/currentSelfPlayerRoundData'];
        return selfPlayerData?.hand || null;
    },
    currentHandId(state, getters) {
        const hand = getters.currentHand;
        return hand?.hand_id || null;
    },
    currentHandCardIds(state, getters, rootState, rootGetters) {
        const handId = getters.currentHandId;
        return handId ? rootGetters['hands/getCardIdsByHandId'](handId) : [];
    },
    currentHandCards(state, getters, rootState, rootGetters) {
        return getters.currentHandCardIds.map(cardId => rootGetters['cards/cards/getCardById'](cardId));
    },
    currentHandCardLength(state, getters) {
        return getters.currentHandCardIds.length;
    },
};

export default {
    namespaced: true,
    getters,
};
