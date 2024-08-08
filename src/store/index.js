import { createStore } from 'vuex';
import auth from '@/store/modules/auth';
import cards from '@/store/modules/cards';
import currentRound from '@/store/modules/currentRound';
import currentTurn from '@/store/modules/currentTurn';
import error from '@/store/modules/error';
import fetchStatus from '@/store/modules/fetchStatus';
import gameConfig from '@/store/modules/gameConfig';
import hand from '@/store/modules/hand';
import loading from '@/store/modules/loading';
import matches from '@/store/modules/matches';
import melds from '@/store/modules/melds';
import players from '@/store/modules/players';
import rounds from "@/store/modules/rounds";
import search from '@/store/modules/search';

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
        rounds,
        search,
    }
});

export default store;
