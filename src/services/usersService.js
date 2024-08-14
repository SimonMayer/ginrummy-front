import apiService from '@/services/apiService';

const usersService = {
    async searchUsers(term) {
        return await apiService.get(`/users/search?term=${term}`, 'Failed to search users!');
    },
};

export default usersService;
