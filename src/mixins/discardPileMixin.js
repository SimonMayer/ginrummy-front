import {mapGetters} from "vuex";

export default {
    computed: {
        ...mapGetters({
            currentDiscardPileCardIds: 'trackers/derived/discardPile/currentDiscardPileCardIds',
            currentTopDiscardPileCard: 'trackers/derived/discardPile/currentTopDiscardPileCard',
            currentTopDiscardPileCardId: 'trackers/derived/discardPile/currentTopDiscardPileCardId',
            countSelectedAndHigherDiscardPileCards: 'trackers/derived/selected/countSelectedAndHigherDiscardPileCards',
            hasNoDiscardPileCardsSelected: 'trackers/derived/selected/hasNoDiscardPileCardsSelected',
            hasOneDiscardPileCardSelected: 'trackers/derived/selected/hasOneDiscardPileCardSelected',
            isAnyDiscardPileCardSelected: 'trackers/derived/selected/isAnyDiscardPileCardSelected',
            isAnyDiscardPileCardSelectedBelowTop: 'trackers/derived/selected/isAnyDiscardPileCardSelectedBelowTop',
            isOnlyTopDiscardPileCardSelected: 'trackers/derived/selected/isOnlyTopDiscardPileCardSelected',
            lowestSelectedCardIdInDiscardPile: 'trackers/derived/selected/lowestSelectedCardIdInDiscardPile',
            selectedDiscardPileCardCount: 'trackers/derived/selected/selectedDiscardPileCardCount',
            selectedDiscardPileCardIds: 'trackers/derived/selected/selectedDiscardPileCardIds',
            selectedDiscardPileCards: 'trackers/derived/selected/selectedDiscardPileCards',
        }),
    },
    methods: {
        getSelectableDiscardPileCards() {
            return this.canDrawMultiple()
                ? this.currentRoundDiscardPile
                : this.canDrawOne ? [this.currentTopDiscardPileCard] : [];
        },
    }
};
