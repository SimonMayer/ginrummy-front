const getters = {
    privateCurrentRoundId(state, getters, rootState, rootGetters) {
        return rootGetters['trackers/matchPhase/getCurrentRoundId'];
    },
    privateCurrentTurn(state, getters, rootState, rootGetters) {
        const currentRoundId = getters.privateCurrentRoundId;
        return rootGetters['registry/roundTurn/getCurrentTurnByRoundId'](currentRoundId);
    },
    isCurrentUserTurn(state, getters, rootState, rootGetters) {
        const signedInUserId = rootGetters['auth/user/userId'];
        const currentTurn = getters.privateCurrentTurn;

        return currentTurn && currentTurn.userId === signedInUserId;
    },
    canAct(state, getters, rootState, rootGetters) {
        const isLoading = rootGetters['trackers/loading/loading'];
        const isVisibleRoundCurrent = rootGetters['trackers/matchPhase/isVisibleRoundCurrent'];
        return getters.isCurrentUserTurn && isVisibleRoundCurrent && !isLoading;
    }
};

export default {
    namespaced: true,
    getters,
};
