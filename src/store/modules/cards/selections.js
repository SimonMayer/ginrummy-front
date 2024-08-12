const state = {
    selectedCardIds: [],
};

const mutations = {
    ADD_SELECTED_CARD(state, cardId) {
        if (!state.selectedCardIds.includes(cardId)) {
            state.selectedCardIds.push(cardId);
        }
    },
    REMOVE_SELECTED_CARD(state, cardId) {
        state.selectedCardIds = state.selectedCardIds.filter(id => id !== cardId);
    },
    UNSELECT_ALL_CARDS(state) {
        state.selectedCardIds = [];
    },
};

const actions = {
    addSelectedCard({ commit }, cardId) {
        commit('ADD_SELECTED_CARD', cardId);
    },
    removeSelectedCard({ commit }, cardId) {
        commit('REMOVE_SELECTED_CARD', cardId);
    },
    toggleSelectedCard({ dispatch, getters }, cardId) {
        if (getters.isCardSelected(cardId)) {
            dispatch('removeSelectedCard', cardId);
        } else {
            dispatch('addSelectedCard', cardId);
        }
    },
    unselectAllCards({ commit }) {
        commit('UNSELECT_ALL_CARDS');
    },
};

const getters = {
    isCardSelected: (state) => (cardId) => {
        return state.selectedCardIds.includes(cardId);
    },
    getSelectedCardIds: (state) => {
        return state.selectedCardIds;
    },
    getSelectedCards: (state, getters, rootState, rootGetters) => {
        return state.selectedCardIds.map(id => rootGetters['cards/cards/getCardById'](id));
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
