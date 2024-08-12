const getters = {
    getSelfPlayerMatchDataByMatchId: (state, getters, rootState, rootGetters) => matchId => {
        const userId = parseInt(localStorage.getItem('user_id'), 10);
        return rootGetters['players/match/getPlayersMatchDataByMatchId'](matchId).find(player => player.user_id === userId);
    },
    getSelfPlayerRoundDataByRoundId: (state, getters, rootState, rootGetters) => (roundId) => {
        const userId = parseInt(localStorage.getItem('user_id'), 10);
        return rootGetters['players/round/getPlayerRoundDataByRoundAndPlayerIds']({ roundId, playerId: userId });
    },
};

export default {
    namespaced: true,
    getters,
};
