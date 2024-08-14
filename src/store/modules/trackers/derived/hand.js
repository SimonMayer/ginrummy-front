const getters = {
    currentHand(state, getters, rootState, rootGetters) {
        const selfPlayerData = rootGetters['trackers/derived/self/currentSelfPlayerRoundData'];
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
    currentHandCardLength(state, getters) {
        return getters.currentHandCardIds.length;
    },
};

export default {
    namespaced: true,
    getters,
};
