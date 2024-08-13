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
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
