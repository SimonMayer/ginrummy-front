import roundsService from '@/services/roundsService';

const FETCH_DISCARD_PILE_TIMEOUT = 30 * 1000;
const FETCH_STOCK_PILE_TIMEOUT = 30 * 1000;
const FETCH_MELDS_TIMEOUT = 5 * 60 * 1000;

const state = {
    rounds: {},
};

function createRound(id) {
    return {
        id: id,
        discardPileCardIds: [],
        stockPileSize: 52,
        meldIds: [],
    };
}

const mutations = {
    ADD_ROUND(state, round) {
        state.rounds = { ...state.rounds, [round.id]: round };
    },
    SET_DISCARD_PILE_CARD_IDS(state, { roundId, discardPile }) {
        if (state.rounds[roundId]) {
            state.rounds[roundId].discardPileCardIds = discardPile.map(card => card.card_id);
        }
    },
    REMOVE_TOP_DISCARD_PILE_CARD(state, roundId) {
        if (state.rounds[roundId]) {
            state.rounds[roundId].discardPileCardIds.pop();
        }
    },
    SET_STOCK_PILE_SIZE(state, { roundId, size }) {
        if (state.rounds[roundId]) {
            state.rounds[roundId].stockPileSize = size;
        }
    },
    SET_MELD_IDS(state, { roundId, meldIds }) {
        if (state.rounds[roundId]) {
            state.rounds[roundId].meldIds = meldIds;
        }
    },
};

const actions = {
    async fetchDiscardPile({ state, commit, dispatch }, { roundId, forceFetch = false }) {
        if (!state.rounds[roundId]) {
            commit('ADD_ROUND', createRound(roundId));
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
            dispatch('cards/addCards', discardPile, { root: true });
            commit('SET_DISCARD_PILE_CARD_IDS', { roundId, discardPile });
            dispatch('fetchStatus/recordSuccessfulFetch', key, { root: true });
        } catch (error) {
            dispatch('error/setError', { title: 'Failed to fetch discard pile!', error }, { root: true });
            dispatch('fetchStatus/recordFailedFetch', key, { root: true });
        } finally {
            dispatch('loading/setLoading', false, { root: true });
        }
    },
    async fetchStockPileData({ state, commit, dispatch }, { roundId, forceFetch = false }) {
        if (!state.rounds[roundId]) {
            commit('ADD_ROUND', createRound(roundId));
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
            commit('SET_STOCK_PILE_SIZE', { roundId, size: stockPileData.size });
            dispatch('fetchStatus/recordSuccessfulFetch', key, { root: true });
        } catch (error) {
            dispatch('error/setError', { title: 'Failed to fetch stock pile data!', error }, { root: true });
            dispatch('fetchStatus/recordFailedFetch', key, { root: true });
        } finally {
            dispatch('loading/setLoading', false, { root: true });
        }
    },
    async fetchMelds({ state, commit, dispatch }, { roundId, forceFetch = false }) {
        if (!state.rounds[roundId]) {
            commit('ADD_ROUND', createRound(roundId));
        }

        const key = `melds_${roundId}`;
        const shouldFetch = await dispatch('fetchStatus/shouldFetch', { key, timeout: FETCH_MELDS_TIMEOUT, forceFetch: forceFetch }, { root: true });

        if (!shouldFetch) {
            return;
        }

        dispatch('loading/setLoading', true, { root: true });
        dispatch('fetchStatus/recordFetchAttempt', key, { root: true });
        try {
            const melds = await roundsService.getMelds(roundId);
            melds.forEach(meld => {
                dispatch('melds/addMeldWithCards', meld, { root: true });
            });
            commit('SET_MELD_IDS', { roundId, meldIds: melds.map(meld => meld.meld_id) });
            dispatch('fetchStatus/recordSuccessfulFetch', key, { root: true });
        } catch (error) {
            dispatch('error/setError', { title: 'Failed to fetch melds!', error }, { root: true });
            dispatch('fetchStatus/recordFailedFetch', key, { root: true });
        } finally {
            dispatch('loading/setLoading', false, { root: true });
        }
    },
    removeTopDiscardPileCard({ commit }, roundId) {
        commit('REMOVE_TOP_DISCARD_PILE_CARD', roundId);
    },
};

const getters = {
    getRoundById: (state) => (roundId) => {
        return state.rounds[roundId];
    },
    getDiscardPileByRoundId: (state, getters, rootState, rootGetters) => (roundId) => {
        const discardPileCardIds = state.rounds[roundId]?.discardPileCardIds || [];
        return discardPileCardIds.map(id => rootGetters['cards/getCardById'](id));
    },
    getStockPileSizeByRoundId: (state) => (roundId) => state.rounds[roundId]?.stockPileSize,
    getMeldsByRoundId: (state, getters, rootState, rootGetters) => (roundId) => {
        const meldIds = state.rounds[roundId]?.meldIds || [];
        return meldIds.map(id => rootGetters['melds/getMeldById'](id));
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
