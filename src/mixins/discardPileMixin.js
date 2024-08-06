export default {
    methods: {
        getTopDiscardPileCard() {
            const discardPile = this.currentRound.discardPile;
            return discardPile ? discardPile[discardPile.length - 1] : null;
        },
        getDiscardPileCardsStartingFromBottomSelectedCard() {
            const discardPile = this.currentRound.discardPile;
            const bottomCardIndex = discardPile.findIndex(card => card.card_id === this.getBottomSelectedCardInDiscardPile().card_id);
            return discardPile.slice(bottomCardIndex);
        },
        getSelectableDiscardPileCards() {
            return this.canDrawMultiple()
                ? this.currentRound.discardPile
                : this.canDrawOne() ? [this.getTopDiscardPileCard()] : [];
        },
        getSelectedDiscardPileCards() {
            return this.getSelectedCards('discard-pile').map(card => card.cardData);
        },
        getSelectedDiscardPileCardCount() {
            return this.getSelectedDiscardPileCards().length;
        },
        getBottomSelectedCardInDiscardPile() {
            const selectedDiscardPileCards = this.getSelectedDiscardPileCards();
            return selectedDiscardPileCards ? selectedDiscardPileCards[0] : null;
        },
        unselectDiscardPileCards() {
            this.unselectCardsByRef('discard-pile');
        },
        isCardAvailableForHandAfterDrawMultipleAction() {
            const selectedCardCount = this.getSelectedHandCardCount() + this.getSelectedDiscardPileCardCount();
            return selectedCardCount < (this.myHand.length + this.getDiscardPileCardsStartingFromBottomSelectedCard().length);
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
        }
    }
};
