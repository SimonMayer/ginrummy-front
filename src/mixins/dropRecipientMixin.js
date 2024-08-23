import {mapActions, mapGetters} from 'vuex';

export const dropRecipientMixin = {
    data() {
        return {
            isBeingDraggedOver: false,
        };
    },
    computed: {
        ...mapGetters({
            isDraggingItems: 'sessionState/uiOperations/dragState/isDraggingItems',
            elementAtTouchCoordinates: 'sessionState/uiOperations/touchState/elementAtTouchCoordinates',
        }),
        isBeingTouchDraggedOver() {
            const dropArea = this.$refs[this.componentSpecificDropAreaRef];
            return this.elementAtTouchCoordinates && dropArea && dropArea.contains(this.elementAtTouchCoordinates);
        },
        provisionallyInvitesDrop() {
            return !this.isBeingDraggedOver && !this.isBeingTouchDraggedOver && this.isDraggingItems;
        },
        provisionallyAcceptsDrop() {
            return (this.isBeingDraggedOver && this.isDraggingItems) || this.isBeingTouchDraggedOver;
        },
        invitesDrop() {
            return this.provisionallyInvitesDrop && (this.componentSpecificDropCriteria ?? false);
        },
        acceptsDrop() {
            return this.provisionallyAcceptsDrop && (this.componentSpecificDropCriteria ?? false);
        },
    },
    methods: {
        ...mapActions({
            clearDraggedItems: 'sessionState/uiOperations/dragState/clearDraggedItems',
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
        async handleDrop() {
            await this.componentSpecificDropHandler();
            this.clearDraggedItems();
        },
    },
    watch: {
        isDraggingItems(isDragging, wasDragging) {
            if (this.isBeingTouchDraggedOver && wasDragging && !isDragging) {
                this.handleDrop();
            }
        },
    },
};
