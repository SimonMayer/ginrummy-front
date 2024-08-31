import client from '@/store/modules/sessionState/client/_index';
import derived from '@/store/modules/sessionState/derived/_index';
import domSizing from '@/store/modules/sessionState/domSizing/_index';
import indicators from '@/store/modules/sessionState/indicators/_index';
import permissions from '@/store/modules/sessionState/permissions/_index';
import uiOperations from '@/store/modules/sessionState/uiOperations/_index';
import matchIdentifier from '@/store/modules/sessionState/matchIdentifier';

export default {
    client: {
        namespaced: true,
        modules: client,
    },
    derived: {
        namespaced: true,
        modules: derived,
    },
    domSizing: {
        namespaced: true,
        modules: domSizing,
    },
    indicators: {
        namespaced: true,
        modules: indicators,
    },
    matchIdentifier,
    permissions: {
        namespaced: true,
        modules: permissions,
    },
    uiOperations: {
        namespaced: true,
        modules: uiOperations,
    },
};
