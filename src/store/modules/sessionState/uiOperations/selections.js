const state = {
    selectedCardIds: [],
    selectedMeldId: null,
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
    SET_SELECTED_MELD_ID(state, meldId) {
        state.selectedMeldId = meldId;
    },
    CLEAR_SELECTED_MELD_ID(state) {
        state.selectedMeldId = null;
    },
};

const actions = {
    addSelectedCard({commit}, cardId) {
        commit('ADD_SELECTED_CARD', cardId);
    },
    removeSelectedCard({commit}, cardId) {
        commit('REMOVE_SELECTED_CARD', cardId);
    },
    toggleSelectedCard({dispatch, getters}, cardId) {
        if (getters.isCardSelected(cardId)) {
            dispatch('removeSelectedCard', cardId);
        } else {
            dispatch('addSelectedCard', cardId);
        }
    },
    unselectAllCards({commit, dispatch}) {
        commit('UNSELECT_ALL_CARDS');
        dispatch('clearSelectedMeldId');
    },
    setSelectedMeldId({commit}, meldId) {
        commit('SET_SELECTED_MELD_ID', meldId);
    },
    clearSelectedMeldId({commit}) {
        commit('CLEAR_SELECTED_MELD_ID');
    },
    async toggleSelectedMeldId({dispatch, getters}, meldId) {
        if (getters.isMeldSelected(meldId)) {
            await dispatch('clearSelectedMeldId');
        } else {
            await dispatch('setSelectedMeldId', meldId);
        }
    },
};

const getters = {
    isCardSelected: (state) => (cardId) => {
        return state.selectedCardIds.includes(cardId);
    },
    isMeldSelected: (state) => (meldId) => {
        return state.selectedMeldId === meldId;
    },
    selectedMeldId(state) {
        return state.selectedMeldId;
    },
    getSelectedCardIds: (state) => {
        return state.selectedCardIds;
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
