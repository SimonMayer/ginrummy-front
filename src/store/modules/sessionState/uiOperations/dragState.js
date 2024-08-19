const state = {
    draggedCardIds: [],
    dragImage: null,
    event: null,
    isDraggingCards: false,
};

const mutations = {
    REGISTER_DRAGGED_CARDS_IMAGE(state, dragImage) {
        state.dragImage = dragImage;
    },
    START_DRAGGING_CARDS(state, {cardIds, event}) {
        state.draggedCardIds = cardIds;
        state.isDraggingCards = true;
        state.event = event;
    },
    STOP_DRAGGING_CARDS(state) {
        state.isDraggingCards = false;
        state.event = null;
    },
    CLEAR_DRAGGED_CARDS(state) {
        state.draggedCardIds = [];
    },
};

const actions = {
    registerDraggedCardsImage({commit}, dragImage) {
        commit('REGISTER_DRAGGED_CARDS_IMAGE', dragImage);
    },
    async startDraggingCards({commit, dispatch, rootGetters, state}, {eventCardId, event}) {
        const selectedCardIds = rootGetters['sessionState/derived/selectedItems/allSelectedCardIds'];
        if (!selectedCardIds.includes(eventCardId)) {
            await dispatch('sessionState/uiOperations/selections/addSelectedCard', eventCardId, {root: true});
            selectedCardIds.push(eventCardId);
        }
        event.dataTransfer.dropEffect = 'move';
        event.dataTransfer.effectAllowed = 'move';
        event.dataTransfer.setDragImage(state.dragImage, 0, 0);

        commit('START_DRAGGING_CARDS', {cardIds: selectedCardIds, event});
    },
    stopDraggingCards({commit}) {
        commit('STOP_DRAGGING_CARDS');
    },
    clearDraggedCards({commit}) {
        commit('CLEAR_DRAGGED_CARDS');
    },
};

const getters = {
    event: (state) => state.event,
    isDraggingCards: (state) => state.isDraggingCards,
    draggedCardsCount: (state) => state.draggedCardIds.length,
    draggedCardIds: (state) => state.draggedCardIds,
};

export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters,
};
