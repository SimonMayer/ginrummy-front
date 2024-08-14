const getters = {
    isCurrentUserTurn(state, getters, rootState, rootGetters) {
        const signedInUserId = rootGetters['auth/user/userId'];
        const currentTurn = rootGetters['trackers/derived/turns/currentTurn'];

        return currentTurn && currentTurn.userId === signedInUserId;
    },
    canAct(state, getters, rootState, rootGetters) {
        const isLoading = rootGetters['trackers/loading/loading'];
        const isVisibleRoundCurrent = rootGetters['trackers/derived/rounds/isVisibleRoundCurrent'];
        return getters.isCurrentUserTurn && isVisibleRoundCurrent && !isLoading;
    },
};

export default {
    namespaced: true,
    getters,
};
