import {mapGetters} from 'vuex';
import meldsService from '@/services/meldsService';

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
        doCardsMakeValidRun(cards) {
            return meldsService.doCardsMakeValidRun(cards, this.runOrders);
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
                (meldsService.areAllCardsOfSameRank(allSelectedCards) || this.doCardsMakeValidRun(allSelectedCards));
        },
        isValidMeldExtension() {
            if (!this.selectedMeldId || this.hasNoHandCardsSelected || this.hasAllHandCardsSelected) {
                return false;
            }
            const cards = [...this.selectedMeldCards, ...this.selectedHandCards];
            return meldsService.doCardsMakeValidMeld(cards, this.runOrders);
        },
    }
};
