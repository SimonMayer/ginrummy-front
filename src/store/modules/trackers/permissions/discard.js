const getters = {
    canDiscard(state, getters, rootState, rootGetters) {
        return rootGetters['trackers/permissions/core/canAct'] &&
            rootGetters['trackers/derived/draw/hasDrawActionInCurrentTurn'] &&
            !rootGetters['trackers/selections/selectedMeldId'] &&
            rootGetters['trackers/derived/selected/hasOneHandCardSelected'];
    },
};

export default {
    namespaced: true,
    getters,
};
