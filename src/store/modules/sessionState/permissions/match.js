const getters = {
    canStartMatch(state, getters, rootState, rootGetters) {
        const match = rootGetters['sessionState/derived/match/match'];
        const playerCount = rootGetters['sessionState/derived/players/playerCount'];

        return match &&
            rootGetters['sessionState/derived/players/selfPlayerMatchData'] &&
            playerCount >= rootGetters['storage/gameConfig/minPlayers'] &&
            playerCount <= rootGetters['storage/gameConfig/maxPlayers'] &&
            !rootGetters['sessionState/derived/match/hasStarted'];
    },
    canAddPlayerToMatch(state, getters, rootState, rootGetters) {
        const match = rootGetters['sessionState/derived/match/match'];

        return match &&
            !rootGetters['sessionState/derived/match/hasStarted'] &&
            rootGetters['sessionState/derived/players/playerCount'] < rootGetters['storage/gameConfig/maxPlayers'];
    },
};

export default {
    namespaced: true,
    getters,
};
