import { createStore } from 'vuex';
import auth from '@/store/modules/auth';
import cards from '@/store/modules/cards';
import currentTurn from '@/store/modules/currentTurn';
import error from '@/store/modules/error';
import fetchStatus from '@/store/modules/fetchStatus';
import gameConfig from '@/store/modules/gameConfig';
import hand from '@/store/modules/hand';
import loading from '@/store/modules/loading';
import matches from '@/store/modules/matches';
import matchRoundRegistry from '@/store/modules/matchRoundRegistry';
import melds from '@/store/modules/melds';
import players from '@/store/modules/players';
import rounds from "@/store/modules/rounds";
import search from '@/store/modules/search';

const store = createStore({
    modules: {
        auth,
        cards,
        currentTurn,
        error,
        fetchStatus,
        gameConfig,
        hand,
        loading,
        matches,
        matchRoundRegistry,
        melds,
        players,
        rounds,
        search,
    }
});

export default store;
