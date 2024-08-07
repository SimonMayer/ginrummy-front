import cardsService from '@/services/cardsService';

const FETCH_CARD_TIMEOUT = 365 * 24 * 60 * 60 * 1000;

const state = {
    cards: {}
};

function generateKey(cardId) {
    return `card_${cardId}`;
}

function validateCard(card) {
    return typeof card.card_id === 'number' &&
        typeof card.point_value === 'number' &&
        typeof card.rank === 'string' &&
        typeof card.suit === 'string';
}

const mutations = {
    ADD_CARD(state, card) {
        state.cards = { ...state.cards, [card.card_id]: card };
    },
};

const actions = {
    async fetchCard({ dispatch }, { cardId, forceFetch = false }) {
        const key = generateKey(cardId);
        const shouldFetch = await dispatch('fetchStatus/shouldFetch', { key, timeout: FETCH_CARD_TIMEOUT, forceFetch }, { root: true });

        if (!shouldFetch) {
            return;
        }

        dispatch('loading/setLoading', true, { root: true });
        dispatch('fetchStatus/recordFetchAttempt', key, { root: true });
        try {
            const card = await cardsService.getCard(cardId);
            dispatch('addCard', card);
        } catch (error) {
            dispatch('error/setError', { title: 'Failed to fetch card!', error }, { root: true });
            dispatch('fetchStatus/recordFailedFetch', key, { root: true });
        } finally {
            dispatch('loading/setLoading', false, { root: true });
        }
    },
    addCards({ dispatch }, cards) {
        cards.forEach(card => {
            dispatch('addCard', card);
        });
    },
    addCard({ commit, dispatch }, card) {
        if (!validateCard(card)) {
            console.error('Invalid card:', card);
            return;
        }
        commit('ADD_CARD', card);

        const key = generateKey(card.card_id);
        dispatch('fetchStatus/recordSuccessfulFetch', key, { root: true });
    },
};

const getters = {
    getCardById: (state) => (cardId) => {
        return state.cards[cardId];
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
};
