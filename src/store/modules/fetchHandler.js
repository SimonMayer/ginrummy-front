const actions = {
    async handleFetch({dispatch}, {key, timeout, forceFetch, fetchFunction, onSuccess, errorTitle}) {
        const response = {key};
        const shouldFetch = await dispatch('trackers/fetch/shouldFetch', {key, timeout, forceFetch}, {root: true});
        response.fetchRequired = shouldFetch;
        if (!shouldFetch) {
            return response;
        }

        dispatch('trackers/loading/setLoading', true, {root: true});
        dispatch('trackers/fetch/recordAttempt', key, {root: true});

        try {
            const result = await fetchFunction();
            response.result = result;
            response.returnedOnSuccess = await onSuccess(result);
            dispatch('trackers/fetch/recordSuccess', key, {root: true});
            response.isSuccess = true;
        } catch (error) {
            dispatch('error/setError', {title: errorTitle, error}, {root: true});
            dispatch('trackers/fetch/recordFail', key, {root: true});
            response.isSuccess = false;
            response.error = error;
        } finally {
            dispatch('trackers/loading/setLoading', false, {root: true});
        }

        return response;
    },
};

export default {
    namespaced: true,
    actions,
};
