const getters = {
    match(state, getters, rootState, rootGetters) {
        const matchId = rootGetters['sessionState/matchIdentifier/matchId'];
        return rootGetters['storage/matches/matches/getMatchById'](matchId);
    },
};

export default {
    namespaced: true,
    getters,
};
