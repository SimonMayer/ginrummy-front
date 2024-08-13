const getters = {
    getCurrentRoundId(state, getters, rootState, rootGetters) {
        const matchId = rootGetters['trackers/matchPhase/getMatchId'];
        return matchId ? rootGetters['registry/matchRound/getCurrentRoundIdByMatchId'](matchId) : null;
    },
    getLatestRoundId(state, getters, rootState, rootGetters) {
        const matchId = rootGetters['trackers/matchPhase/getMatchId'];
        return matchId ? rootGetters['registry/matchRound/getLatestRoundIdByMatchId'](matchId) : null;
    },
    getVisibleRoundId(state, getters, rootState, rootGetters) {
        // quite likely to eventually be set as its own property. For now, just use the latest round ID.

        const matchId = rootGetters['trackers/matchPhase/getMatchId'];
        return matchId ? rootGetters['registry/matchRound/getLatestRoundIdByMatchId'](matchId) : null;
    },
    isVisibleRoundCurrent(state, getters) {
        return getters.getVisibleRoundId === getters.getCurrentRoundId;
    },
};

export default {
    namespaced: true,
    getters,
};
