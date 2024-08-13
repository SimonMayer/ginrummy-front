import SSEService from '@/services/sseService';

const state = {
    sseServices: {},
};

const mutations = {
    SET_SSE_SERVICE(state, {matchId, sseService}) {
        state.sseServices = {...state.sseServices, [matchId]: sseService};
    },
    REMOVE_SSE_SERVICE(state, matchId) {
        delete state.sseServices[matchId];
    },
    CLEAR_ALL_SSE_SERVICES(state) {
        state.sseServices = {};
    },
};

const actions = {
    async initializeSSE({commit, dispatch, rootGetters}, matchId) {
        const latestActionId = rootGetters['registry/matchAction/getLatestActionIdByMatchId'](matchId) || '';
        const endpoint = `/matches/${matchId}/events`;
        const params = {latest_action_id: latestActionId};

        try {
            const sseService = new SSEService(endpoint, params);
            commit('SET_SSE_SERVICE', {matchId, sseService});

            sseService.connect(
                async (data) => {
                    dispatch('sse/dataProcessor/processSSEData', {data, matchId}, {root: true});
                },
                (error) => {
                    console.error('SSE error:', error);
                },
            );
        } catch (error) {
            console.error('Failed to initialize SSE:', error);
        }
    },

    async cleanupSSE({commit, state}, matchId) {
        const sseService = state.sseServices[matchId];
        if (sseService) {
            sseService.disconnect();
            commit('REMOVE_SSE_SERVICE', matchId);
        }
    },

    async cleanupAllSSE({commit, state}) {
        Object.values(state.sseServices).forEach(sseService => {
            if (sseService) {
                sseService.disconnect();
            }
        });
        commit('CLEAR_ALL_SSE_SERVICES');
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
};
