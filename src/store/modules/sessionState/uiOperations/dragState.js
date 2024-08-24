const state = {
    draggedVisibleCardIds: [],
    draggedNamedHiddenCard: null,
    draggedVisibleCardsImage: null,
    draggedHiddenCardImage: null,
    simulatedDragImage: null,
    isDraggingItems: false,
};

const mutations = {
    REGISTER_DRAGGED_VISIBLE_CARDS_IMAGE(state, element) {
        state.draggedVisibleCardsImage = element;
    },
    REGISTER_DRAGGED_HIDDEN_CARD_IMAGE(state, element) {
        state.draggedHiddenCardImage = element;
    },
    START_DRAGGING_CARDS(state, {cardIds}) {
        state.draggedVisibleCardIds = cardIds;
        state.isDraggingItems = true;
    },
    START_DRAGGING_NAMED_HIDDEN_CARD(state, {name}) {
        state.draggedNamedHiddenCard = name;
        state.isDraggingItems = true;
    },
    STOP_DRAGGING_ITEMS(state) {
        state.isDraggingItems = false;
        state.simulatedDragImage = null;
    },
    CLEAR_DRAGGED_ITEMS(state) {
        state.draggedVisibleCardIds = [];
        state.draggedNamedHiddenCard = null;
    },
    SET_SIMULATED_DRAG_IMAGE(state, element) {
        state.simulatedDragImage = element;
    },
    REMOVE_SIMULATED_DRAG_IMAGE(state) {
        state.simulatedDragImage = null;
    },
};

const actions = {
    registerDraggedVisibleCardsImage({commit}, element) {
        commit('REGISTER_DRAGGED_VISIBLE_CARDS_IMAGE', element);
    },
    registerDraggedHiddenCardImage({commit}, element) {
        commit('REGISTER_DRAGGED_HIDDEN_CARD_IMAGE', element);
    },
    async startDraggingVisibleCards({commit, dispatch, rootGetters, state}, {eventCardId, event}) {
        const selectedCardIds = rootGetters['sessionState/derived/selectedItems/allSelectedCardIds'];
        if (!selectedCardIds.includes(eventCardId)) {
            await dispatch('sessionState/uiOperations/selections/addSelectedCard', eventCardId, {root: true});
            selectedCardIds.push(eventCardId);
        }
        if (event?.dataTransfer) {
            event.dataTransfer.dropEffect = 'move';
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setDragImage(state.draggedVisibleCardsImage, 0, 0);
        } else {
            dispatch('createSimulatedDragImage', state.draggedVisibleCardsImage);
        }

        dispatch('clearDraggedItems');
        commit('START_DRAGGING_CARDS', {cardIds: selectedCardIds});
    },
    async startDraggingNamedHiddenCard({commit, dispatch, state}, {name, event}) {
        if (event?.dataTransfer) {
            event.dataTransfer.dropEffect = 'move';
            event.dataTransfer.effectAllowed = 'move';
            event.dataTransfer.setDragImage(state.draggedHiddenCardImage, 0, 0);
        } else {
            dispatch('createSimulatedDragImage', state.draggedHiddenCardImage);
        }

        dispatch('clearDraggedItems');
        commit('START_DRAGGING_NAMED_HIDDEN_CARD', {name});
    },
    stopDraggingItems({commit, dispatch}) {
        dispatch('removeSimulatedDragImage');
        commit('STOP_DRAGGING_ITEMS');
    },
    clearDraggedItems({commit}) {
        commit('CLEAR_DRAGGED_ITEMS');
    },
    createSimulatedDragImage({commit}, element) {
        const clone = element.cloneNode(true);
        clone.style.position = 'absolute';
        clone.style.pointerEvents = 'none';
        clone.style.zIndex = '9999';
        document.body.appendChild(clone);
        commit('SET_SIMULATED_DRAG_IMAGE', clone);
    },
    updateSimulatedDragImagePosition({state}, {x, y}) {
        if (state.simulatedDragImage) {
            state.simulatedDragImage.style.left = `${x}px`;
            state.simulatedDragImage.style.top = `${y}px`;
        }
    },
    removeSimulatedDragImage({state, commit}) {
        if (state.simulatedDragImage) {
            document.body.removeChild(state.simulatedDragImage);
            commit('REMOVE_SIMULATED_DRAG_IMAGE');
        }
    },
};

const getters = {
    isDraggingItems: (state) => state.isDraggingItems,
    draggedNamedHiddenCard: (state) => state.draggedNamedHiddenCard,
    draggedVisibleCardCount: (state) => state.draggedVisibleCardIds.length,
    draggedVisibleCardIds: (state) => state.draggedVisibleCardIds,
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
