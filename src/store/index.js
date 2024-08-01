import { createStore } from 'vuex';

const store = createStore({
    state: {
        loading: false
    },
    mutations: {
        SET_LOADING(state, payload) {
            state.loading = payload;
        }
    },
    actions: {
        setLoading({ commit }, payload) {
            commit('SET_LOADING', payload);
        }
    },
    getters: {
        loading: state => state.loading
    }
});

export default store;
