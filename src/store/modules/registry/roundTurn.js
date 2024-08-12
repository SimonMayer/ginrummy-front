import roundsService from "@/services/roundsService";

const FETCH_CURRENT_TURN_TIMEOUT = 0;

const state = {
    currentTurnIds: {},
};

const mutations = {
    SET_CURRENT_TURN_ID(state, { roundId, turnId }) {
        state.currentTurnIds = { ...state.currentTurnIds, [roundId]: turnId };
    },
    CLEAR_CURRENT_TURN_ID(state, roundId) {
        state.currentTurnIds = { ...state.currentTurnIds, [roundId]: null };
    },
};

const actions = {
    async fetchCurrentTurn({ commit, dispatch }, { roundId, matchId, forceFetch = false }) {
        if (!roundId) {
            commit('CLEAR_CURRENT_TURN_ID', roundId);
            return;
        }

        const key = `currentTurn_${roundId}`;
        const shouldFetch = await dispatch('trackers/fetch/shouldFetch', { key, timeout: FETCH_CURRENT_TURN_TIMEOUT, forceFetch }, { root: true });

        if (!shouldFetch) {
            return;
        }

        dispatch('trackers/loading/setLoading', true, { root: true });
        dispatch('trackers/fetch/recordAttempt', key, { root: true });
        try {
            const data = await roundsService.getCurrentTurn(roundId);
            await dispatch('setCurrentTurnId', { roundId: roundId, 'turnId': data.turn_id })
            await dispatch('registry/matchAction/setLatestActionId', { matchId, actionId: data.latest_action_id }, { root:true })
            dispatch('trackers/fetch/recordSuccess', key, { root: true });
        } catch (error) {
            dispatch('error/setError', { title: 'Failed to fetch current turn!', error }, { root: true });
            dispatch('trackers/fetch/recordFail', key, { root: true });
        } finally {
            dispatch('trackers/loading/setLoading', false, { root: true });
        }
    },
    setCurrentTurnId({ commit, dispatch }, { roundId, turnId }) {
        dispatch('turns/fetchTurn', { turnId }, { root: true });
        commit('SET_CURRENT_TURN_ID', { roundId, turnId });
    },
};

const getters = {
    getCurrentTurnIdByRoundId: (state) => (roundId) => state.currentTurnIds[roundId],
    getCurrentTurnByRoundId: (state, getters, rootState, rootGetters) => (roundId) => {
        const turnId = getters.getCurrentTurnIdByRoundId(roundId);
        if (!turnId) {
            return null;
        }
        return rootGetters['turns/getTurnById'](turnId);
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
