import turnsService from '@/services/turnsService';

const actions = {
    async discardCard({dispatch, rootGetters}) {
        const validationError = !rootGetters['sessionState/permissions/discard/canDiscard']
            ? new Error('Discarding is not allowed right now')
            : (rootGetters['sessionState/uiOperations/dragState/draggedVisibleCardCount'] > 1)
                ? new Error('Too many cards were dragged to the discard pile')
                : null;

        if (validationError) {
            dispatch(
                'sessionState/indicators/errorLog/addLogEntry',
                {title: 'Cannot discard', error: validationError},
                {root: true},
            );
            return;
        }

        const matchId = rootGetters['sessionState/matchIdentifier/matchId'];
        const handId = rootGetters['sessionState/derived/hand/currentHandId'];

        const cardId = rootGetters['sessionState/uiOperations/dragState/draggedVisibleCardCount'] === 1
            ? rootGetters['sessionState/uiOperations/dragState/draggedVisibleCardIds'][0]
            : rootGetters['sessionState/derived/selectedItems/selectedHandCardCount'] === 1
                ? rootGetters['sessionState/derived/selectedItems/selectedHandCardIds'][0]
                : rootGetters['sessionState/derived/hand/currentHandCardLength'] === 1
                    ? rootGetters['sessionState/derived/hand/currentHandCardIds'][0]
                    : null;

        return await dispatch(
            'utils/interactionHandler/handleInteraction',
            {
                key: `discard_${matchId}`,
                interaction: async () => {
                    const result = {};
                    result.discardCard = await turnsService.discardCard(matchId, cardId);
                    await dispatch(
                        'storage/hands/removeCardIdsFromHand',
                        {handId: handId, cardIds: [cardId]},
                        {root: true},
                    );
                    await dispatch('sessionState/uiOperations/selections/unselectAllCards', {}, {root: true});
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
