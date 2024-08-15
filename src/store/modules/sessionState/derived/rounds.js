const getters = {
    currentRoundId(state, getters, rootState, rootGetters) {
        const matchId = rootGetters['sessionState/matchIdentifier/getMatchId'];
        return matchId ? rootGetters['storage/registry/matchRounds/getCurrentRoundIdByMatchId'](matchId) : null;
    },
    latestRoundId(state, getters, rootState, rootGetters) {
        const matchId = rootGetters['sessionState/matchIdentifier/getMatchId'];
        return matchId ? rootGetters['storage/registry/matchRounds/getLatestRoundIdByMatchId'](matchId) : null;
    },
    visibleRoundId(state, getters, rootState, rootGetters) {
        // quite likely to eventually be set as its own property. For now, just use the latest round ID.

        const matchId = rootGetters['sessionState/matchIdentifier/getMatchId'];
        return matchId ? rootGetters['storage/registry/matchRounds/getLatestRoundIdByMatchId'](matchId) : null;
    },
    isVisibleRoundCurrent(state, getters) {
        return getters.visibleRoundId === getters.currentRoundId;
    },
};

export default {
    namespaced: true,
    getters,
};
