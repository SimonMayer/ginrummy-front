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
        await dispatch(
            'fetchHandler/handleFetch',
            {
                errorTitle: 'Failed to fetch discard pile!',
                forceFetch,
                key: `discardPile_${roundId}`,
                fetchFunction: () => roundsService.getDiscardPileList(roundId),
                onSuccess: async (discardPile) => {
                    await dispatch('cards/cards/addCards', discardPile, { root: true });
                    commit('SET_DISCARD_PILE_CARD_IDS', { roundId, discardPile });
                },
                timeout: FETCH_DISCARD_PILE_TIMEOUT,
            },
            { root: true }
        );
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
