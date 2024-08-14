import apiService from '@/services/apiService';

const matchesService = {
    async getMatchList() {
        return await apiService.get(`/matches`, 'Failed to fetch match list!');
    },
    async getMatchDetails(matchId) {
        return await apiService.get(`/matches/${matchId}`, 'Failed to fetch match details!');
    },
    async getPlayers(matchId) {
        return await apiService.get(`/matches/${matchId}/players`, 'Failed to fetch players!');
    },
    async addPlayers(matchId, userIds) {
        return await apiService.post(`/matches/${matchId}/players`, {user_ids: userIds}, 'Failed to add players!');
    },
    async startMatch(matchId) {
        return await apiService.post(`/matches/${matchId}/start`, {}, 'Failed to start match!');
    },
};

export default matchesService;
