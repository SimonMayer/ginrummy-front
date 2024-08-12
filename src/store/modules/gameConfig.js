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
        const key = 'gameConfig';
        const shouldFetch = await dispatch('trackers/fetch/shouldFetch', { key, timeout: FETCH_GAME_CONFIG_TIMEOUT, forceFetch }, { root: true });

        if (!shouldFetch) {
            return;
        }

        dispatch('trackers/loading/setLoading', true, { root: true });
        dispatch('trackers/fetch/recordAttempt', key, { root: true });
        try {
            const configData = await configService.getGameConfig();
            commit('SET_GAME_CONFIG', {
                allowMeldsFromRotation: configData.allowMeldsFromRotation,
                minimumMeldSize: configData.minimumMeldSize,
                runOrders: configData.runOrders,
                minPlayers: configData.players.minimumAllowed,
                maxPlayers: configData.players.maximumAllowed,
            });
            dispatch('trackers/fetch/recordSuccess', key, { root: true });
        } catch (error) {
            dispatch('error/setError', { title: 'Failed to fetch game configuration!', error }, { root: true });
            dispatch('trackers/fetch/recordFail', key, { root: true });
        } finally {
            dispatch('trackers/loading/setLoading', false, { root: true });
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
