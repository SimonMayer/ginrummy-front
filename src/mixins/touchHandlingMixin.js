import {mapActions, mapGetters} from 'vuex';

export const touchHandlingMixin = {
    data() {
        return {
            allowClick: false,
            allowDrag: false,
            allowLongPress: false,
        };
    },
    computed: {
        ...mapGetters({
            isDrag: 'sessionState/uiOperations/touchState/isDrag',
            touchPayload: 'sessionState/uiOperations/touchState/payload',
            source: 'sessionState/uiOperations/touchState/source',
        }),
    },
    methods: {
        ...mapActions({
            endTouchEvent: 'sessionState/uiOperations/touchState/endTouchEvent',
            setTouchMoveCoordinates: 'sessionState/uiOperations/touchState/setTouchMoveCoordinates',
            startTouchEvent: 'sessionState/uiOperations/touchState/startTouchEvent',
        }),
        handleTouchstart(event, payload = null) {
            this.startTouchEvent({event, payload, source: this.componentSpecificTouchSource});
            event.preventDefault();
        },
        handleTouchmove(event) {
            const movedElement = event.touches[0];
            this.setTouchMoveCoordinates({x: movedElement.clientX, y: movedElement.clientY});
        },
        async handleTouchend(event) {
            const result = await this.endTouchEvent(event);

            if (this.allowClick && result.isClick) {
                this.handleClick();
            }
            if (this.allowDrag && result.isDrag) {
                this.handleDragend();
            }
            if (this.allowLongPress && result.isLongPress) {
                this.handleLongPress();
            }
        },
    },
    watch: {
        isDrag(isDragBehaviour, wasDragBehaviour) {
            if (
                this.allowDrag &&
                !wasDragBehaviour &&
                isDragBehaviour &&
                this.source === this.componentSpecificTouchSource
            ) {
                this.preHandleDragstartFromTouch();
            }
        },
    },
};
