import {mapActions, mapGetters} from 'vuex';

export const dropRecipientMixin = {
    data() {
        return {
            isBeingDraggedOver: false,
        };
    },
    computed: {
        ...mapGetters({
            isDraggingCards: 'sessionState/uiOperations/dragState/isDraggingCards',
        }),
        provisionallyAcceptsDrop() {
            return this.isBeingDraggedOver && this.isDraggingCards;
        },
    },
    methods: {
        ...mapActions({
            clearDraggedCards: 'sessionState/uiOperations/dragState/clearDraggedCards',
        }),
        handleDragenter(event) {
            if ((event.relatedTarget === event.currentTarget) || event.currentTarget.contains(event.relatedTarget)) {
                this.isBeingDraggedOver = true;
            }
        },
        handleDragleave(event) {
            if (event.relatedTarget !== event.currentTarget && !event.currentTarget.contains(event.relatedTarget)) {
                this.isBeingDraggedOver = false;
            }
        },
    },
};
