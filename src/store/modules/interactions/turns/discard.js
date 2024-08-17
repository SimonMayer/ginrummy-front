import turnsService from '@/services/turnsService';

const actions = {
    async discardCard({dispatch, rootGetters}) {
        if (!rootGetters['sessionState/permissions/discard/canDiscard']) {
            return;
        }

        const matchId = rootGetters['sessionState/matchIdentifier/matchId'];
        const handId = rootGetters['sessionState/derived/hand/currentHandId'];
        const selectedHandCardIds = rootGetters['sessionState/derived/selectedItems/selectedHandCardIds'];

        return await dispatch(
            'utils/interactionHandler/handleInteraction',
            {
                key: `discard_${matchId}`,
                interaction: async () => {
                    const result = {};
                    const cardId = selectedHandCardIds[0];
                    result.discardCard = await turnsService.discardCard(matchId, cardId);
                    await dispatch(
                        'storage/hands/removeCardIdsFromHand',
                        {handId: handId, cardIds: [cardId]},
                        {root: true},
                    );
                    await dispatch('sessionState/selections/unselectAllCards', {}, {root: true});
                    return result;
                },
                errorTitle: 'Failed to discard card!',
            },
            {root: true},
        );
    },
};

export default {
    namespaced: true,
    actions,
};
