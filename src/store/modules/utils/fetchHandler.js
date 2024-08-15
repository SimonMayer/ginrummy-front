const actions = {
    async handleFetch({dispatch}, {key, timeout, forceFetch, fetchFunction, onSuccess, errorTitle}) {
        const response = {key};
        const shouldFetch = await dispatch('sessionState/fetchRecords/shouldFetch', {key, timeout, forceFetch}, {root: true});
        response.fetchRequired = shouldFetch;
        if (!shouldFetch) {
            return response;
        }

        dispatch('sessionState/loading/setLoading', true, {root: true});
        dispatch('sessionState/fetchRecords/recordAttempt', key, {root: true});

        try {
            const result = await fetchFunction();
            response.result = result;
            response.returnedOnSuccess = await onSuccess(result);
            dispatch('sessionState/fetchRecords/recordSuccess', key, {root: true});
            response.isSuccess = true;
        } catch (error) {
            dispatch('sessionState/error/setError', {title: errorTitle, error}, {root: true});
            dispatch('sessionState/fetchRecords/recordFail', key, {root: true});
            response.isSuccess = false;
            response.error = error;
        } finally {
            dispatch('sessionState/loading/setLoading', false, {root: true});
        }

        return response;
    },
};

export default {
    namespaced: true,
    actions,
};
