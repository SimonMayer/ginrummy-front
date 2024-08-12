import { createStore } from 'vuex';
import auth from '@/store/modules/auth';
import cards from '@/store/modules/cards';
import error from '@/store/modules/error';
import fetchStatus from '@/store/modules/fetchStatus';
import gameConfig from '@/store/modules/gameConfig';
import hands from '@/store/modules/hands';
import loading from '@/store/modules/loading';
import matches from '@/store/modules/matches';
import matchActionRegistry from '@/store/modules/matchActionRegistry';
import matchRoundRegistry from '@/store/modules/matchRoundRegistry';
import melds from '@/store/modules/melds';
import players from '@/store/modules/players';
import rounds from "@/store/modules/rounds";
import roundTurnRegistry from '@/store/modules/roundTurnRegistry';
import search from '@/store/modules/search';
import selections from '@/store/modules/selections';
import turns from '@/store/modules/turns';

const store = createStore({
    modules: {
        auth,
        cards,
        error,
        fetchStatus,
        gameConfig,
        hands,
        loading,
        matches,
        matchActionRegistry,
        matchRoundRegistry,
        melds,
        players,
        rounds,
        roundTurnRegistry,
        search,
        selections,
        turns,
    }
});

export default store;
