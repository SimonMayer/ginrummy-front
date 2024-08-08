export default {
    methods: {
        hasNoHandCardsSelected() {
            return this.getSelectedHandCardCount() === 0;
        },
        hasOneHandCardSelected() {
            return this.getSelectedHandCardCount() === 1;
        },
        hasAllHandCardsSelected() {
            return this.getSelectedHandCardCount() === this.currentRoundHandCards.length;
        },
        isCardAvailableForHandAfterDrawMultipleAction() {
            const selectedCardCount = this.getSelectedHandCardCount() + this.getSelectedDiscardPileCardCount();
            return selectedCardCount < (this.currentRoundHandCards.length + this.getDiscardPileCardsStartingFromBottomSelectedCard().length);
        },
        hasNoDiscardPileCardsSelected() {
            return this.getSelectedDiscardPileCardCount() === 0;
        },
        hasOneDiscardPileCardSelected() {
            return this.getSelectedDiscardPileCardCount() === 1;
        },
        isOnlyTopDiscardPileCardSelected() {
            return this.hasOneDiscardPileCardSelected() && this.getTopDiscardPileCard().card_id === this.getSelectedDiscardPileCards()[0]?.card_id;
        },
        isAnyDiscardPileCardSelected() {
            return this.getSelectedDiscardPileCardCount() > 0;
        },
        isBottomSelectedDiscardPileCardAtTheTop() {
            return this.getBottomSelectedCardInDiscardPile().card_id === this.getTopDiscardPileCard().card_id;
        },
        areAllCardsOfSameRank(cards) {
            return cards.every(card => card.rank === cards[0].rank);
        },
        areAllCardsOfSameSuit(cards) {
            return cards.every(card => card.suit === cards[0].suit);
        },
        doCardsMakeValidRun(cards) {
            return this.areAllCardsOfSameSuit(cards) && this.runOrders.some(order => {
                const ranks = cards.map(card => card.rank);
                const indices = ranks.map(rank => order.indexOf(rank)).sort((a, b) => a - b);
                return indices.every((index, i) => i === 0 || index === indices[i - 1] + 1);
            });
        },
        doSelectedHandCardsMakeValidRun() {
            return this.doCardsMakeValidRun(this.getSelectedHandCards());
        },
        isEnoughCardsForMeld(cards) {
            return cards.length >= this.minimumMeldSize;
        },
        doSelectedCardsFormValidMeld() {
            const allSelectedCards = this.getAllSelectedCards();
            return this.isEnoughCardsForMeld(allSelectedCards) &&
                (this.areAllCardsOfSameRank(allSelectedCards) || this.doCardsMakeValidRun(allSelectedCards));
        },
        isValidMeldExtension() {
            if (!this.selectedMeld || this.hasNoHandCardsSelected() || this.hasAllHandCardsSelected()) {
                return false;
            }
            const allCards = [...this.getSelectedMeldCards(), ...this.getSelectedHandCards()];
            return this.areAllCardsOfSameRank(allCards) || this.doCardsMakeValidRun(allCards);
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
                this.isEnoughCardsForMeld(this.getSelectedHandCards()) &&
                !this.hasAllHandCardsSelected();
        },
        canPlayRun() {
            return this.canPlayMeld() && this.doSelectedHandCardsMakeValidRun();
        },
        canPlaySet() {
            return this.canPlayMeld() && this.areAllCardsOfSameRank(this.getSelectedHandCards());
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
