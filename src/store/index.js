import {createStore} from 'vuex';
import authenticationInteractions from '@/store/modules/authentication/interactions';
import authenticationTokens from '@/store/modules/authentication/tokens';
import authenticationUser from '@/store/modules/authentication/user';

import sessionStateDerivedDiscardPile from '@/store/modules/sessionState/derived/discardPile';
import sessionStateDerivedHand from '@/store/modules/sessionState/derived/hand';
import sessionStateDerivedPlayers from '@/store/modules/sessionState/derived/players';
import sessionStateDerivedRounds from '@/store/modules/sessionState/derived/rounds';
import sessionStateDerivedSelectedItems from '@/store/modules/sessionState/derived/selectedItems';
import sessionStateDerivedStockPile from '@/store/modules/sessionState/derived/stockPile';
import sessionStateDerivedTurn from '@/store/modules/sessionState/derived/turn';
import sessionStatePermissionsCore from '@/store/modules/sessionState/permissions/core';
import sessionStatePermissionsDiscard from '@/store/modules/sessionState/permissions/discard';
import sessionStatePermissionsDraw from '@/store/modules/sessionState/permissions/draw';
import sessionStatePermissionsMelds from '@/store/modules/sessionState/permissions/melds';
import sessionStateError from '@/store/modules/sessionState/error';
import sessionStateFetchRecords from '@/store/modules/sessionState/fetchRecords';
import sessionStateLoading from '@/store/modules/sessionState/loading';
import sessionStateMatchIdentifier from '@/store/modules/sessionState/matchIdentifier';
import sessionStateSelections from '@/store/modules/sessionState/selections';

import storageCardsCards from '@/store/modules/storage/cards/cards';
import storageMatchesList from '@/store/modules/storage/matches/list';
import storageMatchesMatches from '@/store/modules/storage/matches/matches';
import storagePlayersMatchData from '@/store/modules/storage/players/matchData';
import storagePlayersRoundData from '@/store/modules/storage/players/roundData';
import storagePlayersNonSelf from '@/store/modules/storage/players/nonSelf';
import storagePlayersSelf from '@/store/modules/storage/players/self';
import storageRegistryMatchActions from '@/store/modules/storage/registry/matchActions';
import storageRegistryMatchRounds from '@/store/modules/storage/registry/matchRounds';
import storageRegistryRoundTurns from '@/store/modules/storage/registry/roundTurns';
import storageRoundsDiscardPiles from '@/store/modules/storage/rounds/discardPiles';
import storageRoundsMelds from '@/store/modules/storage/rounds/melds';
import storageRoundsStockPiles from '@/store/modules/storage/rounds/stockPiles';
import storageSearchSearches from '@/store/modules/storage/search/searches';
import storageSearchSearchFunctions from '@/store/modules/storage/search/searchFunctions';
import storageSseConnection from '@/store/modules/storage/sse/connection';
import storageSseDataProcessor from '@/store/modules/storage/sse/dataProcessor';
import storageTurnsActions from '@/store/modules/storage/turns/actions';
import storageTurnsTurns from '@/store/modules/storage/turns/turns';
import storageGameConfig from '@/store/modules/storage/gameConfig';
import storageHands from '@/store/modules/storage/hands';

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
                        match: storagePlayersMatchData,
                        round: storagePlayersRoundData,
                        nonSelf: storagePlayersNonSelf,
                        self: storagePlayersSelf,
                    },
                },
                registry: {
                    namespaced: true,
                    modules: {
                        matchActions: storageRegistryMatchActions,
                        matchRounds: storageRegistryMatchRounds,
                        roundTurns: storageRegistryRoundTurns,
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
                search: {
                    namespaced:true,
                    modules:{
                        searches: storageSearchSearches,
                        searchFunctions: storageSearchSearchFunctions,
                    }
                },
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
                        hand: sessionStateDerivedHand,
                        players: sessionStateDerivedPlayers,
                        rounds: sessionStateDerivedRounds,
                        selectedItems: sessionStateDerivedSelectedItems,
                        stockPile: sessionStateDerivedStockPile,
                        turn: sessionStateDerivedTurn,
                    },
                },
                error: sessionStateError,
                fetchRecords: sessionStateFetchRecords,
                loading: sessionStateLoading,
                matchIdentifier: sessionStateMatchIdentifier,
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
