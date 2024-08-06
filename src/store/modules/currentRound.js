const state = {
    currentRounds: {},
};

const mutations = {
    SET_CURRENT_ROUND_ID(state, { matchId, roundId }) {
        const currentRound = state.currentRounds[matchId];
        if (!currentRound || !currentRound.id || roundId > currentRound.id) {
            state.currentRounds = {
                ...state.currentRounds,
                [matchId]: { id: roundId },
            };
        }
    },
    CLEAR_CURRENT_ROUND(state, matchId) {
        state.currentRounds = {
            ...state.currentRounds,
            [matchId]: { id: null },
        };
    },
};

const actions = {
    setCurrentRoundId({ commit }, { matchId, roundId }) {
        if (!roundId) {
            commit('CLEAR_CURRENT_ROUND', matchId);
        } else {
            commit('SET_CURRENT_ROUND_ID', { matchId, roundId });
        }
    },
};

const getters = {
    getCurrentRoundByMatchId: state => matchId => state.currentRounds[matchId],
    getCurrentRoundIdByMatchId: state => matchId => state.currentRounds[matchId]?.id,
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
