const state = {
    latestActionIds: {},
};

const mutations = {
    SET_LATEST_ACTION_ID(state, {matchId, actionId}) {
        const currentLatestActionId = state.latestActionIds[matchId];
        if (!currentLatestActionId || actionId > currentLatestActionId) {
            state.latestActionIds = {...state.latestActionIds, [matchId]: actionId};
        }
    },
};

const actions = {
    setLatestActionId({commit}, {matchId, actionId}) {
        commit('SET_LATEST_ACTION_ID', {matchId, actionId});
    },
};

const getters = {
    getLatestActionIdByMatchId: state => matchId => state.latestActionIds[matchId],
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
