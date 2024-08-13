const getters = {
    hasDrawActionInCurrentTurn(state, getters, rootState, rootGetters) {
        const currentTurnId = rootGetters['trackers/derived/turns/currentTurnId'];
        return rootGetters['turns/actions/hasDrawAction'](currentTurnId);
    },
};

export default {
    namespaced: true,
    getters,
};
