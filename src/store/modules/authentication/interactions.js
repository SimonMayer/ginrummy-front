import authService from '@/services/authService';

const actions = {
    async signIn({dispatch, rootGetters}, {username, password}) {
        dispatch('sessionState/loading/setLoading', true, {root: true});

        try {
            const data = await authService.signIn(username, password);
            await dispatch('authentication/tokens/setRestAccessToken', data.rest_access_token, {root: true});
            await dispatch('authentication/tokens/setSseAccessToken', data.sse_access_token, {root: true});
            await dispatch('authentication/tokens/setRefreshToken', data.refresh_token, {root: true});
            await dispatch('authentication/user/setUserId', data.user_id, {root: true});
            await dispatch('authentication/user/setAuthenticated', true, {root: true});
        } catch (error) {
            dispatch('sessionState/error/setError', {title: 'Sign in failed!', error}, {root: true});
            await dispatch('signOut');
        } finally {
            dispatch('sessionState/loading/setLoading', false, {root: true});
        }

        return rootGetters['authentication/user/isAuthenticated'];
    },
    async signOut({dispatch}) {
        await dispatch('authentication/user/setAuthenticated', false, {root: true});
        await dispatch('authentication/tokens/setRestAccessToken', null, {root: true});
        await dispatch('authentication/tokens/setSseAccessToken', null, {root: true});
        await dispatch('authentication/tokens/setRefreshToken', null, {root: true});
        await dispatch('authentication/user/setUserId', null, {root: true});
    },
};

export default {
    namespaced: true,
    actions,
};
