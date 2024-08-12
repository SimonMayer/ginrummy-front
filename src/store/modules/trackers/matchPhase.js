const state = {
    matchId: null,
};

const mutations = {
    SET_MATCH_ID(state, matchId) {
        state.matchId = matchId;
    },
};

const actions = {
    initializeMatchId({ commit }, route) {
        const matchId = parseInt(route.params.id, 10);
        commit('SET_MATCH_ID', matchId);
    },
};

const getters = {
    getMatchId: (state) => state.matchId,
    getCurrentRoundId(state, getters, rootState, rootGetters) {
        return state.matchId ? rootGetters['registry/matchRound/getCurrentRoundIdByMatchId'](state.matchId) : null;
    },
    getLatestRoundId(state, getters, rootState, rootGetters) {
        return state.matchId ? rootGetters['registry/matchRound/getLatestRoundIdByMatchId'](state.matchId) : null;
    },
    getVisibleRoundId(state, getters, rootState, rootGetters) {
        // quite likely to eventually be set as its own property. For now, just latest round ID
        return state.matchId ? rootGetters['registry/matchRound/getLatestRoundIdByMatchId'](state.matchId) : null;
    },
    isVisibleRoundCurrent(state, getters) {
        return getters.getVisibleRoundId === getters.getCurrentRoundId;
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
