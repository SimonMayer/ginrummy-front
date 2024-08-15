const getters = {
    getSelfPlayerMatchDataByMatchId: (state, getters, rootState, rootGetters) => matchId => {
        const userId = rootGetters['authentication/user/userId'];
        return rootGetters['storage/players/match/getPlayersMatchDataByMatchId'](matchId).find(player => player.user_id === userId);
    },
    getSelfPlayerRoundDataByRoundId: (state, getters, rootState, rootGetters) => (roundId) => {
        const userId = rootGetters['authentication/user/userId'];
        return rootGetters['storage/players/round/getPlayerRoundDataByRoundAndPlayerIds']({roundId, playerId: userId});
    },
};

export default {
    namespaced: true,
    getters,
};
