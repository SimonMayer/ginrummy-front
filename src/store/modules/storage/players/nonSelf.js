const getters = {
    getNonSelfPlayersMatchDataByMatchId: (state, getters, rootState, rootGetters) => matchId => {
        const userId = rootGetters['authentication/user/userId'];
        return rootGetters['storage/players/matchData/getPlayersMatchDataByMatchId'](matchId).filter(player => player.user_id !== userId);
    },
};

export default {
    namespaced: true,
    getters,
};
