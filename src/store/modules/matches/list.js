import matchesService from '@/services/matchesService';

const FETCH_MATCH_LIST_TIMEOUT = 60 * 60 * 1000;

const state = {
    matchList: [],
};

const mutations = {
    SET_MATCH_LIST(state, matchList) {
        state.matchList = matchList;
    },
};

const actions = {
    async fetchMatchList({ dispatch, commit }, { forceFetch = false }) {
        await dispatch(
            'fetchHandler/handleFetch',
            {
                errorTitle: 'Failed to fetch match list!',
                forceFetch,
                key: 'matchList',
                fetchFunction: () => matchesService.getMatchList(),
                onSuccess: async (matchList) => {
                    commit('SET_MATCH_LIST', matchList);
                },
                timeout: FETCH_MATCH_LIST_TIMEOUT,
            },
            { root: true }
        );

    },
};

const getters = {
    matchList: state => state.matchList,
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
