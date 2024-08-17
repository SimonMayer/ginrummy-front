import usersService from '@/services/usersService';

const actions = {
    async searchUsers({dispatch}, term) {
        return await dispatch(
            'utils/interactionHandler/handleInteraction',
            {
                key: `searchUsers_${term}`,
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
