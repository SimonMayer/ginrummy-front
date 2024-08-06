import roundsService from '@/services/roundsService';
const FETCH_DISCARD_PILE_TIMEOUT = 30 * 1000;
const FETCH_STOCK_PILE_TIMEOUT = 30 * 1000;

const state = {
    currentRounds: {},
};

function createRound(id) {
    return {
        id: id,
        discardPile: [],
        stockPileSize: 52,
    };
}

const mutations = {
    SET_CURRENT_ROUND(state, { matchId, roundId }) {
        state.currentRounds = {
            ...state.currentRounds,
            [matchId]: createRound(roundId),
        };
    },
    CLEAR_CURRENT_ROUND(state, matchId) {
        state.currentRounds = {
            ...state.currentRounds,
            [matchId]: createRound(null),
        };
    },
    SET_DISCARD_PILE(state, { matchId, discardPile }) {
        if (state.currentRounds[matchId]) {
            state.currentRounds[matchId].discardPile = discardPile;
        }
    },
    REMOVE_TOP_DISCARD_PILE_CARD(state, { matchId,  }) {
        if (state.currentRounds[matchId]) {
            state.currentRounds[matchId].discardPile.pop();
        }
    },
    SET_STOCK_PILE_SIZE(state, { matchId, size }) {
        if (state.currentRounds[matchId]) {
            state.currentRounds[matchId].stockPileSize = size;
        }
    },
};

const actions = {
    setCurrentRoundId({ commit, dispatch }, { matchId, roundId }) {
        if (!roundId) {
            commit('CLEAR_CURRENT_ROUND', matchId);
            return;
        }
        const currentRound = state.currentRounds[matchId];
        const instantiateNewRound = (!currentRound || !currentRound.id || roundId > currentRound.id)
        if (instantiateNewRound) {
            commit('SET_CURRENT_ROUND', { matchId, roundId });
            dispatch('fetchDiscardPile', { matchId });
            dispatch('fetchStockPileData', { matchId });
        }
    },
    async fetchDiscardPile({ commit, dispatch }, { matchId, forceFetch = false }) {
        const currentRound = state.currentRounds[matchId];
        const roundId = currentRound?.id;

        if(!roundId) {
            return;
        }

        const key = `discardPile_${roundId}`;
        const shouldFetch = await dispatch('fetchStatus/shouldFetch', { key, timeout: FETCH_DISCARD_PILE_TIMEOUT, forceFetch }, { root: true });

        if (!shouldFetch) {
            return;
        }

        dispatch('loading/setLoading', true, { root: true });
        dispatch('fetchStatus/recordFetchAttempt', key, { root: true });
        try {
            const discardPile = await roundsService.getDiscardPileList(roundId);
            commit('SET_DISCARD_PILE', { matchId, discardPile });
            dispatch('fetchStatus/recordSuccessfulFetch', key, { root: true });
        } catch (error) {
            dispatch('error/setError', { title: 'Failed to fetch discard pile!', error }, { root: true });
            dispatch('fetchStatus/recordFailedFetch', key, { root: true });
        } finally {
            dispatch('loading/setLoading', false, { root: true });
        }
    },
    async fetchStockPileData({ commit, dispatch }, { matchId, forceFetch = false }) {
        const currentRound = state.currentRounds[matchId];
        const roundId = currentRound?.id;

        if(!roundId) {
            return;
        }

        const key = `stockPileSize_${roundId}`;
        const shouldFetch = await dispatch('fetchStatus/shouldFetch', { key, timeout: FETCH_STOCK_PILE_TIMEOUT, forceFetch }, { root: true });

        if (!shouldFetch) {
            return;
        }

        dispatch('loading/setLoading', true, { root: true });
        dispatch('fetchStatus/recordFetchAttempt', key, { root: true });
        try {
            const stockPileData = await roundsService.getStockPileData(roundId);
            commit('SET_STOCK_PILE_SIZE', { matchId, size: stockPileData.size });
            dispatch('fetchStatus/recordSuccessfulFetch', key, { root: true });
        } catch (error) {
            dispatch('error/setError', { title: 'Failed to fetch stock pile data!', error }, { root: true });
            dispatch('fetchStatus/recordFailedFetch', key, { root: true });
        } finally {
            dispatch('loading/setLoading', false, { root: true });
        }
    },
    removeTopDiscardPileCard({ commit }, { matchId }) {
        commit('REMOVE_TOP_DISCARD_PILE_CARD', { matchId });
    },
};

const getters = {
    getCurrentRoundByMatchId: state => matchId => state.currentRounds[matchId],
    getCurrentRoundIdByMatchId: state => matchId => state.currentRounds[matchId]?.id,
    getDiscardPileByMatchId: state => matchId => state.currentRounds[matchId]?.discardPile,
    getStockPileSizeByMatchId: state => matchId => state.currentRounds[matchId]?.stockPileSize,
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
