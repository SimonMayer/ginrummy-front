import { createStore } from 'vuex';
import auth from './modules/auth';
import cards from './modules/cards';
import currentRound from './modules/currentRound';
import currentTurn from './modules/currentTurn';
import error from './modules/error';
import fetchStatus from './modules/fetchStatus';
import gameConfig from './modules/gameConfig';
import hand from './modules/hand';
import loading from './modules/loading';
import matches from './modules/matches';
import melds from './modules/melds';
import players from './modules/players';
import search from './modules/search';

const store = createStore({
    modules: {
        auth,
        cards,
        currentRound,
        currentTurn,
        error,
        fetchStatus,
        gameConfig,
        hand,
        loading,
        matches,
        melds,
        players,
        search,
    }
});

export default store;
