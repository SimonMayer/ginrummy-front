import cardsService from '@/services/cardsService';

const FETCH_CARD_TIMEOUT = 365 * 24 * 60 * 60 * 1000;

const state = {
    cards: {},
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
        state.cards = {...state.cards, [card.card_id]: card};
    },
};

const actions = {
    async fetchCard({dispatch}, {cardId, forceFetch = false}) {
        await dispatch(
            'fetchHandler/handleFetch',
            {
                errorTitle: 'Failed to fetch card!',
                forceFetch,
                key: generateKey(cardId),
                fetchFunction: () => cardsService.getCard(cardId),
                onSuccess: async (card) => {
                    dispatch('addCard', card);
                },
                timeout: FETCH_CARD_TIMEOUT,
            },
            {root: true},
        );
    },
    addCards({dispatch}, cards) {
        cards.forEach(card => {
            dispatch('addCard', card);
        });
    },
    addCard({commit, dispatch}, card) {
        if (!validateCard(card)) {
            console.error('Invalid card:', card);
            return;
        }
        commit('ADD_CARD', card);

        const key = generateKey(card.card_id);
        dispatch('trackers/fetch/recordSuccess', key, {root: true});
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
    getters,
};
