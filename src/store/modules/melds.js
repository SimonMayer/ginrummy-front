const state = {
    melds: {}
};

function validateMeld(meld) {
    return typeof meld.meld_id === 'number' &&
        (meld.meld_type === 'set' || meld.meld_type === 'run') &&
        Array.isArray(meld.cardIds) &&
        meld.cardIds.every(id => typeof id === 'number');
}

const mutations = {
    ADD_MELD(state, meld) {
        state.melds = { ...state.melds, [meld.meld_id]: meld };
    },
    ADD_CARD_TO_MELD(state, { meldId, cardId }) {
        const meld = state.melds[meldId];
        if (meld && !meld.cardIds.includes(cardId)) {
            meld.cardIds.push(cardId);
        }
    },
};

const actions = {
    addMeldWithCards({ commit, dispatch }, meld) {
        const cardIds = meld.cards.map(card => card.card_id);
        const newMeld = {
            meld_id: meld.meld_id,
            meld_type: meld.meld_type,
            cardIds
        };

        if (!validateMeld(newMeld)) {
            console.error('Invalid meld:', newMeld);
            return;
        }

        commit('ADD_MELD', newMeld);
        for (const card of meld.cards) {
            dispatch('cards/addCard', card, { root: true });
        }
    },
    async addMeldWithCardIds({ commit, dispatch }, meld) {
        if (!validateMeld(meld)) {
            console.error('Invalid meld:', meld);
            return;
        }

        commit('ADD_MELD', meld);
        for (const cardId of meld.cardIds) {
            await dispatch('cards/fetchCard', { cardId }, { root: true });
        }
    },
    addCardToMeld({ commit, dispatch, state }, { meldId, card }) {
        const meld = state.melds[meldId];
        if (!meld) {
            console.error('Meld not found:', meldId);
            return;
        }
        if (!meld.cardIds.includes(card.card_id)) {
            commit('ADD_CARD_TO_MELD', { meldId, cardId: card.card_id });
            dispatch('cards/addCard', card, { root: true });
        }
    },
};

const getters = {
    getMeldById: (state, getters, rootState, rootGetters) => (meldId) => {
        const meld = state.melds[meldId];
        if (!meld) {
            return null;
        }
        return {
            ...meld,
            cards: meld.cardIds.map(id => rootGetters['cards/getCardById'](id)),
        };
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
};
