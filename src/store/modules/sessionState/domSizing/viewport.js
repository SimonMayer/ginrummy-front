const state = {
    innerHeight: null,
    innerWidth: null,
};

const mutations = {
    SET_INNER_HEIGHT(state, innerHeight) {
        state.innerHeight = innerHeight;
    },
    SET_INNER_WIDTH(state, innerWidth) {
        state.innerWidth = innerWidth;
    },
};

const actions = {
    updateDimensions({commit}) {
        const innerHeight = window.innerHeight;
        const innerWidth = window.innerWidth;

        commit('SET_INNER_HEIGHT', innerHeight);
        commit('SET_INNER_WIDTH', innerWidth);

        return {innerHeight, innerWidth};
    },
};

const getters = {
    innerHeight: state => state.innerHeight,
    innerWidth: state => state.innerWidth,
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
