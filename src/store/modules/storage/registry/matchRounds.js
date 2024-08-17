const state = {
    currentRoundIds: {},
    latestRoundIds: {},
    allRoundIds: {},
};

const mutations = {
    SET_CURRENT_ROUND_ID(state, {matchId, roundId}) {
        state.currentRoundIds = {...state.currentRoundIds, [matchId]: roundId};
    },
    CLEAR_CURRENT_ROUND_ID(state, matchId) {
        state.currentRoundIds = {...state.currentRoundIds, [matchId]: null};
    },
    SET_LATEST_ROUND_ID(state, {matchId, roundId}) {
        state.latestRoundIds = {...state.latestRoundIds, [matchId]: roundId};
    },
    SET_ALL_ROUND_IDS(state, {matchId, roundIds}) {
        state.allRoundIds = {...state.allRoundIds, [matchId]: roundIds};
    },
    ADD_TO_ALL_ROUND_IDS(state, {matchId, roundId}) {
        const roundIds = state.allRoundIds[matchId] || [];
        if (!roundIds.includes(roundId)) {
            state.allRoundIds = {...state.allRoundIds, [matchId]: [...roundIds, roundId]};
        }
    },
};

const actions = {
    async setCurrentRoundId({commit, dispatch}, {matchId, roundId}) {
        if (!roundId) {
            commit('CLEAR_CURRENT_ROUND_ID', matchId);
            return;
        }
        commit('SET_CURRENT_ROUND_ID', {matchId, roundId});
        commit('SET_LATEST_ROUND_ID', {matchId, roundId});
        commit('ADD_TO_ALL_ROUND_IDS', {matchId, roundId});
        const responses = {};
        responses.fetchDiscardPile = await dispatch(
            'storage/rounds/discardPiles/fetchDiscardPile',
            {roundId},
            {root: true},
        );
        responses.fetchStockPileData = await dispatch(
            'storage/rounds/stockPiles/fetchStockPileData',
            {roundId},
            {root: true},
        );
        responses.fetchMelds = await dispatch('storage/rounds/melds/fetchMelds', {roundId}, {root: true});
        responses.fetchPlayersRoundData = await dispatch(
            'storage/players/roundData/fetchPlayersRoundData',
            {roundId},
            {root: true},
        );
        responses.fetchCurrentTurn = await dispatch(
            'storage/registry/roundTurns/fetchCurrentTurn',
            {matchId, roundId},
            {root: true},
        );
        return responses;
    },
    async setLatestRoundId({commit, dispatch}, {matchId, roundId}) {
        commit('SET_LATEST_ROUND_ID', {matchId, roundId});
        if (!roundId) {
            return;
        }
        const responses = {};
        responses.fetchDiscardPile = await dispatch(
            'storage/rounds/discardPiles/fetchDiscardPile',
            {roundId},
            {root: true},
        );
        responses.fetchStockPileData = await dispatch(
            'storage/rounds/stockPiles/fetchStockPileData',
            {roundId},
            {root: true},
        );
        responses.fetchMelds = await dispatch('storage/rounds/melds/fetchMelds', {roundId}, {root: true});
        responses.fetchPlayersRoundData = await dispatch(
            'storage/players/roundData/fetchPlayersRoundData',
            {roundId},
            {root: true},
        );
        return responses;
    },
    setAllRoundIds({commit}, {matchId, roundIds}) {
        commit('SET_ALL_ROUND_IDS', {matchId, roundIds});
    },
    addToAllRoundIds({commit}, {matchId, roundId}) {
        commit('ADD_TO_ALL_ROUND_IDS', {matchId, roundId});
    },
};

const getters = {
    getCurrentRoundIdByMatchId: (state) => (matchId) => state.currentRoundIds[matchId],
    getLatestRoundIdByMatchId: (state) => (matchId) => state.latestRoundIds[matchId],
    getAllRoundIdsByMatchId: (state) => (matchId) => state.allRoundIds[matchId],
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
