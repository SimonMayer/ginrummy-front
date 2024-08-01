import { createStore } from 'vuex';

const store = createStore({
    state: {
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
        }
    },
    getters: {
        loading: state => state.loading,
        errorTitle: state => state.errorTitle,
        error: state => state.error,
        config: state => state.config,
    }
});

export default store;
