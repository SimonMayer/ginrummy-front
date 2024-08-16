import usersService from '@/services/usersService';

const actions = {
    async searchUsers({dispatch}, term) {
        const key = `searchUsers_${term}`;
        dispatch('sessionState/indicators/loading/recordLoadingStart', key, { root: true });

        try {
            return await usersService.searchUsers(term);
        } catch (error) {
            dispatch(
                'sessionState/indicators/errorLog/addLogEntry',
                {title: 'Failed to search users!', error},
                {root: true},
            );
        } finally {
            dispatch('sessionState/indicators/loading/recordLoadingEnd', key, { root: true });
        }
        return [];
    },
};

export default {
    namespaced: true,
    actions,
};
