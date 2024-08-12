export default {
    methods: {
        isCardAvailableForHandAfterDrawMultipleAction() {
            const selectedCardCount = this.selectedHandCardCount + this.selectedDiscardPileCardCount;
            return selectedCardCount < (this.currentRoundHandCards.length + this.getDiscardPileCardsStartingFromBottomSelectedCard().length);
        },
        canAct() {
            return this.isCurrentUserTurn && !this.loading;
        },
        canDraw() {
            return this.canAct() && !this.hasDrawAction;
        },
        canDrawOne() {
            return this.canDraw() && this.hasNoHandCardsSelected() && !this.selectedMeld;
        },
        canDrawMultiple() {
            return this.canDraw() && this.hasPlayedMeld;
        },
        canDrawFromStockPile() {
            return this.canDrawOne() && this.hasNoDiscardPileCardsSelected();
        },
        canDrawOneFromDiscardPile() {
            return this.canDrawOne() && this.isOnlyTopDiscardPileCardSelected();
        },
        canDrawMultipleFromDiscardPile() {
            return this.canDrawMultiple() &&
                this.isRotationThatAllowsMelds() &&
                this.isAnyDiscardPileCardSelected() &&
                !this.isBottomSelectedDiscardPileCardAtTheTop() &&
                this.isCardAvailableForHandAfterDrawMultipleAction() &&
                this.doSelectedCardsFormValidMeld();
        },
        canPlayMeld() {
            return this.canAct() &&
                this.hasDrawAction &&
                !this.selectedMeld &&
                this.isRotationThatAllowsMelds() &&
                this.isEnoughCardsForMeld(this.selectedHandCards) &&
                !this.hasAllHandCardsSelected();
        },
        canPlayRun() {
            return this.canPlayMeld() && this.doSelectedHandCardsMakeValidRun();
        },
        canPlaySet() {
            return this.canPlayMeld() && this.areAllCardsOfSameRank(this.selectedHandCards);
        },
        canExtendMeld() {
            return this.canAct() &&
                this.hasDrawAction &&
                this.hasPlayedMeld &&
                this.selectedMeld &&
                this.isRotationThatAllowsMelds() &&
                !this.hasNoHandCardsSelected() &&
                !this.hasAllHandCardsSelected() &&
                this.isValidMeldExtension();
        },
        canDiscard() {
            return this.canAct() && this.hasDrawAction && !this.selectedMeld && this.hasOneHandCardSelected();
        }
    }
};
