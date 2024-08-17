import derived from '@/store/modules/sessionState/derived/_index';
import indicators from '@/store/modules/sessionState/indicators/_index';
import permissions from '@/store/modules/sessionState/permissions/_index';
import matchIdentifier from '@/store/modules/sessionState/matchIdentifier';
import selections from '@/store/modules/sessionState/selections';

export default {
    derived: {
        namespaced: true,
        modules: derived,
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
    selections,
};
