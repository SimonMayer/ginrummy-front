const getters = {
    canStartMatch(state, getters, rootState, rootGetters) {
        const match = rootGetters['sessionState/derived/match/match'];
        const playerCount = rootGetters['sessionState/derived/players/playerCount'];

        return match &&
            match.create_time &&
            rootGetters['sessionState/derived/players/selfPlayerMatchData'] &&
            playerCount >= rootGetters['storage/gameConfig/minPlayers'] &&
            playerCount <= rootGetters['storage/gameConfig/maxPlayers'] &&
            !match.start_time;
    },
    canAddPlayerToMatch(state, getters, rootState, rootGetters) {
        const match = rootGetters['sessionState/derived/match/match'];

        return match &&
            !match.start_time &&
            rootGetters['sessionState/derived/players/playerCount'] < rootGetters['storage/gameConfig/maxPlayers'];
    },
};

export default {
    namespaced: true,
    getters,
};
