import { createStore } from 'vuex';
import router from '@/router';

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
        }
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
        signOut({ commit }) {
            // Clear authentication data
            localStorage.removeItem('rest_access_token');
            localStorage.removeItem('sse_access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user_id');
            commit('SET_AUTHENTICATED', false);
            // Redirect to login page
            router.push('/');
        }
    },
    getters: {
        isAuthenticated: state => state.isAuthenticated,
        loading: state => state.loading,
        errorTitle: state => state.errorTitle,
        error: state => state.error,
        config: state => state.config,
    }
});

export default store;
