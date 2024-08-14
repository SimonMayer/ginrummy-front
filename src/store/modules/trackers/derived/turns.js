const getters = {
    currentTurn(state, getters, rootState, rootGetters) {
        const currentRoundId = rootGetters['trackers/derived/rounds/currentRoundId'];
        return rootGetters['registry/roundTurn/getCurrentTurnByRoundId'](currentRoundId);
    },
    currentTurnId(state, getters, rootState, rootGetters) {
        const currentRoundId = rootGetters['trackers/derived/rounds/currentRoundId'];
        return rootGetters['registry/roundTurn/getCurrentTurnIdByRoundId'](currentRoundId);
    },
    currentRotationNumber(state, getters) {
        const currentTurn = getters.currentTurn;
        return currentTurn?.rotationNumber || null;
    },
};

export default {
    namespaced: true,
    getters,
};
