import roundsService from '@/services/roundsService';

const actions = {
    async startRound({dispatch, rootGetters}) {
        const matchId = rootGetters['sessionState/matchIdentifier/matchId'];

        return await dispatch(
            'utils/interactionHandler/handleInteraction',
            {
                key: `startRound_${matchId}`,
                interaction: async () => {
                    const result = {};
                    const roundId = await roundsService.startRound(matchId);

                    result.setCurrentRoundId = await dispatch(
                        'storage/registry/matchRounds/setCurrentRoundId',
                        {matchId, roundId: roundId},
                        {root: true},
                    );
                    result.setLatestRoundId = await dispatch(
                        'storage/registry/matchRounds/setLatestRoundId',
                        {matchId, roundId: roundId},
                        {root: true},
                    );
                    return result;
                },
                errorTitle: 'Failed to start new round!',
            },
            {root: true},
        );
    },
};

export default {
    namespaced: true,
    actions,
};
