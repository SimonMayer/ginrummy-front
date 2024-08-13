const getters = {
    currentTurn(state, getters, rootState, rootGetters) {
        const currentRoundId = rootGetters['trackers/derived/rounds/getCurrentRoundId'];
        return rootGetters['registry/roundTurn/getCurrentTurnByRoundId'](currentRoundId);
    },
    currentTurnId(state, getters, rootState, rootGetters) {
        const currentRoundId = rootGetters['trackers/derived/rounds/getCurrentRoundId'];
        return rootGetters['registry/roundTurn/getCurrentTurnIdByRoundId'](currentRoundId);
    },
};

export default {
    namespaced: true,
    getters,
};
