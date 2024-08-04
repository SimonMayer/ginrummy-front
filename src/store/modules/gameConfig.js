import configService from "@/services/configService";

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
    async fetchGameConfig({ commit }) {
        commit('loading/SET_LOADING', true, { root: true });
        try {
            const configData = await configService.getGameConfig();
            commit('SET_GAME_CONFIG', {
                allowMeldsFromRotation: configData.allowMeldsFromRotation,
                minimumMeldSize: configData.minimumMeldSize,
                runOrders: configData.runOrders,
                minPlayers: configData.players.minimumAllowed,
                maxPlayers: configData.players.maximumAllowed,
            });
        } catch (error) {
            commit('error/SET_ERROR', { title: 'Failed to fetch game configuration!', error }, { root: true });
        } finally {
            commit('loading/SET_LOADING', false, { root: true });
        }
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
