const getters = {
    currentTurn(state, getters, rootState, rootGetters) {
        const currentRoundId = rootGetters['sessionState/derived/rounds/currentRoundId'];
        return rootGetters['storage/registry/roundTurns/getCurrentTurnByRoundId'](currentRoundId);
    },
    currentTurnId(state, getters, rootState, rootGetters) {
        const currentRoundId = rootGetters['sessionState/derived/rounds/currentRoundId'];
        return rootGetters['storage/registry/roundTurns/getCurrentTurnIdByRoundId'](currentRoundId);
    },
    currentRotationNumber(state, getters) {
        const currentTurn = getters.currentTurn;
        return currentTurn?.rotationNumber || null;
    },
    hasDrawActionInCurrentTurn(state, getters, rootState, rootGetters) {
        const currentTurnId = rootGetters['sessionState/derived/turn/currentTurnId'];
        return rootGetters['storage/turns/actions/hasDrawAction'](currentTurnId);
    },
};

export default {
    namespaced: true,
    getters,
};
