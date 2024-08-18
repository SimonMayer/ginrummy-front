import turnsService from '@/services/turnsService';

const actions = {
    async drawOneFromStockPile({dispatch, rootGetters}) {
        if (!rootGetters['sessionState/permissions/draw/canDrawOneFromStockPile']) {
            return;
        }
        const matchId = rootGetters['sessionState/matchIdentifier/matchId'];
        const handId = rootGetters['sessionState/derived/hand/currentHandId'];
        return await dispatch(
            'utils/interactionHandler/handleInteraction',
            {
                key: `drawOneFromStockPile_${matchId}}`,
                interaction: async () => {
                    const cardId = rootGetters['sessionState/derived/stockPile/currentStockPileSize'] > 0
                        ? await turnsService.drawFromStockPile(matchId)
                        : await turnsService.drawFromEmptyStockPile(matchId);
                    await dispatch('storage/hands/addCardIdsToHand', {handId, cardIds: [cardId]}, {root: true});
                    await dispatch('sessionState/uiOperations/selections/unselectAllCards', {}, {root: true});
                    return {cardId};
                },
                errorTitle: 'Failed to draw from stock pile!',
            },
            {root: true},
        );
    },
    async drawOneFromDiscardPile({dispatch, rootGetters}) {
        if (!rootGetters['sessionState/permissions/draw/canDrawOneFromDiscardPile']) {
            return;
        }
        const matchId = rootGetters['sessionState/matchIdentifier/matchId'];
        const handId = rootGetters['sessionState/derived/hand/currentHandId'];
        return await dispatch(
            'utils/interactionHandler/handleInteraction',
            {
                key: `drawOneFromDiscardPile_${matchId}}`,
                interaction: async () => {
                    const cardId = await turnsService.drawOneFromDiscardPile(matchId);
                    await dispatch(
                        'storage/rounds/discardPiles/removeTopDiscardPileCard',
                        {roundId: rootGetters['sessionState/derived/rounds/currentRoundId']},
                        {root: true},
                    );
                    await dispatch('storage/hands/addCardIdsToHand', {handId, cardIds: [cardId]}, {root: true});
                    await dispatch('sessionState/uiOperations/selections/unselectAllCards', {}, {root: true});
                    return {cardId};
                },
                errorTitle: 'Failed to draw from discard pile!',
            },
            {root: true},
        );
    },
    async drawMultipleFromDiscardPile({dispatch, rootGetters}) {
        if (!rootGetters['sessionState/permissions/draw/canDrawMultipleFromDiscardPile']) {
            return;
        }
        const matchId = rootGetters['sessionState/matchIdentifier/matchId'];
        const handId = rootGetters['sessionState/derived/hand/currentHandId'];
        return await dispatch(
            'utils/interactionHandler/handleInteraction',
            {
                key: `drawMultipleFromDiscardPile_${matchId}}`,
                interaction: async () => {
                    const handCardIds = rootGetters['sessionState/derived/selectedItems/selectedHandCardIds'];
                    const newHandCardIds = await turnsService.drawMultipleFromDiscardPile(
                        matchId,
                        rootGetters['sessionState/derived/selectedItems/selectedDiscardPileCardIds'],
                        handCardIds,
                        rootGetters['sessionState/uiOperations/selections/selectedMeldId'],
                    );
                    await dispatch('storage/hands/removeCardIdsFromHand', {
                        handId,
                        cardIds: handCardIds,
                    }, {root: true});
                    await dispatch('storage/hands/addCardIdsToHand', {handId, cardIds: newHandCardIds}, {root: true});
                    await dispatch('sessionState/uiOperations/selections/unselectAllCards', {}, {root: true});
                    return {newHandCardIds};
                },
                errorTitle: 'Failed to draw multiple from discard pile!',
            },
            {root: true},
        );
    },
};

export default {
    namespaced: true,
    actions,
};
