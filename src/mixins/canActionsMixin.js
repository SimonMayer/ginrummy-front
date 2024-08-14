import {mapGetters} from "vuex";
import meldsService from '@/services/meldsService';

export default {
    computed: {
        ...mapGetters({
            canAct: 'trackers/permissions/core/canAct',
            canDraw: 'trackers/permissions/draw/canDraw',
            canDrawOne: 'trackers/permissions/draw/canDrawOne',
            canDrawFromStockPile: 'trackers/permissions/draw/canDrawFromStockPile',
            canDrawOneFromDiscardPile: 'trackers/permissions/draw/canDrawOneFromDiscardPile',
        }),
    },
    methods: {
        isCardAvailableForHandAfterDrawMultipleAction() {
            const selectedCardCount = this.selectedHandCardCount + this.selectedDiscardPileCardCount;
            return selectedCardCount < (this.currentHandCardIds.length + this.countSelectedAndHigherDiscardPileCards);
        },
        canDrawMultiple() {
            return this.canDraw && this.hasPlayedMeld;
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
            return this.canPlayMeld() && meldsService.areAllCardsOfSameRank(this.selectedHandCards);
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
