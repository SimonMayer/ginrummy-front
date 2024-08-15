const getters = {
    hasDrawActionInCurrentTurn(state, getters, rootState, rootGetters) {
        const currentTurnId = rootGetters['sessionState/derived/turns/currentTurnId'];
        return rootGetters['storage/turns/actions/hasDrawAction'](currentTurnId);
    },
};

export default {
    namespaced: true,
    getters,
};
