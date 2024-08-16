import matches from '@/store/modules/interactions/matches/_index';
import searches from '@/store/modules/interactions/searches/_index';

export default {
    matches: {
        namespaced: true,
        modules: matches,
    },
    searches: {
        namespaced: true,
        modules: searches,
    },
};
