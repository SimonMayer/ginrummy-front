const state = {
    supportsTouch: false,
};

const mutations = {
    SET_TOUCH_SUPPORT(state, supportsTouch) {
        state.supportsTouch = supportsTouch;
    },
};

const actions = {
    detectTouchSupport({commit}) {
        const supportsTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        commit('SET_TOUCH_SUPPORT', supportsTouch);
    },
};

const getters = {
    supportsTouch: state => state.supportsTouch,
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
