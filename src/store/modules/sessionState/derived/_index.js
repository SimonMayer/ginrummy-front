import discardPile from '@/store/modules/sessionState/derived/discardPile';
import draggedItems from '@/store/modules/sessionState/derived/draggedItems';
import hand from '@/store/modules/sessionState/derived/hand';
import match from '@/store/modules/sessionState/derived/match';
import melds from '@/store/modules/sessionState/derived/melds';
import players from '@/store/modules/sessionState/derived/players';
import rounds from '@/store/modules/sessionState/derived/rounds';
import selectedItems from '@/store/modules/sessionState/derived/selectedItems';
import stockPile from '@/store/modules/sessionState/derived/stockPile';
import turn from '@/store/modules/sessionState/derived/turn';

export default {
    discardPile,
    draggedItems,
    hand,
    match,
    melds,
    players,
    rounds,
    selectedItems,
    stockPile,
    turn,
};
