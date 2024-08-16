import {createStore} from 'vuex';
import authentication from '@/store/modules/authentication/_index';
import storage from '@/store/modules/storage/_index';
import sessionState from '@/store/modules/sessionState/_index';
import utils from '@/store/modules/utils/_index';

const store = createStore({
    modules: {
        authentication: {
            namespaced: true,
            modules: authentication,
        },
        storage: {
            namespaced: true,
            modules: storage,
        },
        sessionState: {
            namespaced: true,
            modules: sessionState,
        },
        utils: {
            namespaced: true,
            modules: utils,
        },
    },
});

export default store;
