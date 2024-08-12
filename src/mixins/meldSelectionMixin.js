export default {
    methods: {
        getAllSelectedCards() {
            return [...this.getSelectedMeldCards(), ...this.selectedHandCards, ...this.selectedDiscardPileCards];
        },
        getSelectedMeldCards() {
            return this.selectedMeld ? this.selectedMeld.cards : [];
        },
        unselectMeld() {
            this.selectedMeld = null;
        },
        handleMeldClick(meldId) {
            const meld = this.visibleRoundMelds.find(meld => meld.meld_id === meldId);
            this.selectedMeld = !meld || (this.selectedMeldId === meldId) ? null : meld;
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
            return this.doCardsMakeValidRun(this.selectedHandCards);
        },
        isEnoughCardsForMeld(cards) {
            return cards.length >= this.minimumMeldSize;
        },
        isRotationThatAllowsMelds(){
            return this.currentTurn &&
                this.currentTurn.rotationNumber != null &&
                this.currentTurn.rotationNumber >= this.allowMeldsFromRotation;
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
            const allCards = [...this.getSelectedMeldCards(), ...this.selectedHandCards];
            return this.areAllCardsOfSameRank(allCards) || this.doCardsMakeValidRun(allCards);
        },
    }
};
