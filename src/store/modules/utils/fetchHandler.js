const actions = {
    async handleFetch({dispatch}, {key, timeout, forceFetch, fetchFunction, onSuccess, errorTitle}) {
        const response = {key};
        const shouldFetch = await dispatch('sessionState/indicators/fetch/shouldFetch', {key, timeout, forceFetch}, {root: true});
        response.fetchRequired = shouldFetch;
        if (!shouldFetch) {
            return response;
        }

        dispatch('sessionState/indicators/loading/recordLoadingStart', key, {root: true});
        dispatch('sessionState/indicators/fetch/recordAttempt', key, {root: true});

        try {
            const result = await fetchFunction();
            response.result = result;
            response.returnedOnSuccess = await onSuccess(result);
            dispatch('sessionState/indicators/fetch/recordSuccess', key, {root: true});
            response.isSuccess = true;
        } catch (error) {
            dispatch('sessionState/indicators/errorLog/addLogEntry', {title: errorTitle, error}, {root: true});
            dispatch('sessionState/indicators/fetch/recordFail', key, {root: true});
            response.isSuccess = false;
            response.error = error;
        } finally {
            dispatch('sessionState/indicators/loading/recordLoadingEnd', key, {root: true});
        }

        return response;
    },
};

export default {
    namespaced: true,
    actions,
};
