const getters = {
    canDraw(state, getters, rootState, rootGetters) {
        if (!rootGetters['trackers/permissions/core/canAct']) {
            return false;
        }
        return !rootGetters['trackers/derived/draw/hasDrawActionInCurrentTurn'];
    },
};

export default {
    namespaced: true,
    getters,
};
