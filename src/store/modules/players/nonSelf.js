const getters = {
    getNonSelfPlayersMatchDataByMatchId: (state, getters, rootState, rootGetters) => matchId => {
        const userId = parseInt(localStorage.getItem('user_id'), 10);
        return rootGetters['players/match/getPlayersMatchDataByMatchId'](matchId).filter(player => player.user_id !== userId);
    },
};

export default {
    namespaced: true,
    getters,
};
