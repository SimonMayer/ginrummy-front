const getters = {
    selectedHandCardIds(state, getters, rootState, rootGetters) {
        const handId = rootGetters['trackers/derived/hand/getCurrentHandId'];
        return handId ? rootGetters['hands/getSelectedCardIdsByHandId'](handId) : [];
    },
    selectedHandCards(state, getters, rootState, rootGetters) {
        const handId = rootGetters['trackers/derived/hand/getCurrentHandId'];
        return handId ? rootGetters['hands/getSelectedCardsByHandId'](handId) : [];
    },
    selectedHandCardCount(state, getters) {
        return getters.selectedHandCardIds.length;
    },
    hasNoHandCardsSelected(state, getters) {
        return getters.selectedHandCardCount === 0;
    },
    hasOneHandCardSelected(state, getters) {
        return getters.selectedHandCardCount === 1;
    },
    hasAllHandCardsSelected(state, getters, rootState, rootGetters) {
        const handCardIds = rootGetters['trackers/derived/hand/getCurrentHandCardIds'];
        return getters.selectedHandCardCount === handCardIds.length;
    },
};

export default {
    namespaced: true,
    getters,
};
