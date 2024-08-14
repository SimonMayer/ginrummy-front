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
        await dispatch(
            'fetchHandler/handleFetch',
            {
                errorTitle: 'Failed to fetch current turn!',
                forceFetch,
                key: `currentTurn_${roundId}`,
                fetchFunction: () => roundsService.getCurrentTurn(roundId),
                onSuccess: async (data) => {
                    await dispatch('setCurrentTurnId', {roundId: roundId, 'turnId': data.turn_id});
                    await dispatch('registry/matchAction/setLatestActionId', {
                        matchId,
                        actionId: data.latest_action_id,
                    }, {root: true});
                },
                timeout: FETCH_CURRENT_TURN_TIMEOUT,
            },
            {root: true},
        );
    },
    setCurrentTurnId({commit, dispatch}, {roundId, turnId}) {
        dispatch('turns/turns/fetchTurn', {turnId}, {root: true});
        commit('SET_CURRENT_TURN_ID', {roundId, turnId});
    },
};

const getters = {
    getCurrentTurnIdByRoundId: (state) => (roundId) => state.currentTurnIds[roundId],
    getCurrentTurnByRoundId: (state, getters, rootState, rootGetters) => (roundId) => {
        const turnId = getters.getCurrentTurnIdByRoundId(roundId);
        if (!turnId) {
            return null;
        }
        return rootGetters['turns/turns/getTurnById'](turnId);
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
