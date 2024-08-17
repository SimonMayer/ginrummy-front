import matchesService from '@/services/matchesService';

const actions = {
    async startMatch({dispatch, rootGetters}) {
        const matchId = rootGetters['sessionState/matchIdentifier/matchId'];

        return await dispatch(
            'utils/interactionHandler/handleInteraction',
            {
                key: `startMatch_${matchId}`,
                interaction: async () => {
                    const result = {};
                    result.startMatch = await matchesService.startMatch(matchId);

                    result.fetchMatch = await dispatch(
                        'storage/matches/matches/fetchMatch',
                        {matchId, forceFetch: true},
                        {root: true},
                    );
                    result.fetchPlayersMatchData = await dispatch(
                        'storage/players/matchData/fetchPlayersMatchData',
                        {matchId, forceFetch: true},
                        {root: true},
                    );

                    result.initializeSse = await dispatch(
                        'storage/sse/connection/initializeSse',
                        matchId,
                        {root: true},
                    );
                    return result;
                },
                errorTitle: 'Failed to start match!',
            },
            {root: true},
        );
    },
};

export default {
    namespaced: true,
    actions,
};
