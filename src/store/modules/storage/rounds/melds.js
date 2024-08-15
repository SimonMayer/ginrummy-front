import roundsService from '@/services/roundsService';

const FETCH_MELDS_TIMEOUT = 5 * 60 * 1000;

const state = {
    meldIds: {},
    melds: {},
};

function validateMeld(meld) {
    return typeof meld.meld_id === 'number' &&
        (meld.meld_type === 'set' || meld.meld_type === 'run') &&
        Array.isArray(meld.cardIds) &&
        meld.cardIds.every(id => typeof id === 'number');
}

const mutations = {
    ADD_MELD(state, meld) {
        state.melds = {...state.melds, [meld.meld_id]: meld};
    },
    ADD_CARD_TO_MELD(state, {meldId, cardId}) {
        const meld = state.melds[meldId];
        if (meld && !meld.cardIds.includes(cardId)) {
            meld.cardIds.push(cardId);
        }
    },
    SET_MELD_IDS(state, {roundId, meldIds}) {
        state.meldIds[roundId] = meldIds;
    },
};

const actions = {
    addMeldWithCards({commit, dispatch}, meld) {
        const cardIds = meld.cards.map(card => card.card_id);
        const newMeld = {
            meld_id: meld.meld_id,
            meld_type: meld.meld_type,
            cardIds,
        };

        if (!validateMeld(newMeld)) {
            console.error('Invalid meld:', newMeld);
            return;
        }

        commit('ADD_MELD', newMeld);
        for (const card of meld.cards) {
            dispatch('storage/cards/cards/addCard', card, {root: true});
        }
    },
    async addMeldWithCardIds({commit, dispatch}, meld) {
        if (!validateMeld(meld)) {
            console.error('Invalid meld:', meld);
            return;
        }

        commit('ADD_MELD', meld);
        const cardResponses = [];
        for (const cardId of meld.cardIds) {
            cardResponses.push(await dispatch('storage/cards/cards/fetchCard', {cardId}, {root: true}));
        }
        return cardResponses;
    },
    addCardToMeld({commit, dispatch, state}, {meldId, card}) {
        const meld = state.melds[meldId];
        if (!meld) {
            console.error('Meld not found:', meldId);
            return;
        }
        if (!meld.cardIds.includes(card.card_id)) {
            commit('ADD_CARD_TO_MELD', {meldId, cardId: card.card_id});
            dispatch('storage/cards/cards/addCard', card, {root: true});
        }
    },
    async fetchMelds({commit, dispatch}, {roundId, forceFetch = false}) {
        return await dispatch(
            'utils/fetchHandler/handleFetch',
            {
                errorTitle: 'Failed to fetch melds!',
                forceFetch,
                key: `melds_${roundId}`,
                fetchFunction: () => roundsService.getMelds(roundId),
                onSuccess: async (melds) => {
                    await melds.forEach(meld => {
                        dispatch('addMeldWithCards', meld);
                    });
                    commit('SET_MELD_IDS', {roundId, meldIds: melds.map(meld => meld.meld_id)});
                    return melds;
                },
                timeout: FETCH_MELDS_TIMEOUT,
            },
            {root: true},
        );
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
            cards: meld.cardIds.map(id => rootGetters['storage/cards/cards/getCardById'](id)),
        };
    },
    getMeldsByRoundId: (state, getters) => (roundId) => {
        const meldIds = state.meldIds[roundId] || [];
        return meldIds.map(id => getters['getMeldById'](id));
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
