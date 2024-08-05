const state = {
    currentRoundIds: {},
};

const mutations = {
    SET_CURRENT_ROUND_ID(state, { matchId, roundId }) {
        state.currentRoundIds = {
            ...state.currentRoundIds,
            [matchId]: roundId,
        };
    },
};

const actions = {
    setCurrentRoundId({ commit }, { matchId, roundId }) {
        commit('SET_CURRENT_ROUND_ID', { matchId, roundId });
    },
};

const getters = {
    getCurrentRoundIdByMatchId: state => matchId => state.currentRoundIds[matchId],
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
