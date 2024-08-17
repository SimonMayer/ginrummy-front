import matches from '@/store/modules/interactions/matches/_index';
import rounds from '@/store/modules/interactions/rounds/_index';
import searches from '@/store/modules/interactions/searches/_index';

export default {
    matches: {
        namespaced: true,
        modules: matches,
    },
    rounds: {
        namespaced: true,
        modules: rounds,
    },
    searches: {
        namespaced: true,
        modules: searches,
    },
};
