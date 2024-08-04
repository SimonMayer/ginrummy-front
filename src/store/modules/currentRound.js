const state = {
    currentRoundId: null,
};

const mutations = {
    SET_CURRENT_ROUND_ID(state, roundId) {
        state.currentRoundId = roundId;
    },
};

const actions = {
    setRoundId({ commit }, roundId) {
        commit('SET_CURRENT_ROUND_ID', roundId);
    },
};

const getters = {
    currentRoundId: state => state.currentRoundId,
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
