import {createStore} from 'vuex';
import authInteractions from '@/store/modules/auth/interactions';
import authTokens from '@/store/modules/auth/tokens';
import authUser from '@/store/modules/auth/user';

import cardsCards from '@/store/modules/cards/cards';
import cardsSelections from '@/store/modules/cards/selections';

import matchesList from '@/store/modules/matches/list';
import matchesMatches from '@/store/modules/matches/matches';

import playersMatch from '@/store/modules/players/match';
import playersRound from '@/store/modules/players/round';
import playersNonSelf from '@/store/modules/players/nonSelf';
import playersSelf from '@/store/modules/players/self';

import registryMatchAction from '@/store/modules/registry/matchAction';
import registryMatchRound from '@/store/modules/registry/matchRound';
import registryRoundTurn from '@/store/modules/registry/roundTurn';

import roundsDiscardPiles from '@/store/modules/rounds/discardPiles';
import roundsMelds from '@/store/modules/rounds/melds';
import roundsStockPiles from '@/store/modules/rounds/stockPiles';

import sseConnection from '@/store/modules/sse/connection';
import sseDataProcessor from '@/store/modules/sse/dataProcessor';

import trackersDerivedDraw from '@/store/modules/trackers/derived/draw';
import trackersDerivedHand from '@/store/modules/trackers/derived/hand';
import trackersDerivedRounds from '@/store/modules/trackers/derived/rounds';
import trackersDerivedSelected from '@/store/modules/trackers/derived/selected';
import trackersDerivedTurns from '@/store/modules/trackers/derived/turns';
import trackersPermissionsCore from '@/store/modules/trackers/permissions/core';
import trackersPermissionsDraw from '@/store/modules/trackers/permissions/draw';
import trackersFetch from '@/store/modules/trackers/fetch';
import trackersLoading from '@/store/modules/trackers/loading';
import trackersMatchPhase from '@/store/modules/trackers/matchPhase';

import turnsActions from '@/store/modules/turns/actions';
import turnsTurns from '@/store/modules/turns/turns';

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
                interactions: authInteractions,
                user: authUser,
                tokens: authTokens,
            },
        },
        cards: {
            namespaced: true,
            modules: {
                cards: cardsCards,
                selections: cardsSelections,
            },
        },
        error,
        fetchHandler,
        gameConfig,
        hands,
        matches: {
            namespaced: true,
            modules: {
                list: matchesList,
                matches: matchesMatches,
            },
        },
        players: {
            namespaced: true,
            modules: {
                match: playersMatch,
                round: playersRound,
                nonSelf: playersNonSelf,
                self: playersSelf,
            },
        },
        registry: {
            namespaced: true,
            modules: {
                matchAction: registryMatchAction,
                matchRound: registryMatchRound,
                roundTurn: registryRoundTurn,
            },
        },
        rounds: {
            namespaced: true,
            modules: {
                discardPiles: roundsDiscardPiles,
                melds: roundsMelds,
                stockPiles: roundsStockPiles,
            },
        },
        search,
        sse: {
            namespaced: true,
            modules: {
                connection: sseConnection,
                dataProcessor: sseDataProcessor,
            },
        },
        trackers: {
            namespaced: true,
            modules: {
                derived: {
                    namespaced: true,
                    modules: {
                        draw: trackersDerivedDraw,
                        hand: trackersDerivedHand,
                        rounds: trackersDerivedRounds,
                        selected: trackersDerivedSelected,
                        turns: trackersDerivedTurns,
                    },
                },
                fetch: trackersFetch,
                loading: trackersLoading,
                matchPhase: trackersMatchPhase,
                permissions: {
                    namespaced: true,
                    modules: {
                        core: trackersPermissionsCore,
                        draw: trackersPermissionsDraw,
                    },
                },
            },
        },
        turns: {
            namespaced: true,
            modules: {
                actions: turnsActions,
                turns: turnsTurns,
            },
        },
    },
});

export default store;
