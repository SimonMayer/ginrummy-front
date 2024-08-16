function generateUniqueId() {
    return '_' + Math.random().toString(36).slice(2, 11);
}

const state = {
    logEntries: {},
};

const mutations = {
    ADD_LOG_ENTRY(state, {id, title, error}) {
        state.logEntries[id] = {id, title, error, timestamp: Date.now()};
    },
    CLEAR_LOG_ENTRIES(state) {
        state.logEntries = {};
    },
    REMOVE_LOG_ENTRY(state, id) {
        delete state.logEntries[id];
    },
};

const actions = {
    addLogEntry({commit}, {title, error}) {
        if (typeof title === 'string' && typeof error === 'object' && error !== null) {
            commit('ADD_LOG_ENTRY', {id: generateUniqueId(), title, error});
        } else {
            console.warn('Invalid log entry: title must be a string and error must be an object.');
        }
    },
    clearLogEntries({commit}) {
        commit('CLEAR_LOG_ENTRIES');
    },
    removeLogEntry({commit}, id) {
        commit('REMOVE_LOG_ENTRY', id);
    },
};

const getters = {
    getLatestLogEntry: (state) => {
        const entries = Object.values(state.logEntries);
        return entries.length > 0
            ? entries.reduce((latest, entry) =>
                entry.timestamp > latest.timestamp ? entry : latest, entries[0],
            )
            : null;
    },
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
