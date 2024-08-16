import matchesService from '@/services/matchesService';

const actions = {
    async addPlayer({dispatch, rootGetters}, user) {
        const matchId = rootGetters['sessionState/matchIdentifier/matchId'];
        const maxPlayers = rootGetters['storage/gameConfig/maxPlayers'];
        const playerCount = rootGetters['sessionState/derived/players/playerCount'];

        if (playerCount >= maxPlayers) {
            return;
        }

        const key = `addPlayer_${matchId}_${user.user_id}`;
        const response = {key, responses: {}};

        dispatch('sessionState/indicators/loading/recordLoadingStart', key, { root: true });
        try {
            response.responses.addPlayers = await matchesService.addPlayers(matchId, [user.user_id]);
            response.responses.fetchPlayersMatchData = await dispatch(
                'storage/players/matchData/fetchPlayersMatchData',
                {matchId, forceFetch: true},
                {root: true},
            );

            response.isSuccess = true;
        } catch (error) {
            dispatch(
                'sessionState/indicators/errorLog/addLogEntry',
                {title: 'Failed to add player!', error},
                {root: true},
            );
            response.isSuccess = false;
            response.error = error;
        } finally {
            dispatch('sessionState/indicators/loading/recordLoadingEnd', key, { root: true });
        }
        return response;
    },
};

export default {
    namespaced: true,
    actions,
};
