const getters = {
    isCurrentUserTurn(state, getters, rootState, rootGetters) {
        const currentTurn = rootGetters['sessionState/derived/turn/currentTurn'];

        return currentTurn && currentTurn.userId === rootGetters['authentication/user/userId'];
    },
    canAct(state, getters, rootState, rootGetters) {
        return getters.isCurrentUserTurn &&
            rootGetters['sessionState/derived/rounds/isVisibleRoundCurrent'] &&
            !rootGetters['sessionState/indicators/loading/isLoading'];
    },
};

export default {
    namespaced: true,
    getters,
};
