import usersService from '@/services/usersService';

const actions = {
    async searchUsers({dispatch}, term) {
        const key = `searchUsers_${term}`;
        return await dispatch(
            'utils/interactionHandler/handleInteraction',
            {
                key,
                interaction: async () => {
                    return await usersService.searchUsers(term);
                },
                errorTitle: 'Failed to search users!',
            },
            {root: true},
        );
    },
};

export default {
    namespaced: true,
    actions,
};
