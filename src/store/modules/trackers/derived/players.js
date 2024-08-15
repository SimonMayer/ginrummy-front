const getters = {
    playersMatchData(state, getters, rootState, rootGetters) {
        const matchId = rootGetters['trackers/matchPhase/getMatchId'];
        return rootGetters['players/match/getPlayersMatchDataByMatchId'](matchId) || null;
    },
    selfPlayerMatchData(state, getters, rootState, rootGetters) {
        const matchId = rootGetters['trackers/matchPhase/getMatchId'];
        return rootGetters['players/self/getSelfPlayerMatchDataByMatchId'](matchId) || null;
    },
    currentSelfPlayerRoundData(state, getters, rootState, rootGetters) {
        const roundId = rootGetters['trackers/derived/rounds/currentRoundId'];
        return rootGetters['players/self/getSelfPlayerRoundDataByRoundId'](roundId) || null;
    },
    currentSelfHasPlayedMeld(state, getters) {
        const selfPlayerCurrentRoundData = getters.currentSelfPlayerRoundData;
        return selfPlayerCurrentRoundData && selfPlayerCurrentRoundData.melds && selfPlayerCurrentRoundData.melds.length > 0;
    },
    visibleSelfPlayerRoundData(state, getters, rootState, rootGetters) {
        const roundId = rootGetters['trackers/derived/rounds/visibleRoundId'];
        return rootGetters['players/self/getSelfPlayerRoundDataByRoundId'](roundId) || null;
    },
};

export default {
    namespaced: true,
    getters,
};
