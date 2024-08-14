const getters = {
    currentSelfPlayerRoundData(state, getters, rootState, rootGetters) {
        const currentRoundId = rootGetters['trackers/derived/rounds/currentRoundId'];
        return rootGetters['players/self/getSelfPlayerRoundDataByRoundId'](currentRoundId) || null;
    },
    hasPlayedMeld(state, getters) {
        const selfPlayerCurrentRoundData = getters.currentSelfPlayerRoundData;
        return selfPlayerCurrentRoundData && selfPlayerCurrentRoundData.melds && selfPlayerCurrentRoundData.melds.length > 0;
    },
};

export default {
    namespaced: true,
    getters,
};
