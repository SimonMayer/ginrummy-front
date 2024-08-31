const getters = {
    currentMelds(state, getters, rootState, rootGetters) {
        const roundId = rootGetters['sessionState/derived/rounds/currentRoundId'];
        return rootGetters['storage/rounds/melds/getMeldsByRoundId'](roundId) || [];
    },
    visibleMelds(state, getters, rootState, rootGetters) {
        const roundId = rootGetters['sessionState/derived/rounds/visibleRoundId'];
        return rootGetters['storage/rounds/melds/getMeldsByRoundId'](roundId) || [];
    },
    visibleMeldsCardCount(state, getters) {
        return getters.visibleMelds.reduce(
            (sum, meld) => sum + (meld.cardIds?.length || 0),
            0,
        );
    },
};

export default {
    namespaced: true,
    getters,
};
