import apiService from '@/services/apiService';

const roundsService = {
    async getRoundDataForPlayers(roundId) {
        return await apiService.get(`/rounds/${roundId}`, 'Failed to fetch round data!');
    },
    async getMyHand(roundId) {
        return await apiService.get(`/rounds/${roundId}/my_hand`, 'Failed to fetch your hand!');
    },
    async getCurrentTurn(roundId) {
        return await apiService.get(`/rounds/${roundId}/current_turn`, 'Failed to fetch current turn!');
    },
    async startRound(matchId) {
        return await apiService.post(`/matches/${matchId}/new_round`, {}, 'Failed to start new round!');
    }
};

export default roundsService;
