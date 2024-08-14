import handsService from '@/services/handsService';

const FETCH_HAND_TIMEOUT = 60 * 1000;

const state = {
    hands: {},
};

function validateHand(hand) {
    return typeof hand.hand_id === 'number' &&
        typeof hand.round_id === 'number' &&
        typeof hand.user_id === 'number' &&
        Array.isArray(hand.cardIds) &&
        hand.cardIds.every(id => typeof id === 'number');
}

const mutations = {
    ADD_HAND(state, hand) {
        state.hands = {
            ...state.hands,
            [hand.hand_id]: hand,
        };
    },
    ADD_CARD_ID_TO_HAND(state, {handId, cardId}) {
        const cardIds = state.hands[handId]?.cardIds || [];
        if (state.hands[handId] && !cardIds.includes(cardId)) {
            state.hands[handId].cardIds.push(cardId);
        }
    },
    REMOVE_CARD_IDS_FROM_HAND(state, {handId, cardIds}) {
        if (state.hands[handId]) {
            state.hands[handId].cardIds = state.hands[handId].cardIds.filter(id => !cardIds.includes(id));
        }
    },
};

const actions = {
    async fetchHand({dispatch}, {handId, forceFetch = false}) {
        await dispatch(
            'fetchHandler/handleFetch',
            {
                errorTitle: 'Failed to fetch hand!',
                forceFetch,
                key: `hands_${handId}`,
                fetchFunction: () => handsService.getHand(handId),
                onSuccess: async (hand) => {
                    await dispatch('addHandWithCards', hand);
                },
                timeout: FETCH_HAND_TIMEOUT,
            },
            {root: true},
        );

    },
    addHandWithCards({commit, dispatch}, hand) {
        const cardIds = hand.cards.map(card => card.card_id);
        const newHand = {
            hand_id: hand.hand_id,
            round_id: hand.round_id,
            user_id: hand.user_id,
            cardIds,
        };

        if (!validateHand(newHand)) {
            console.error('Invalid hand:', newHand);
            return;
        }

        commit('ADD_HAND', newHand);
        for (const card of hand.cards) {
            dispatch('cards/cards/addCard', card, {root: true});
        }
    },
    async addHandWithCardIds({commit, dispatch}, hand) {
        if (!validateHand(hand)) {
            console.error('Invalid hand:', hand);
            return;
        }
        commit('ADD_HAND', hand);

        for (const cardId of hand.cardIds) {
            await dispatch('cards/cards/fetchCard', {cardId}, {root: true});
        }
    },
    async addCardIdsToHand({commit, dispatch}, {handId, cardIds}) {
        for (const cardId of cardIds) {
            await dispatch('cards/cards/fetchCard', {cardId}, {root: true});
            commit('ADD_CARD_ID_TO_HAND', {handId, cardId});
        }
    },
    removeCardIdsFromHand({commit}, {handId, cardIds}) {
        commit('REMOVE_CARD_IDS_FROM_HAND', {handId, cardIds});
    },
};

const getters = {
    getCardIdsByHandId: (state) => (handId) => {
        return state.hands[handId]?.cardIds || [];
    },
    getCardsByHandId: (state, getters, rootState, rootGetters) => (handId) => {
        const cardIds = getters.getCardIdsByHandId(handId);
        return cardIds.map(id => rootGetters['cards/cards/getCardById'](id));
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
