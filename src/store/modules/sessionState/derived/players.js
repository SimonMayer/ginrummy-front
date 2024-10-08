const getters = {
    playersMatchData(state, getters, rootState, rootGetters) {
        const matchId = rootGetters['sessionState/matchIdentifier/matchId'];
        return rootGetters['storage/players/matchData/getPlayersMatchDataByMatchId'](matchId);
    },
    playerCount(state, getters) {
        return getters.playersMatchData.length;
    },
    nonSelfPlayersMatchData(state, getters, rootState, rootGetters) {
        const matchId = rootGetters['sessionState/matchIdentifier/matchId'];
        return rootGetters['storage/players/nonSelf/getNonSelfPlayersMatchDataByMatchId'](matchId);
    },
    selfPlayerMatchData(state, getters, rootState, rootGetters) {
        const matchId = rootGetters['sessionState/matchIdentifier/matchId'];
        return rootGetters['storage/players/self/getSelfPlayerMatchDataByMatchId'](matchId) || null;
    },
    currentSelfPlayerRoundData(state, getters, rootState, rootGetters) {
        const roundId = rootGetters['sessionState/derived/rounds/currentRoundId'];
        return rootGetters['storage/players/self/getSelfPlayerRoundDataByRoundId'](roundId) || null;
    },
    currentSelfHasPlayedMeld(state, getters) {
        const selfPlayerCurrentRoundData = getters.currentSelfPlayerRoundData;
        return selfPlayerCurrentRoundData && selfPlayerCurrentRoundData.melds && selfPlayerCurrentRoundData.melds.length > 0;
    },
    visibleSelfPlayerRoundData(state, getters, rootState, rootGetters) {
        const roundId = rootGetters['sessionState/derived/rounds/visibleRoundId'];
        return rootGetters['storage/players/self/getSelfPlayerRoundDataByRoundId'](roundId) || null;
    },
};

export default {
    namespaced: true,
    getters,
};
