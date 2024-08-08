import apiService from '@/services/apiService';

const turnsService = {
    async drawFromStockPile(matchId) {
        const cardData = await apiService.post(`/matches/${matchId}/actions/draw_from_stock_pile`, {}, 'Failed to draw from stock pile!');
        return cardData.card_id;
    },
    async drawFromEmptyStockPile(matchId) {
        const cardData = await apiService.post(`/matches/${matchId}/actions/draw_from_empty_stock_pile`, {}, 'Failed to draw from empty stock pile!');
        return cardData.card_id;
    },
    async drawOneFromDiscardPile(matchId) {
        const cardData = await apiService.post(`/matches/${matchId}/actions/draw_one_from_discard_pile`, {}, 'Failed to draw from discard pile!');
        return cardData.card_id;
    },
    async drawMultipleFromDiscardPile(matchId, discardPileCardIds, handCardIds, meldId = null) {
        const requestBody = {
            discard_pile_card_ids: discardPileCardIds,
            hand_card_ids: handCardIds
        };

        if (meldId) {
            requestBody.meld_id = meldId;
        }

        const data = await apiService.post(
            `/matches/${matchId}/actions/draw_multiple_from_discard_pile`,
            requestBody,
            'Failed to draw from discard pile!'
        );

        return data.new_hand_card_ids;
    },
    async discardCard(matchId, cardId) {
        return await apiService.post(`/matches/${matchId}/actions/discard_card`, { card_id: cardId }, 'Failed to discard card!');
    },
    async playMeld(matchId, cardIds, meldType) {
        return await apiService.post(`/matches/${matchId}/actions/play_meld/${meldType}`, { card_ids: cardIds }, 'Failed to play meld!');
    },
    async extendMeld(matchId, meldId, cardIds) {
        return await apiService.post(`/matches/${matchId}/actions/extend_meld/${meldId}`, { card_ids: cardIds }, 'Failed to extend meld!');
    }
};

export default turnsService;
