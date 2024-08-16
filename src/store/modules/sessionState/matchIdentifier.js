const state = {
    matchId: null,
};

const mutations = {
    SET_MATCH_ID(state, matchId) {
        state.matchId = matchId;
    },
};

const actions = {
    async initializeMatchId({commit, dispatch}, route) {
        const matchId = parseInt(route.params.id, 10);
        commit('SET_MATCH_ID', matchId);
        return await dispatch('storage/matches/matches/fetchMatch', {matchId}, {root: true});
    },
};

const getters = {
    matchId: (state) => state.matchId,
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
