import {createStore} from 'vuex';
import interactions from '@/store/modules/auth/interactions';
import tokens from '@/store/modules/auth/tokens';
import user from '@/store/modules/auth/user';

import cards from '@/store/modules/cards/cards';
import selections from '@/store/modules/cards/selections';

import list from '@/store/modules/matches/list';
import matches from '@/store/modules/matches/matches';

import match from '@/store/modules/players/match';
import round from '@/store/modules/players/round';
import nonSelf from '@/store/modules/players/nonSelf';
import self from '@/store/modules/players/self';

import discardPiles from '@/store/modules/rounds/discardPiles';
import melds from '@/store/modules/rounds/melds';
import stockPiles from '@/store/modules/rounds/stockPiles';

import matchAction from '@/store/modules/registry/matchAction';
import matchRound from '@/store/modules/registry/matchRound';
import roundTurn from '@/store/modules/registry/roundTurn';

import connection from '@/store/modules/sse/connection';
import dataProcessor from '@/store/modules/sse/dataProcessor';

import draw from '@/store/modules/trackers/derived/draw';
import derivedRounds from '@/store/modules/trackers/derived/rounds';
import derivedTurns from '@/store/modules/trackers/derived/turns';
import core from '@/store/modules/trackers/permissions/core';

import fetch from '@/store/modules/trackers/fetch';
import loading from '@/store/modules/trackers/loading';
import matchPhase from '@/store/modules/trackers/matchPhase';

import actions from '@/store/modules/turns/actions';
import turns from '@/store/modules/turns/turns';

import error from '@/store/modules/error';
import fetchHandler from '@/store/modules/fetchHandler';
import gameConfig from '@/store/modules/gameConfig';
import hands from '@/store/modules/hands';
import search from '@/store/modules/search';

const store = createStore({
    modules: {
        auth: {
            namespaced: true,
            modules: {
                interactions,
                user,
                tokens,
            },
        },
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
        sse: {
            namespaced: true,
            modules: {
                connection,
                dataProcessor,
            },
        },
        trackers: {
            namespaced: true,
            modules: {
                derived: {
                    namespaced: true,
                    modules: {
                        draw: draw,
                        rounds: derivedRounds,
                        turns: derivedTurns,
                    },
                },
                fetch,
                loading,
                matchPhase,
                permissions: {
                    namespaced: true,
                    modules: {
                        core,
                    },
                },
            },
        },
        turns: {
            namespaced: true,
            modules: {
                actions,
                turns,
            },
        },
    },
});

export default store;
