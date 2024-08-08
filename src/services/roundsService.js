import apiService from '@/services/apiService';

const roundsService = {
    async getCurrentTurn(roundId) {
        return await apiService.get(`/rounds/${roundId}/current_turn`, 'Failed to fetch current turn!');
    },
    async getStockPileData(roundId) {
        return await apiService.get(`/rounds/${roundId}/stock_pile`, 'Failed to fetch stock pile data!');
    },
    async getDiscardPileList(roundId) {
        return await apiService.get(`/rounds/${roundId}/discard_pile`, 'Failed to fetch discard pile list!');
    },
    async getMelds(roundId) {
        return await apiService.get(`/rounds/${roundId}/melds`, 'Failed to fetch melds!');
    },
    async getPlayers(roundId) {
        return await apiService.get(`/rounds/${roundId}/players`, 'Failed to fetch players data!');
    },
    async startRound(matchId) {
        const roundData = await apiService.post(`/matches/${matchId}/new_round`, {}, 'Failed to start new round!');
        return roundData.round_id;
    },
};

export default roundsService;
