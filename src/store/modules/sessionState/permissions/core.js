const getters = {
    isCurrentUserTurn(state, getters, rootState, rootGetters) {
        const signedInUserId = rootGetters['authentication/user/userId'];
        const currentTurn = rootGetters['sessionState/derived/turn/currentTurn'];

        return currentTurn && currentTurn.userId === signedInUserId;
    },
    canAct(state, getters, rootState, rootGetters) {
        const isLoading = rootGetters['sessionState/loading/loading'];
        const isVisibleRoundCurrent = rootGetters['sessionState/derived/rounds/isVisibleRoundCurrent'];
        return getters.isCurrentUserTurn && isVisibleRoundCurrent && !isLoading;
    },
};

export default {
    namespaced: true,
    getters,
};
