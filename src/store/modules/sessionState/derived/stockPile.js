const getters = {
    currentStockPileSize(state, getters, rootState, rootGetters) {
        const currentRoundId = rootGetters['sessionState/derived/rounds/currentRoundId'];
        return rootGetters['storage/rounds/stockPiles/getStockPileSizeByRoundId'](currentRoundId);
    },
    visibleStockPileSize(state, getters, rootState, rootGetters) {
        const visibleRoundId = rootGetters['sessionState/derived/rounds/visibleRoundId'];
        return rootGetters['storage/rounds/stockPiles/getStockPileSizeByRoundId'](visibleRoundId);
    },
};

export default {
    namespaced: true,
    getters,
};
