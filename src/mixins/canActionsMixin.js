import {mapGetters} from "vuex";

export default {
    computed: {
        ...mapGetters({
            canAct: 'trackers/permissions/core/canAct',
            canDraw: 'trackers/permissions/draw/canDraw',
            canDrawOne: 'trackers/permissions/draw/canDrawOne',
            canDrawFromStockPile: 'trackers/permissions/draw/canDrawFromStockPile',
            canDrawOneFromDiscardPile: 'trackers/permissions/draw/canDrawOneFromDiscardPile',
            canDiscard: 'trackers/permissions/discard/canDiscard',
            canPlayMeldFromHand: 'trackers/permissions/melds/canPlayMeldFromHand',
            canPlayRunFromHand: 'trackers/permissions/melds/canPlayRunFromHand',
            canPlaySetFromHand: 'trackers/permissions/melds/canPlaySetFromHand',
            canExtendMeldFromHand: 'trackers/permissions/melds/canExtendMeldFromHand',
        }),
    },
    methods: {
        isCardAvailableForHandAfterDrawMultipleAction() {
            const selectedCardCount = this.selectedHandCardCount + this.selectedDiscardPileCardCount;
            return selectedCardCount < (this.currentHandCardIds.length + this.countSelectedAndHigherDiscardPileCards);
        },
        canDrawMultiple() {
            return this.canDraw && this.hasPlayedMeld;
        },
        canDrawMultipleFromDiscardPile() {
            return this.canDrawMultiple() &&
                this.isRotationThatAllowsMelds() &&
                this.isAnyDiscardPileCardSelected &&
                this.isAnyDiscardPileCardSelectedBelowTop &&
                this.isCardAvailableForHandAfterDrawMultipleAction() &&
                this.doSelectedCardsFormValidMeld();
        },
    }
};
