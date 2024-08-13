const getters = {
    getNonSelfPlayersMatchDataByMatchId: (state, getters, rootState, rootGetters) => matchId => {
        const userId = rootGetters['auth/user/userId'];
        return rootGetters['players/match/getPlayersMatchDataByMatchId'](matchId).filter(player => player.user_id !== userId);
    },
};

export default {
    namespaced: true,
    getters,
};
