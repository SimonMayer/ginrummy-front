const getters = {
    getCurrentHand(state, getters, rootState, rootGetters) {
        const currentRoundId = rootGetters['trackers/derived/rounds/getCurrentRoundId'];
        const selfPlayerData = rootGetters['players/self/getSelfPlayerRoundDataByRoundId'](currentRoundId);
        return selfPlayerData?.hand || null;
    },
    getCurrentHandId(state, getters) {
        const hand = getters.getCurrentHand;
        return hand?.hand_id || null;
    },
    getCurrentHandCardIds(state, getters, rootState, rootGetters) {
        const handId = getters.getCurrentHandId;
        return handId ? rootGetters['hands/getCardIdsByHandId'](handId) : [];
    },
};

export default {
    namespaced: true,
    getters,
};
