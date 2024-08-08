import apiService from '@/services/apiService';

const handsService = {
    async getHand(handId) {
        return await apiService.get(`/hands/${handId}`, 'Failed to fetch hand!');
    }
};

export default handsService;
