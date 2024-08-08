const state = {
    currentRoundIds: {},
};

const mutations = {
    SET_CURRENT_ROUND_ID(state, { matchId, roundId }) {
        state.currentRoundIds = { ...state.currentRoundIds, [matchId]: roundId };
    },
    CLEAR_CURRENT_ROUND_ID(state, matchId) {
        state.currentRoundIds = { ...state.currentRoundIds, [matchId]: null };
    },
};

const actions = {
    setCurrentRoundId({ commit, dispatch }, { matchId, roundId }) {
        if (!roundId) {
            commit('CLEAR_CURRENT_ROUND_ID', matchId);
            return;
        }
        commit('SET_CURRENT_ROUND_ID', { matchId, roundId });
        dispatch('rounds/fetchDiscardPile', { roundId }, { root: true });
        dispatch('rounds/fetchStockPileData', { roundId }, { root: true });
        dispatch('rounds/fetchMelds', { roundId }, { root: true });
    },
};

const getters = {
    getCurrentRoundIdByMatchId: (state) => (matchId) => state.currentRoundIds[matchId],
    getDiscardPileByMatchId: (state, getters, rootState, rootGetters) => (matchId) => {
        const roundId = getters.getCurrentRoundIdByMatchId(matchId);
        return rootGetters['rounds/getDiscardPileByRoundId'](roundId);
    },
    getStockPileSizeByMatchId: (state, getters, rootState, rootGetters) => (matchId) => {
        const roundId = getters.getCurrentRoundIdByMatchId(matchId);
        return rootGetters['rounds/getStockPileSizeByRoundId'](roundId);
    },
    getMeldsByMatchId: (state, getters, rootState, rootGetters) => (matchId) => {
        const roundId = getters.getCurrentRoundIdByMatchId(matchId);
        return rootGetters['rounds/getMeldsByRoundId'](roundId);
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
