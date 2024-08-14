import authService from '@/services/authService';

const actions = {
    async signIn({dispatch, rootGetters}, {username, password}) {
        dispatch('trackers/loading/setLoading', true, {root: true});

        try {
            const data = await authService.signIn(username, password);
            await dispatch('auth/tokens/setRestAccessToken', data.rest_access_token, {root: true});
            await dispatch('auth/tokens/setSseAccessToken', data.sse_access_token, {root: true});
            await dispatch('auth/tokens/setRefreshToken', data.refresh_token, {root: true});
            await dispatch('auth/user/setUserId', data.user_id, {root: true});
            await dispatch('auth/user/setAuthenticated', true, {root: true});
        } catch (error) {
            dispatch('error/setError', {title: 'Sign in failed!', error}, {root: true});
            await dispatch('signOut');
        } finally {
            dispatch('trackers/loading/setLoading', false, {root: true});
        }

        return rootGetters['auth/user/isAuthenticated'];
    },
    async signOut({dispatch}) {
        await dispatch('auth/user/setAuthenticated', false, {root: true});
        await dispatch('auth/tokens/setRestAccessToken', null, {root: true});
        await dispatch('auth/tokens/setSseAccessToken', null, {root: true});
        await dispatch('auth/tokens/setRefreshToken', null, {root: true});
        await dispatch('auth/user/setUserId', null, {root: true});
    },
};

export default {
    namespaced: true,
    actions,
};
