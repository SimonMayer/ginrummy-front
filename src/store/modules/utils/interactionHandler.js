const actions = {
    async handleInteraction({dispatch}, {key, interaction, errorTitle}) {
        const response = {key};

        dispatch('sessionState/indicators/loading/recordLoadingStart', key, {root: true});
        try {
            response.result = await interaction();
            response.isSuccess = true;
        } catch (error) {
            dispatch('sessionState/indicators/errorLog/addLogEntry', {title: errorTitle, error}, {root: true});
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
