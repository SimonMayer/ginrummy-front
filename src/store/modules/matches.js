import matchesService from '@/services/matchesService';

const state = {
    matches: [],
    match: null,
};

const mutations = {
    SET_MATCHES(state, matches) {
        state.matches = matches;
    },
    SET_MATCH(state, match) {
        state.match = match;
    },
};

const actions = {
    async fetchMatches({ commit }) {
        commit('loading/SET_LOADING', true, { root: true });
        try {
            const matchesData = await matchesService.getMatches();
            commit('SET_MATCHES', matchesData);
        } catch (error) {
            commit('error/SET_ERROR', { title: 'Failed to fetch matches!', error }, { root: true });
        } finally {
            commit('loading/SET_LOADING', false, { root: true });
        }
    },
    async fetchMatch({ commit, dispatch }, matchId) {
        commit('loading/SET_LOADING', true, { root: true });
        try {
            const match = await matchesService.getMatchDetails(matchId);
            commit('SET_MATCH', match);
            dispatch('currentRound/setRoundId', match.current_round_id, { root: true });
        } catch (error) {
            commit('error/SET_ERROR', { title: 'Failed to fetch match details!', error }, { root: true });
        } finally {
            commit('loading/SET_LOADING', false, { root: true });
        }
    },
};

const getters = {
    matches: state => state.matches,
    match: state => state.match,
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
