const getters = {
    currentHand(state, getters, rootState, rootGetters) {
        const currentRoundId = rootGetters['trackers/derived/rounds/currentRoundId'];
        const selfPlayerData = rootGetters['players/self/getSelfPlayerRoundDataByRoundId'](currentRoundId);
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
};

export default {
    namespaced: true,
    getters,
};
