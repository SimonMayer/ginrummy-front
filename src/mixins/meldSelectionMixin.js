import {mapGetters} from 'vuex';

export default {
    computed: {
        ...mapGetters({
            selectedMeld: 'trackers/derived/selected/selectedMeld',
            selectedMeldCards: 'trackers/derived/selected/selectedMeldCards',
            selectedMeldId: 'trackers/selections/selectedMeldId',
        }),
    },
    methods: {
        getAllSelectedCards() {
            return [...this.selectedMeldCards, ...this.selectedHandCards, ...this.selectedDiscardPileCards];
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
            if (!this.selectedMeldId || this.hasNoHandCardsSelected || this.hasAllHandCardsSelected) {
                return false;
            }
            const allCards = [...this.selectedMeldCards, ...this.selectedHandCards];
            return this.areAllCardsOfSameRank(allCards) || this.doCardsMakeValidRun(allCards);
        },
    }
};
