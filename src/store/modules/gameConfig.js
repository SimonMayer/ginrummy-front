import configService from "@/services/configService";

const FETCH_GAME_CONFIG_TIMEOUT = 24 * 60 * 60 * 1000;

const state = {
    runOrders: [],
    allowMeldsFromRotation: 0,
    minimumMeldSize: 0,
    minPlayers: 0,
    maxPlayers: 0,
};

const mutations = {
    SET_GAME_CONFIG(state, gameConfig) {
        state.runOrders = gameConfig.runOrders;
        state.allowMeldsFromRotation = gameConfig.allowMeldsFromRotation;
        state.minimumMeldSize = gameConfig.minimumMeldSize;
        state.minPlayers = gameConfig.minPlayers;
        state.maxPlayers = gameConfig.maxPlayers;
    },
};

const actions = {
    async fetchGameConfig({ commit, dispatch }, { forceFetch = false }) {
        await dispatch(
            'fetchHandler/handleFetch',
            {
                errorTitle: 'Failed to fetch game configuration!',
                forceFetch,
                key: 'gameConfig',
                fetchFunction: () => configService.getGameConfig(),
                onSuccess: async (configData) => {
                    commit('SET_GAME_CONFIG', {
                        allowMeldsFromRotation: configData.allowMeldsFromRotation,
                        minimumMeldSize: configData.minimumMeldSize,
                        runOrders: configData.runOrders,
                        minPlayers: configData.players.minimumAllowed,
                        maxPlayers: configData.players.maximumAllowed,
                    });
                },
                timeout: FETCH_GAME_CONFIG_TIMEOUT,
            },
            { root: true }
        );
    },
};

const getters = {
    gameConfig: state => state,
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
