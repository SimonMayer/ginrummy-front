import {mapGetters} from "vuex";

export default {
    computed: {
        ...mapGetters({
            getSelectedCardIdsByHandId: 'hands/getSelectedCardIdsByHandId',
            getSelectedCardsByHandId: 'hands/getSelectedCardsByHandId',
        }),
        selectedHandCards() {
            return this.currentRoundHandId ? this.getSelectedCardsByHandId(this.currentRoundHandId) : [];
        },
        selectedHandCardIds() {
            return this.currentRoundHandId ? this.getSelectedCardIdsByHandId(this.currentRoundHandId) : [];
        },
        selectedHandCardCount() {
            return this.selectedHandCardIds.length
        },
    },
    methods: {
        hasNoHandCardsSelected() {
            return this.selectedHandCardCount === 0;
        },
        hasOneHandCardSelected() {
            return this.selectedHandCardCount === 1;
        },
        hasAllHandCardsSelected() {
            return this.selectedHandCardCount === this.currentRoundHandCards.length;
        },
    }
};
