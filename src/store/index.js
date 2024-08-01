import { createStore } from 'vuex';
import router from '@/router';
import matchesService from '@/services/matchesService';
import roundsService from '@/services/roundsService';

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
        currentTurn: {
            actions: [],
            userId: null,
            id: null,
            rotationNumber: null,
        },
        latestActionId: null,
        matches: [],
        match: null,
        matchPlayers: [],
        myHand: [],
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
        },
        UPDATE_PLAYERS_CURRENT_TURN(state, currentTurnUserId) {
            state.matchPlayers = state.matchPlayers.map(player => ({
                ...player,
                hasCurrentTurn: player.user_id === currentTurnUserId
            }));
        },
        SET_CURRENT_TURN(state, turn) {
            state.currentTurn = turn;
        },
        CLEAR_CURRENT_TURN(state) {
            state.currentTurn = {
                actions: [],
                userId: null,
                id: null,
                rotationNumber: null,
            };
        },
        APPEND_CURRENT_TURN_ACTION(state, action) {
            state.currentTurn.actions.push(action);
        },
        SET_LATEST_ACTION_ID(state, actionId) {
            state.latestActionId = actionId;
        },
        SET_MY_HAND(state, hand) {
            state.myHand = hand;
        },
        APPEND_CARDS_TO_MY_HAND(state, cards) {
            state.myHand.push(...cards);
        },
        REMOVE_CARDS_FROM_MY_HAND(state, cardIds) {
            state.myHand = state.myHand.filter(card => !cardIds.includes(card.card_id));
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
        async fetchMatchPlayers({ commit, state }, matchId) {
            commit('SET_LOADING', true);
            try {
                const matchPlayersData = await matchesService.getPlayers(matchId);
                commit('SET_MATCH_PLAYERS', matchPlayersData);
                commit('UPDATE_PLAYERS_CURRENT_TURN', state.currentTurn.userId);
            } catch (error) {
                commit('SET_ERROR', { title: 'Failed to fetch match players', error: error });
            } finally {
                commit('SET_LOADING', false);
            }
        },
        async fetchCurrentTurn({ commit, getters }) {
            const currentRoundId = getters.currentRoundId;
            if (!currentRoundId) {
                commit('CLEAR_CURRENT_TURN');
                commit('UPDATE_PLAYERS_CURRENT_TURN', null);
                return;
            }

            commit('SET_LOADING', true);
            try {
                const data = await roundsService.getCurrentTurn(currentRoundId);
                const turn = {
                    actions: data.actions || [],
                    userId: data.user_id,
                    id: data.turn_id,
                    rotationNumber: data.rotation_number,
                };
                commit('SET_CURRENT_TURN', turn);
                commit('UPDATE_PLAYERS_CURRENT_TURN', turn.userId);
                commit('SET_LATEST_ACTION_ID', data.latest_action_id);
            } catch (error) {
                commit('SET_ERROR', { title: 'Failed to fetch current turn', error: error });
            } finally {
                commit('SET_LOADING', false);
            }
        },
        clearCurrentTurn({ commit }) {
            commit('CLEAR_CURRENT_TURN');
        },
        appendCurrentTurnAction({ commit }, action) {
            commit('APPEND_CURRENT_TURN_ACTION', action);
        },
        setLatestActionId({ commit }, actionId) {
            commit('SET_LATEST_ACTION_ID', actionId);
        },
        signOut({ commit }) {
            localStorage.removeItem('rest_access_token');
            localStorage.removeItem('sse_access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user_id');
            commit('SET_AUTHENTICATED', false);
            router.push('/');
        },
        async fetchMyHand({ commit, getters }) {
            const currentRoundId = getters.currentRoundId;
            if (!currentRoundId) {
                commit('SET_MY_HAND', []);
                return;
            }

            commit('SET_LOADING', true);
            try {
                const data = await roundsService.getMyHand(currentRoundId);
                commit('SET_MY_HAND', data.cards);
            } catch (error) {
                commit('SET_ERROR', { title: 'Failed to fetch your hand!', error });
            } finally {
                commit('SET_LOADING', false);
            }
        },
        appendCardsToMyHand({ commit }, cards) {
            commit('APPEND_CARDS_TO_MY_HAND', cards);
        },
        removeCardsFromMyHand({ commit }, cardIds) {
            commit('REMOVE_CARDS_FROM_MY_HAND', cardIds);
        }
    },
    getters: {
        config: state => state.config,
        currentRoundId(state) {
            return state.match ? state.match.current_round_id : null;
        },
        currentTurn: state => state.currentTurn,
        error: state => state.error,
        errorTitle: state => state.errorTitle,
        isAuthenticated: state => state.isAuthenticated,
        latestActionId: state => state.latestActionId,
        loading: state => state.loading,
        match: state => state.match,
        matches: state => state.matches,
        matchPlayers: state => state.matchPlayers,
        getPlayerById: (state) => (id) => {
            return state.matchPlayers.find(player => player.user_id === id);
        },
        nonSelfPlayers: (state) => {
            const userId = parseInt(localStorage.getItem('user_id'), 10);
            return state.matchPlayers.filter(player => player.user_id !== userId);
        },
        selfPlayer: (state) => {
            const userId = parseInt(localStorage.getItem('user_id'), 10);
            return state.matchPlayers.find(player => player.user_id === userId);
        },
        myHand: state => state.myHand
    }
});

export default store;
