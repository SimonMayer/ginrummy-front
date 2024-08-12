import roundsService from '@/services/roundsService';

const FETCH_STOCK_PILE_TIMEOUT = 30 * 1000;

const state = {
    stockPileSizes: {},
};

const mutations = {
    SET_STOCK_PILE_SIZE(state, { roundId, size }) {
        state.stockPileSizes[roundId] = size;
    },
};

const actions = {
    async fetchStockPileData({ commit, dispatch }, { roundId, forceFetch = false }) {
        const key = `stockPileSize_${roundId}`;
        const shouldFetch = await dispatch('trackers/fetch/shouldFetch', { key, timeout: FETCH_STOCK_PILE_TIMEOUT, forceFetch }, { root: true });

        if (!shouldFetch) {
            return;
        }

        dispatch('trackers/loading/setLoading', true, { root: true });
        dispatch('trackers/fetch/recordAttempt', key, { root: true });
        try {
            const stockPileData = await roundsService.getStockPileData(roundId);
            commit('SET_STOCK_PILE_SIZE', { roundId, size: stockPileData.size });
            dispatch('trackers/fetch/recordSuccess', key, { root: true });
        } catch (error) {
            dispatch('error/setError', { title: 'Failed to fetch stock pile data!', error }, { root: true });
            dispatch('trackers/fetch/recordFail', key, { root: true });
        } finally {
            dispatch('trackers/loading/setLoading', false, { root: true });
        }
    },
    removeTopDiscardPileCard({ commit }, roundId) {
        commit('REMOVE_TOP_DISCARD_PILE_CARD', roundId);
    },
};

const getters = {
    getStockPileSizeByRoundId: (state) => (roundId) => state.stockPileSizes[roundId],
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
