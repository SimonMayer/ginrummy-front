import matchesService from '@/services/matchesService';

const actions = {
    async addPlayer({dispatch, rootGetters}, user) {
        const matchId = rootGetters['sessionState/matchIdentifier/matchId'];
        const maxPlayers = rootGetters['storage/gameConfig/maxPlayers'];
        const playerCount = rootGetters['sessionState/derived/players/playerCount'];

        if (playerCount >= maxPlayers) {
            return;
        }

        return await dispatch(
            'utils/interactionHandler/handleInteraction',
            {
                key: `addPlayer_${matchId}_${user.user_id}`,
                interaction: async () => {
                    const result = {};
                    result.addPlayers = await matchesService.addPlayers(matchId, [user.user_id]);
                    result.fetchPlayersMatchData = await dispatch(
                        'storage/players/matchData/fetchPlayersMatchData',
                        {matchId, forceFetch: true},
                        {root: true},
                    );
                    return result;
                },
                errorTitle: 'Failed to add player!',
            },
            {root: true},
        );
    },
};

export default {
    namespaced: true,
    actions,
};
