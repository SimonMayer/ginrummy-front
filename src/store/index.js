import { createStore } from 'vuex';

const store = createStore({
    state: {
        loading: false,
        errorTitle: '',
        error: null
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
        }
    },
    getters: {
        loading: state => state.loading,
        errorTitle: state => state.errorTitle,
        error: state => state.error
    }
});

export default store;
