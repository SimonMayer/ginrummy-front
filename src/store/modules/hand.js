import roundsService from '@/services/roundsService';

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
    async fetchMyHand({ commit, rootGetters }) {
        const currentRoundId = rootGetters['currentRound/currentRoundId'];
        if (!currentRoundId) {
            commit('SET_MY_HAND', []);
            return;
        }

        commit('loading/SET_LOADING', true, { root: true });
        try {
            const data = await roundsService.getMyHand(currentRoundId);
            commit('SET_MY_HAND', data.cards);
        } catch (error) {
            commit('error/SET_ERROR', { title: 'Failed to fetch your hand!', error }, { root: true });
        } finally {
            commit('loading/SET_LOADING', false, { root: true });
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
