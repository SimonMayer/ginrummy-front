import matchesService from '@/services/matchesService';

const FETCH_PLAYERS_MATCH_DATA_TIMEOUT = 24 * 60 * 60 * 1000;

const state = {
    playersMatchData: {},
};

const mutations = {
    SET_PLAYERS_MATCH_DATA(state, { matchId, players }) {
        state.playersMatchData = {
            ...state.playersMatchData,
            [matchId]: players,
        };
    },
};

const actions = {
    async fetchPlayersMatchData({ dispatch, commit }, { matchId, forceFetch = false }) {
        const key = `playersMatchData_${matchId}`;
        const shouldFetch = await dispatch('trackers/fetch/shouldFetch', { key, timeout: FETCH_PLAYERS_MATCH_DATA_TIMEOUT, forceFetch }, { root: true });

        if (!shouldFetch) {
            return;
        }

        dispatch('trackers/loading/setLoading', true, { root: true });
        dispatch('trackers/fetch/recordAttempt', key, { root: true });
        try {
            const playersData = await matchesService.getPlayers(matchId);
            commit('SET_PLAYERS_MATCH_DATA', { matchId, players: playersData });
            dispatch('trackers/fetch/recordSuccess', key, { root: true });
        } catch (error) {
            dispatch('error/setError', { title: 'Failed to fetch match players!', error }, { root: true });
            dispatch('trackers/fetch/recordFail', key, { root: true });
        } finally {
            dispatch('trackers/loading/setLoading', false, { root: true });
        }
    },
};

const getters = {
    getPlayersMatchDataByMatchId: state => matchId => state.playersMatchData[matchId] || [],
    getPlayerMatchDataByMatchAndPlayerIds: state => ({ matchId, playerId }) => {
        return state.playersMatchData[matchId]?.find(player => player.user_id === playerId);
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
