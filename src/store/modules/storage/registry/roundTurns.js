import roundsService from '@/services/roundsService';

const FETCH_CURRENT_TURN_TIMEOUT = 0;

const state = {
    currentTurnIds: {},
};

const mutations = {
    SET_CURRENT_TURN_ID(state, {roundId, turnId}) {
        state.currentTurnIds = {...state.currentTurnIds, [roundId]: turnId};
    },
    CLEAR_CURRENT_TURN_ID(state, roundId) {
        state.currentTurnIds = {...state.currentTurnIds, [roundId]: null};
    },
};

const actions = {
    async fetchCurrentTurn({commit, dispatch}, {roundId, matchId, forceFetch = false}) {
        if (!roundId) {
            commit('CLEAR_CURRENT_TURN_ID', roundId);
            return;
        }
        return await dispatch(
            'utils/fetchHandler/handleFetch',
            {
                errorTitle: 'Failed to fetch current turn!',
                forceFetch,
                key: `currentTurn_${roundId}`,
                fetchFunction: () => roundsService.getCurrentTurn(roundId),
                onSuccess: async (data) => {
                    const response = await dispatch('setCurrentTurnId', {roundId: roundId, 'turnId': data.turn_id});
                    await dispatch('storage/registry/matchActions/setLatestActionId', {
                        matchId,
                        actionId: data.latest_action_id,
                    }, {root: true});

                    return response;
                },
                timeout: FETCH_CURRENT_TURN_TIMEOUT,
            },
            {root: true},
        );
    },
    async setCurrentTurnId({commit, dispatch}, {roundId, turnId}) {
        const response = await dispatch('storage/turns/turns/fetchTurn', {turnId}, {root: true});
        commit('SET_CURRENT_TURN_ID', {roundId, turnId});

        return response;
    },
};

const getters = {
    getCurrentTurnIdByRoundId: (state) => (roundId) => state.currentTurnIds[roundId],
    getCurrentTurnByRoundId: (state, getters, rootState, rootGetters) => (roundId) => {
        const turnId = getters.getCurrentTurnIdByRoundId(roundId);
        if (!turnId) {
            return null;
        }
        return rootGetters['storage/turns/turns/getTurnById'](turnId);
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
