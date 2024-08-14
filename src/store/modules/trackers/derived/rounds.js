const getters = {
    currentRoundId(state, getters, rootState, rootGetters) {
        const matchId = rootGetters['trackers/matchPhase/getMatchId'];
        return matchId ? rootGetters['registry/matchRound/getCurrentRoundIdByMatchId'](matchId) : null;
    },
    latestRoundId(state, getters, rootState, rootGetters) {
        const matchId = rootGetters['trackers/matchPhase/getMatchId'];
        return matchId ? rootGetters['registry/matchRound/getLatestRoundIdByMatchId'](matchId) : null;
    },
    visibleRoundId(state, getters, rootState, rootGetters) {
        // quite likely to eventually be set as its own property. For now, just use the latest round ID.

        const matchId = rootGetters['trackers/matchPhase/getMatchId'];
        return matchId ? rootGetters['registry/matchRound/getLatestRoundIdByMatchId'](matchId) : null;
    },
    isVisibleRoundCurrent(state, getters) {
        return getters.visibleRoundId === getters.currentRoundId;
    },
};

export default {
    namespaced: true,
    getters,
};
