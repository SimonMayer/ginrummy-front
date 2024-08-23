import {mapActions, mapGetters} from 'vuex';

export const touchHandlingMixin = {
    computed: {
        ...mapGetters({
            isDrag: 'sessionState/uiOperations/touchState/isDrag',
            touchPayload: 'sessionState/uiOperations/touchState/payload',
        }),
    },
    methods: {
        ...mapActions({
            endTouchEvent: 'sessionState/uiOperations/touchState/endTouchEvent',
            setTouchMoveCoordinates: 'sessionState/uiOperations/touchState/setTouchMoveCoordinates',
            startTouchEvent: 'sessionState/uiOperations/touchState/startTouchEvent',
        }),
        handleTouchstart(event, payload) {
            this.startTouchEvent({event, payload});
            event.preventDefault();
        },
        handleTouchmove(event) {
            const movedElement = event.touches[0];
            this.setTouchMoveCoordinates({x: movedElement.clientX, y: movedElement.clientY});
        },
        async handleTouchend(event) {
            const result = await this.endTouchEvent(event);

            if (result.isDrag) {
                this.handleDragend();
            }
            if (result.isClick) {
                this.handleClick();
            }
        },
    },
    watch: {
        isDrag(isDragBehaviour, wasDragBehaviour) {
            if (!wasDragBehaviour && isDragBehaviour) {
                this.preHandleDragstart();
            }
        },
    },
};
