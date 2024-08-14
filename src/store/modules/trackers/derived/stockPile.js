const getters = {
    currentStockPileSize(state, getters, rootState, rootGetters) {
        const currentRoundId = rootGetters['trackers/derived/rounds/currentRoundId'];
        return rootGetters['rounds/stockPiles/getStockPileSizeByRoundId'](currentRoundId);
    },
    visibleStockPileSize(state, getters, rootState, rootGetters) {
        const visibleRoundId = rootGetters['trackers/derived/rounds/visibleRoundId'];
        return rootGetters['rounds/stockPiles/getStockPileSizeByRoundId'](visibleRoundId);
    },
};

export default {
    namespaced: true,
    getters,
};
