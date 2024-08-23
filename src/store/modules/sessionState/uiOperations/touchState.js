const MAXIMUM_CLICK_MILLISECONDS = 400;
const MAXIMUM_CLICK_MOVEMENT = 10;

const state = {
    payload: null,
    startTime: null,
    startPosition: null,
    interimPosition: null,
    endTime: null,
    endPosition: null,
    elementAtTouchCoordinates: null,
    isDrag: false,
};

const mutations = {
    RECORD_TOUCH_START(state, {x, y, payload}) {
        state.payload = payload;
        state.startTime = Date.now();
        state.startPosition = {x, y};
        state.interimPosition = null;
        state.endTime = null;
        state.endPosition = null;
        state.isDrag = false;
    },
    RECORD_HAS_BECOME_DRAG(state) {
        state.isDrag = true;
    },
    RECORD_INTERIM_POSITION(state, {x, y}) {
        state.interimPosition = {x, y};
    },
    RECORD_TOUCH_END(state, {x, y}) {
        state.endTime = Date.now();
        state.endPosition = {x, y};
    },
    SET_TOUCHED_ELEMENT(state, element) {
        state.elementAtTouchCoordinates = element;
    },
};

const actions = {
    startTouchEvent({commit}, {event, payload}) {
        commit('RECORD_TOUCH_START', {x: event.touches[0].clientX, y: event.touches[0].clientY, payload});
    },
    recordIfDrag({commit, state}, {x, y}) {
        if (state.isDrag) {
            return;
        }

        if (
            (Math.abs(x - state.startPosition.x) > MAXIMUM_CLICK_MOVEMENT) ||
            (Math.abs(y - state.startPosition.y) > MAXIMUM_CLICK_MOVEMENT)
        ) {
            commit('RECORD_HAS_BECOME_DRAG');
        }
    },
    setTouchMoveCoordinates({commit, dispatch}, {x, y}) {
        dispatch('recordIfDrag', {x, y});
        commit('RECORD_INTERIM_POSITION', {x, y});
        commit('SET_TOUCHED_ELEMENT', document.elementFromPoint(x, y));
    },
    endTouchEvent({commit, state}, event) {
        commit('RECORD_TOUCH_END', {x: event.changedTouches[0].clientX, y: event.changedTouches[0].clientY});
        const offset = {
            x: state.endPosition.x - state.startPosition.x,
            y: state.endPosition.y - state.startPosition.y,
        };
        const duration = state.endTime - state.startTime;
        return {
            offset,
            duration,
            isClick: (
                !state.isDrag &&
                Math.abs(offset.x) <= MAXIMUM_CLICK_MOVEMENT &&
                Math.abs(offset.y) <= MAXIMUM_CLICK_MOVEMENT &&
                duration <= MAXIMUM_CLICK_MILLISECONDS
            ),
            isDrag: state.isDrag,
        };
    },
};

const getters = {
    elementAtTouchCoordinates: (state) => state.elementAtTouchCoordinates,
    isDrag: (state) => state.isDrag,
    payload: (state) => state.payload,
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
