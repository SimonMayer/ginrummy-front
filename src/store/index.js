import { createStore } from 'vuex';
import router from '@/router';
import matchesService from '@/services/matchesService';

const store = createStore({
    state: {
        isAuthenticated: !!localStorage.getItem('rest_access_token'),
        loading: false,
        errorTitle: '',
        error: null,
        config: {
            runOrders: [],
            allowMeldsFromRotation: 0,
            minimumMeldSize: 0,
            minPlayers: 0,
            maxPlayers: 0,
        },
        matches: [],
        match: null,
        matchPlayers: []
    },
    mutations: {
        SET_AUTHENTICATED(state, payload) {
            state.isAuthenticated = payload;
        },
        SET_LOADING(state, payload) {
            state.loading = payload;
        },
        SET_ERROR(state, { title, error }) {
            state.errorTitle = title;
            state.error = error;
        },
        CLEAR_ERROR(state) {
            state.errorTitle = '';
            state.error = null;
        },
        SET_CONFIG(state, config) {
            state.config = config;
        },
        SET_MATCHES(state, matches) {
            state.matches = matches;
        },
        SET_MATCH(state, match) {
            state.match = match;
        },
        SET_MATCH_PLAYERS(state, players) {
            state.matchPlayers = players;
        }
    },
    actions: {
        setAuthenticated({ commit }, payload) {
            commit('SET_AUTHENTICATED', payload);
        },
        setLoading({ commit }, payload) {
            commit('SET_LOADING', payload);
        },
        setError({ commit }, error) {
            commit('SET_ERROR', error);
        },
        clearError({ commit }) {
            commit('CLEAR_ERROR');
        },
        setConfig({ commit }, config) {
            commit('SET_CONFIG', config);
        },
        async fetchMatches({ commit }) {
            commit('SET_LOADING', true);
            try {
                const matchesData = await matchesService.getMatches();
                commit('SET_MATCHES', matchesData);
            } catch (error) {
                commit('SET_ERROR', { title: 'Failed to fetch matches', error: error });
            } finally {
                commit('SET_LOADING', false);
            }
        },
        async fetchMatch({ commit }, matchId) {
            commit('SET_LOADING', true);
            try {
                const match = await matchesService.getMatchDetails(matchId);
                commit('SET_MATCH', match);
            } catch (error) {
                commit('SET_ERROR', { title: 'Failed to fetch match details', error: error });
            } finally {
                commit('SET_LOADING', false);
            }
        },
        async fetchMatchPlayers({ commit }, matchId) {
            commit('SET_LOADING', true);
            try {
                const matchPlayersData = await matchesService.getPlayers(matchId);
                commit('SET_MATCH_PLAYERS', matchPlayersData);
            } catch (error) {
                commit('SET_ERROR', { title: 'Failed to fetch match players', error: error });
            } finally {
                commit('SET_LOADING', false);
            }
        },
        signOut({ commit }) {
            localStorage.removeItem('rest_access_token');
            localStorage.removeItem('sse_access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user_id');
            commit('SET_AUTHENTICATED', false);
            router.push('/');
        }
    },
    getters: {
        isAuthenticated: state => state.isAuthenticated,
        loading: state => state.loading,
        errorTitle: state => state.errorTitle,
        error: state => state.error,
        config: state => state.config,
        matches: state => state.matches,
        match: state => state.match,
        matchPlayers: state => state.matchPlayers,
    }
});

export default store;
