import cards from '@/store/modules/storage/cards/_index';
import gameConfig from '@/store/modules/storage/gameConfig';
import hands from '@/store/modules/storage/hands';
import matches from '@/store/modules/storage/matches/_index';
import players from '@/store/modules/storage/players/_index';
import registry from '@/store/modules/storage/registry/_index';
import rounds from '@/store/modules/storage/rounds/_index';
import search from '@/store/modules/storage/search/_index';
import sse from '@/store/modules/storage/sse/_index';
import turns from '@/store/modules/storage/turns/_index';

export default {
    cards: {
        namespaced: true,
        modules: cards,
    },
    gameConfig,
    hands,
    matches: {
        namespaced: true,
        modules: matches,
    },
    players: {
        namespaced: true,
        modules: players,
    },
    registry: {
        namespaced: true,
        modules: registry,
    },
    rounds: {
        namespaced: true,
        modules: rounds,
    },
    search: {
        namespaced: true,
        modules: search,
    },
    sse: {
        namespaced: true,
        modules: sse,
    },
    turns: {
        namespaced: true,
        modules: turns,
    },
};
