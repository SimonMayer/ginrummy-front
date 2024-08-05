import roundsService from '@/services/roundsService';

const FETCH_MY_HAND_TIMEOUT = 60 * 1000;

const state = {
    myHands: {},
};

const mutations = {
    SET_MY_HAND(state, { matchId, hand }) {
        state.myHands = {
            ...state.myHands,
            [matchId]: hand,
        };
    },
    APPEND_CARDS_TO_MY_HAND(state, { matchId, cards }) {
        state.myHands[matchId].push(...cards);
    },
    REMOVE_CARDS_FROM_MY_HAND(state, { matchId, cardIds }) {
        state.myHands[matchId] = state.myHands[matchId].filter(card => !cardIds.includes(card.card_id));
    },
};

const actions = {
    async fetchMyHand({ commit, dispatch, rootGetters }, { matchId, forceFetch = false }) {
        const currentRoundId = rootGetters['currentRound/getCurrentRoundIdByMatchId'](matchId);
        if (!currentRoundId) {
            commit('SET_MY_HAND', { matchId, hand: [] });
            return;
        }

        const key = `myHand_${matchId}`;
        const shouldFetch = await dispatch('fetchStatus/shouldFetch', { key, timeout: FETCH_MY_HAND_TIMEOUT, forceFetch }, { root: true });

        if (!shouldFetch) {
            return;
        }

        dispatch('loading/setLoading', true, { root: true });
        dispatch('fetchStatus/recordFetchAttempt', key, { root: true });
        try {
            const data = await roundsService.getMyHand(currentRoundId);
            commit('SET_MY_HAND', { matchId, hand: data.cards });
            dispatch('fetchStatus/recordSuccessfulFetch', key, { root: true });
        } catch (error) {
            dispatch('error/setError', { title: 'Failed to fetch your hand!', error }, { root: true });
            dispatch('fetchStatus/recordFailedFetch', key, { root: true });
        } finally {
            dispatch('loading/setLoading', false, { root: true });
        }
    },
    appendCardsToMyHand({ commit }, { matchId, cards }) {
        commit('APPEND_CARDS_TO_MY_HAND', { matchId, cards });
    },
    removeCardsFromMyHand({ commit }, { matchId, cardIds }) {
        commit('REMOVE_CARDS_FROM_MY_HAND', { matchId, cardIds });
    },
};

const getters = {
    getMyHandByMatchId: state => matchId => state.myHands[matchId] || [],
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
