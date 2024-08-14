import {mapGetters} from "vuex";

export default {
    computed: {
        ...mapGetters({
            canAct: 'trackers/permissions/core/canAct',
            canDraw: 'trackers/permissions/draw/canDraw',
        }),
    },
    methods: {
        isCardAvailableForHandAfterDrawMultipleAction() {
            const selectedCardCount = this.selectedHandCardCount + this.selectedDiscardPileCardCount;
            return selectedCardCount < (this.currentHandCardIds.length + this.countSelectedAndHigherDiscardPileCards);
        },
        canDrawOne() {
            return this.canDraw && this.hasNoHandCardsSelected && !this.selectedMeldId;
        },
        canDrawMultiple() {
            return this.canDraw && this.hasPlayedMeld;
        },
        canDrawFromStockPile() {
            return this.canDrawOne() && this.hasNoDiscardPileCardsSelected;
        },
        canDrawOneFromDiscardPile() {
            return this.canDrawOne() && this.isOnlyTopDiscardPileCardSelected;
        },
        canDrawMultipleFromDiscardPile() {
            return this.canDrawMultiple() &&
                this.isRotationThatAllowsMelds() &&
                this.isAnyDiscardPileCardSelected &&
                this.isAnyDiscardPileCardSelectedBelowTop &&
                this.isCardAvailableForHandAfterDrawMultipleAction() &&
                this.doSelectedCardsFormValidMeld();
        },
        canPlayMeld() {
            return this.canAct &&
                this.hasDrawActionInCurrentTurn &&
                !this.selectedMeldId &&
                this.isRotationThatAllowsMelds() &&
                this.isEnoughCardsForMeld(this.selectedHandCards) &&
                !this.hasAllHandCardsSelected;
        },
        canPlayRun() {
            return this.canPlayMeld() && this.doSelectedHandCardsMakeValidRun();
        },
        canPlaySet() {
            return this.canPlayMeld() && this.areAllCardsOfSameRank(this.selectedHandCards);
        },
        canExtendMeld() {
            return this.canAct &&
                this.hasDrawActionInCurrentTurn &&
                this.hasPlayedMeld &&
                this.selectedMeldId &&
                this.isRotationThatAllowsMelds() &&
                !this.hasNoHandCardsSelected &&
                !this.hasAllHandCardsSelected &&
                this.isValidMeldExtension();
        },
        canDiscard() {
            return this.canAct && this.hasDrawActionInCurrentTurn && !this.selectedMeldId && this.hasOneHandCardSelected;
        }
    }
};
