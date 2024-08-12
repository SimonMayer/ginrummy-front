import {mapGetters} from "vuex";

export default {
    computed: {
        ...mapGetters({
            getSelectedDiscardPileCardIdsByRoundId: 'rounds/getSelectedDiscardPileCardIdsByRoundId',
            getSelectedDiscardPileCardsByRoundId: 'rounds/getSelectedDiscardPileCardsByRoundId',
        }),
        selectedDiscardPileCards() {
            return this.currentRoundId ? this.getSelectedDiscardPileCardsByRoundId(this.currentRoundId) : [];
        },
        selectedDiscardPileCardIds() {
            return this.currentRoundId ? this.getSelectedDiscardPileCardIdsByRoundId(this.currentRoundId) : [];
        },
        selectedDiscardPileCardCount() {
            return this.selectedDiscardPileCardIds.length
        },
    },
    methods: {
        getTopDiscardPileCard() {
            const discardPile = this.currentRoundDiscardPile;
            return discardPile ? discardPile[discardPile.length - 1] : null;
        },
        getDiscardPileCardsStartingFromBottomSelectedCard() {
            const discardPile = this.currentRoundDiscardPile;
            const bottomCardIndex = discardPile.findIndex(card => card.card_id === this.getBottomSelectedCardInDiscardPile().card_id);
            return discardPile.slice(bottomCardIndex);
        },
        getSelectableDiscardPileCards() {
            return this.canDrawMultiple()
                ? this.currentRoundDiscardPile
                : this.canDrawOne() ? [this.getTopDiscardPileCard()] : [];
        },
        getBottomSelectedCardInDiscardPile() {
            return this.selectedDiscardPileCards ? this.selectedDiscardPileCards[0] : null;
        },
        hasNoDiscardPileCardsSelected() {
            return this.selectedDiscardPileCardCount === 0;
        },
        hasOneDiscardPileCardSelected() {
            return this.selectedDiscardPileCardCount === 1;
        },
        isOnlyTopDiscardPileCardSelected() {
            return this.hasOneDiscardPileCardSelected() && this.getTopDiscardPileCard().card_id === this.selectedDiscardPileCardIds[0];
        },
        isAnyDiscardPileCardSelected() {
            return this.selectedDiscardPileCardCount > 0;
        },
        isBottomSelectedDiscardPileCardAtTheTop() {
            return this.getBottomSelectedCardInDiscardPile().card_id === this.getTopDiscardPileCard().card_id;
        }
    }
};
