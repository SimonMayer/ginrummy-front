const getters = {
    canStartMatch(state, getters, rootState, rootGetters) {
        const match = rootGetters['sessionState/derived/match/match'];
        const players = rootGetters['sessionState/derived/players/playersMatchData'];

        return match &&
            match.create_time &&
            rootGetters['sessionState/derived/players/selfPlayerMatchData'] &&
            players.length >= rootGetters['storage/gameConfig/minPlayers'] &&
            players.length <= rootGetters['storage/gameConfig/maxPlayers'] &&
            !match.start_time;
    },
};

export default {
    namespaced: true,
    getters,
};
