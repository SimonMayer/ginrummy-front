import roundsService from '@/services/roundsService';

const FETCH_STOCK_PILE_TIMEOUT = 30 * 1000;

const state = {
    stockPileSizes: {},
};

const mutations = {
    SET_STOCK_PILE_SIZE(state, {roundId, size}) {
        state.stockPileSizes[roundId] = size;
    },
};

const actions = {
    async fetchStockPileData({commit, dispatch}, {roundId, forceFetch = false}) {
        await dispatch(
            'fetchHandler/handleFetch',
            {
                errorTitle: 'Failed to fetch stock pile data!',
                forceFetch,
                key: `stockPileSize_${roundId}`,
                fetchFunction: () => roundsService.getStockPileData(roundId),
                onSuccess: async (stockPileData) => {
                    commit('SET_STOCK_PILE_SIZE', {roundId, size: stockPileData.size});
                },
                timeout: FETCH_STOCK_PILE_TIMEOUT,
            },
            {root: true},
        );
    },
    removeTopDiscardPileCard({commit}, roundId) {
        commit('REMOVE_TOP_DISCARD_PILE_CARD', roundId);
    },
};

const getters = {
    getStockPileSizeByRoundId: (state) => (roundId) => state.stockPileSizes[roundId] || 0,
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
