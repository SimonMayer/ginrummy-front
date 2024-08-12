import { createStore } from 'vuex';
import cards        from '@/store/modules/cards/cards';
import selections   from '@/store/modules/cards/selections';

import list         from '@/store/modules/matches/list';
import matches      from '@/store/modules/matches/matches';

import core         from '@/store/modules/permissions/core';

import match        from '@/store/modules/players/match';
import round        from '@/store/modules/players/round';
import nonSelf      from '@/store/modules/players/nonSelf';
import self         from '@/store/modules/players/self';

import discardPiles from '@/store/modules/rounds/discardPiles';
import melds        from '@/store/modules/rounds/melds';
import stockPiles   from '@/store/modules/rounds/stockPiles';

import matchAction  from '@/store/modules/registry/matchAction';
import matchRound   from '@/store/modules/registry/matchRound';
import roundTurn    from '@/store/modules/registry/roundTurn';

import fetch        from '@/store/modules/trackers/fetch';
import loading      from '@/store/modules/trackers/loading';
import matchPhase   from '@/store/modules/trackers/matchPhase';

import auth         from '@/store/modules/auth';
import error        from '@/store/modules/error';
import fetchHandler from '@/store/modules/fetchHandler';
import gameConfig   from '@/store/modules/gameConfig';
import hands        from '@/store/modules/hands';
import search       from '@/store/modules/search';
import turns        from '@/store/modules/turns';

const store = createStore({
    modules: {
        auth,
        cards: {
            namespaced: true,
            modules: {
                cards,
                selections,
            },
        },
        error,
        fetchHandler,
        gameConfig,
        hands,
        matches: {
            namespaced: true,
            modules: {
                list,
                matches,
            },
        },
        permissions: {
            namespaced: true,
            modules: {
                core,
            },
        },
        players: {
            namespaced: true,
            modules: {
                round,
                match,
                nonSelf,
                self,
            },
        },
        registry: {
            namespaced: true,
            modules: {
                matchAction,
                matchRound,
                roundTurn,
            },
        },
        rounds: {
            namespaced: true,
            modules: {
                discardPiles,
                melds,
                stockPiles,
            },
        },
        search,
        trackers: {
            namespaced: true,
            modules: {
                fetch,
                matchPhase,
                loading,
            },
        },
        turns,
    }
});

export default store;
