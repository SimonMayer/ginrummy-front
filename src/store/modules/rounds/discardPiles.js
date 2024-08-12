import roundsService from '@/services/roundsService';

const FETCH_DISCARD_PILE_TIMEOUT = 30 * 1000;

const state = {
    discardPileCardIds: {},
};

const mutations = {
    SET_DISCARD_PILE_CARD_IDS(state, { roundId, discardPile }) {
        state.discardPileCardIds[roundId] = discardPile.map(card => card.card_id);
    },
    REMOVE_TOP_DISCARD_PILE_CARD(state, roundId) {
        if (state.discardPileCardIds[roundId]) {
            state.discardPileCardIds[roundId].pop();
        }
    },
};

const actions = {
    async fetchDiscardPile({ commit, dispatch }, { roundId, forceFetch = false }) {
        const key = `discardPile_${roundId}`;
        const shouldFetch = await dispatch('trackers/fetch/shouldFetch', { key, timeout: FETCH_DISCARD_PILE_TIMEOUT, forceFetch }, { root: true });

        if (!shouldFetch) {
            return;
        }

        dispatch('trackers/loading/setLoading', true, { root: true });
        dispatch('trackers/fetch/recordAttempt', key, { root: true });
        try {
            const discardPile = await roundsService.getDiscardPileList(roundId);
            await dispatch('cards/cards/addCards', discardPile, { root: true });
            commit('SET_DISCARD_PILE_CARD_IDS', { roundId, discardPile });
            dispatch('trackers/fetch/recordSuccess', key, { root: true });
        } catch (error) {
            dispatch('error/setError', { title: 'Failed to fetch discard pile!', error }, { root: true });
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
    getDiscardPileByRoundId: (state, getters, rootState, rootGetters) => (roundId) => {
        const discardPileCardIds = state.discardPileCardIds[roundId] || [];
        return discardPileCardIds.map(id => rootGetters['cards/cards/getCardById'](id));
    },
    getSelectedDiscardPileCardIdsByRoundId: (state, getters, rootState, rootGetters) => (roundId) => {
        const discardPileCardIds = state.discardPileCardIds[roundId] || [];
        const selectedCardIds = rootGetters['cards/selections/getSelectedCardIds'];

        return discardPileCardIds.filter(cardId => selectedCardIds.includes(cardId))
    },
    getSelectedDiscardPileCardsByRoundId: (state, getters, rootState, rootGetters) => (roundId) => {
        return getters.getSelectedDiscardPileCardIdsByRoundId(roundId)
            .map(cardId => rootGetters['cards/cards/getCardById'](cardId));
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
