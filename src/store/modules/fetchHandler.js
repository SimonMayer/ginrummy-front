const actions = {
    async handleFetch({ dispatch }, { key, timeout, forceFetch, fetchFunction, onSuccess, errorTitle }) {
        const shouldFetch = await dispatch('trackers/fetch/shouldFetch', { key, timeout, forceFetch }, { root: true });
        if (!shouldFetch) {
            return;
        }

        dispatch('trackers/loading/setLoading', true, { root: true });
        dispatch('trackers/fetch/recordAttempt', key, { root: true });

        try {
            const result = await fetchFunction();
            await onSuccess(result);
            dispatch('trackers/fetch/recordSuccess', key, { root: true });
        } catch (error) {
            dispatch('error/setError', { title: errorTitle, error }, { root: true });
            dispatch('trackers/fetch/recordFail', key, { root: true });
        } finally {
            dispatch('trackers/loading/setLoading', false, { root: true });
        }
    },
};

export default {
    namespaced: true,
    actions,
};
