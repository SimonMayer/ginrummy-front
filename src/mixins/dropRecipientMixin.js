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
        handleDragenter(event, callback) {
            if (
                (event.relatedTarget === event.currentTarget) ||
                event.currentTarget.contains(event.relatedTarget) ||
                event.currentTarget.contains(event.target)
            ) {
                this.isBeingDraggedOver = true;
                if (callback && typeof callback === 'function') {
                    callback();
                }
            }
        },
        handleDragleave(event, callback) {
            if (event.relatedTarget !== event.currentTarget && !event.currentTarget.contains(event.relatedTarget)) {
                this.isBeingDraggedOver = false;
                if (callback && typeof callback === 'function') {
                    callback();
                }
            }
        },
    },
};
