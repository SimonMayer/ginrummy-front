import turnsService from '@/services/turnsService';

const actions = {
    async extendMeld({dispatch, rootGetters}) {
        const matchId = rootGetters['sessionState/matchIdentifier/matchId'];
        const cardIds = rootGetters['sessionState/derived/selectedItems/selectedHandCardIds'];
        const meldId = rootGetters['sessionState/uiOperations/selections/selectedMeldId'];
        const handId = rootGetters['sessionState/derived/hand/currentHandId'];

        return await dispatch(
            'utils/interactionHandler/handleInteraction',
            {
                key: `extendMeld_${matchId}`,
                interaction: async () => {
                    const result = {};
                    result.extendMeld = await turnsService.extendMeld(matchId, meldId, cardIds);
                    await dispatch('storage/hands/removeCardIdsFromHand', {handId, cardIds}, {root: true});
                    await dispatch('sessionState/uiOperations/selections/unselectAllCards', {}, {root: true});
                    return result;
                },
                errorTitle: 'Failed to extend meld!',
            },
            {root: true},
        );
    },

    async playMeld({dispatch, rootGetters}) {
        const meldType = rootGetters['sessionState/derived/selectedItems/hasOnlySelectedCardsOfMatchingRank'] ? 'set' : 'run';
        const matchId = rootGetters['sessionState/matchIdentifier/matchId'];
        const cardIds = rootGetters['sessionState/derived/selectedItems/selectedHandCardIds'];
        const handId = rootGetters['sessionState/derived/hand/currentHandId'];

        return await dispatch(
            'utils/interactionHandler/handleInteraction',
            {
                key: `playMeld_${matchId}`,
                interaction: async () => {
                    const result = {};
                    result.playMeld = await turnsService.playMeld(matchId, cardIds, meldType);
                    await dispatch('storage/hands/removeCardIdsFromHand', {handId, cardIds}, {root: true});
                    await dispatch('sessionState/uiOperations/selections/unselectAllCards', {}, {root: true});
                    return result;
                },
                errorTitle: 'Failed to play meld!',
            },
            {root: true},
        );
    },
};

export default {
    namespaced: true,
    actions,
};
