const getters = {
    match(state, getters, rootState, rootGetters) {
        const matchId = rootGetters['sessionState/matchIdentifier/matchId'];
        return rootGetters['storage/matches/matches/getMatchById'](matchId);
    },
    hasStarted(state, getters) {
        return !!getters.match.start_time;
    },
};

export default {
    namespaced: true,
    getters,
};
