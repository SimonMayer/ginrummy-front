import roundsService from '@/services/roundsService';

const FETCH_MY_HAND_TIMEOUT = 60 * 1000;

const state = {
    myHand: [],
};

const mutations = {
    SET_MY_HAND(state, hand) {
        state.myHand = hand;
    },
    APPEND_CARDS_TO_MY_HAND(state, cards) {
        state.myHand.push(...cards);
    },
    REMOVE_CARDS_FROM_MY_HAND(state, cardIds) {
        state.myHand = state.myHand.filter(card => !cardIds.includes(card.card_id));
    },
};

const actions = {
    async fetchMyHand({ commit, dispatch, rootGetters }, { forceFetch = false }) {
        const currentRoundId = rootGetters['currentRound/currentRoundId'];
        if (!currentRoundId) {
            commit('SET_MY_HAND', []);
            return;
        }

        const key = 'myHand';
        const shouldFetch = await dispatch('fetchStatus/shouldFetch', { key, timeout: FETCH_MY_HAND_TIMEOUT, forceFetch }, { root: true });

        if (!shouldFetch) {
            return;
        }

        dispatch('loading/setLoading', true, { root: true });
        dispatch('fetchStatus/recordFetchAttempt', key, { root: true });
        try {
            const data = await roundsService.getMyHand(currentRoundId);
            commit('SET_MY_HAND', data.cards);
            dispatch('fetchStatus/recordSuccessfulFetch', key, { root: true });
        } catch (error) {
            dispatch('error/setError', { title: 'Failed to fetch your hand!', error }, { root: true });
            dispatch('fetchStatus/recordFailedFetch', key, { root: true });
        } finally {
            dispatch('loading/setLoading', false, { root: true });
        }
    },
    appendCardsToMyHand({ commit }, cards) {
        commit('APPEND_CARDS_TO_MY_HAND', cards);
    },
    removeCardsFromMyHand({ commit }, cardIds) {
        commit('REMOVE_CARDS_FROM_MY_HAND', cardIds);
    },
};

const getters = {
    myHand: state => state.myHand,
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
