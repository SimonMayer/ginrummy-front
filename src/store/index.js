import {createStore} from 'vuex';
import authenticationInteractions from '@/store/modules/authentication/interactions';
import authenticationTokens from '@/store/modules/authentication/tokens';
import authenticationUser from '@/store/modules/authentication/user';

import sessionStateDerivedDiscardPile from '@/store/modules/sessionState/derived/discardPile';
import sessionStateDerivedDraw from '@/store/modules/sessionState/derived/draw';
import sessionStateDerivedHand from '@/store/modules/sessionState/derived/hand';
import sessionStateDerivedPlayers from '@/store/modules/sessionState/derived/players';
import sessionStateDerivedRounds from '@/store/modules/sessionState/derived/rounds';
import sessionStateDerivedSelected from '@/store/modules/sessionState/derived/selected';
import sessionStateDerivedStockPile from '@/store/modules/sessionState/derived/stockPile';
import sessionStateDerivedTurns from '@/store/modules/sessionState/derived/turns';
import sessionStatePermissionsCore from '@/store/modules/sessionState/permissions/core';
import sessionStatePermissionsDiscard from '@/store/modules/sessionState/permissions/discard';
import sessionStatePermissionsDraw from '@/store/modules/sessionState/permissions/draw';
import sessionStatePermissionsMelds from '@/store/modules/sessionState/permissions/melds';
import sessionStateError from '@/store/modules/sessionState/error';
import sessionStateFetch from '@/store/modules/sessionState/fetch';
import sessionStateLoading from '@/store/modules/sessionState/loading';
import sessionStateMatchPhase from '@/store/modules/sessionState/matchPhase';
import sessionStateSelections from '@/store/modules/sessionState/selections';

import storageCardsCards from '@/store/modules/storage/cards/cards';
import storageMatchesList from '@/store/modules/storage/matches/list';
import storageMatchesMatches from '@/store/modules/storage/matches/matches';
import storagePlayersMatch from '@/store/modules/storage/players/match';
import storagePlayersRound from '@/store/modules/storage/players/round';
import storagePlayersNonSelf from '@/store/modules/storage/players/nonSelf';
import storagePlayersSelf from '@/store/modules/storage/players/self';
import storageRegistryMatchAction from '@/store/modules/storage/registry/matchAction';
import storageRegistryMatchRound from '@/store/modules/storage/registry/matchRound';
import storageRegistryRoundTurn from '@/store/modules/storage/registry/roundTurn';
import storageRoundsDiscardPiles from '@/store/modules/storage/rounds/discardPiles';
import storageRoundsMelds from '@/store/modules/storage/rounds/melds';
import storageRoundsStockPiles from '@/store/modules/storage/rounds/stockPiles';
import storageSseConnection from '@/store/modules/storage/sse/connection';
import storageSseDataProcessor from '@/store/modules/storage/sse/dataProcessor';
import storageTurnsActions from '@/store/modules/storage/turns/actions';
import storageTurnsTurns from '@/store/modules/storage/turns/turns';
import storageGameConfig from '@/store/modules/storage/gameConfig';
import storageHands from '@/store/modules/storage/hands';
import storageSearch from '@/store/modules/storage/search';

import utilsFetchHandler from '@/store/modules/utils/fetchHandler';

const store = createStore({
    modules: {
        authentication: {
            namespaced: true,
            modules: {
                interactions: authenticationInteractions,
                user: authenticationUser,
                tokens: authenticationTokens,
            },
        },
        storage: {
            namespaced: true,
            modules: {
                cards: {
                    namespaced: true,
                    modules: {
                        cards: storageCardsCards,
                    },
                },
                gameConfig: storageGameConfig,
                hands: storageHands,
                matches: {
                    namespaced: true,
                    modules: {
                        list: storageMatchesList,
                        matches: storageMatchesMatches,
                    },
                },
                players: {
                    namespaced: true,
                    modules: {
                        match: storagePlayersMatch,
                        round: storagePlayersRound,
                        nonSelf: storagePlayersNonSelf,
                        self: storagePlayersSelf,
                    },
                },
                registry: {
                    namespaced: true,
                    modules: {
                        matchAction: storageRegistryMatchAction,
                        matchRound: storageRegistryMatchRound,
                        roundTurn: storageRegistryRoundTurn,
                    },
                },
                rounds: {
                    namespaced: true,
                    modules: {
                        discardPiles: storageRoundsDiscardPiles,
                        melds: storageRoundsMelds,
                        stockPiles: storageRoundsStockPiles,
                    },
                },
                search: storageSearch,
                sse: {
                    namespaced: true,
                    modules: {
                        connection: storageSseConnection,
                        dataProcessor: storageSseDataProcessor,
                    },
                },
                turns: {
                    namespaced: true,
                    modules: {
                        actions: storageTurnsActions,
                        turns: storageTurnsTurns,
                    },
                },
            },
        },
        sessionState: {
            namespaced: true,
            modules: {
                derived: {
                    namespaced: true,
                    modules: {
                        discardPile: sessionStateDerivedDiscardPile,
                        draw: sessionStateDerivedDraw,
                        hand: sessionStateDerivedHand,
                        players: sessionStateDerivedPlayers,
                        rounds: sessionStateDerivedRounds,
                        selected: sessionStateDerivedSelected,
                        stockPile: sessionStateDerivedStockPile,
                        turns: sessionStateDerivedTurns,
                    },
                },
                error: sessionStateError,
                fetch: sessionStateFetch,
                loading: sessionStateLoading,
                matchPhase: sessionStateMatchPhase,
                permissions: {
                    namespaced: true,
                    modules: {
                        core: sessionStatePermissionsCore,
                        discard: sessionStatePermissionsDiscard,
                        draw: sessionStatePermissionsDraw,
                        melds: sessionStatePermissionsMelds,
                    },
                },
                selections: sessionStateSelections,
            },
        },
        utils: {
            namespaced: true,
            modules: {
                fetchHandler: utilsFetchHandler,
            }
        }
    },
});

export default store;
