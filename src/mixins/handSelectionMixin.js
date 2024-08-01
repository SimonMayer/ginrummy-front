export default {
    methods: {
        hasNoHandCardsSelected() {
            return this.getSelectedHandCardCount() === 0;
        },
        hasOneHandCardSelected() {
            return this.getSelectedHandCardCount() === 1;
        },
        hasAllHandCardsSelected() {
            return this.getSelectedHandCardCount() === this.myHand.length;
        },
        getSelectedHandCards() {
            return this.getSelectedCards('player-self').map(card => card.cardData);
        },
        getSelectedHandCardCount() {
            return this.getSelectedHandCards().length;
        },
        unselectHandCards() {
            this.unselectCardsByRef('player-self');
        }
    }
};
