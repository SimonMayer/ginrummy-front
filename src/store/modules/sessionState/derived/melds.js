const getters = {
    currentMelds(state, getters, rootState, rootGetters) {
        const roundId = rootGetters['sessionState/derived/rounds/currentRoundId'];
        return rootGetters['storage/rounds/melds/getMeldsByRoundId'](roundId) || [];
    },
    visibleMelds(state, getters, rootState, rootGetters) {
        const roundId = rootGetters['sessionState/derived/rounds/visibleRoundId'];
        return rootGetters['storage/rounds/melds/getMeldsByRoundId'](roundId) || [];
    },
};

export default {
    namespaced: true,
    getters,
};
